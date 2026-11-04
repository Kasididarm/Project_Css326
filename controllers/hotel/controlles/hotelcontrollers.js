const pool = require('../../../db');
const wrap = (fn) => async (req, res) => {

  try {
    await fn(req, res);
  } catch (err) {
    if (err.sqlState === '45000') return res.status(400).json({ error: err.sqlMessage });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'related record not found' });
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
};
const bad = (res, msg) => res.status(400).json({ error: msg });
const notFound = (res, what) => res.status(404).json({ error: `${what} not found` });

const ROOM_JOIN = 'JOIN room r ON r.id = b.room_id JOIN room_type t ON t.id = r.room_type_id';
const OVERLAP = "status <> 'cancelled' AND check_in_date < ? AND check_out_date > ?";

// Room
exports.getRoomTypes = wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM room_type ORDER BY price');
  res.json(rows);
});

exports.getRooms = wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.room_number, r.status, t.name AS room_type, t.price
     FROM room r JOIN room_type t ON t.id = r.room_type_id ORDER BY r.room_number`);
  res.json(rows);
});

exports.getAvailableRooms = wrap(async (req, res) => {
  const { check_in, check_out } = req.query;
  if (!check_in || !check_out || check_in >= check_out) return bad(res, 'valid check_in and check_out are required');
  const [rows] = await pool.query(
    `SELECT r.id, r.room_number, t.name AS room_type, t.price
     FROM room r JOIN room_type t ON t.id = r.room_type_id
     WHERE NOT EXISTS (SELECT 1 FROM booking WHERE room_id = r.id AND ${OVERLAP})
     ORDER BY t.price, r.room_number`, [check_out, check_in]);
  res.json(rows);
});

exports.updateRoomStatus = wrap(async (req, res) => {
  const { status } = req.body;
  if (!['available', 'booked'].includes(status)) return bad(res, 'invalid status');
  const [r] = await pool.query('UPDATE room SET status = ? WHERE room_number = ?', [status, req.params.roomNumber]);
  if (!r.affectedRows) return notFound(res, 'room');
  res.json({ room_number: Number(req.params.roomNumber), status });
});

// Booking
exports.createBooking = wrap(async (req, res) => {
  const { customer_id, room_id, check_in, check_out } = req.body;
  if (!customer_id || !room_id || !check_in || !check_out) return bad(res, 'missing fields');
  const conn = await pool.getConnection(); // @bid อยู่ใน session จึงต้องใช้ connection เดียวกัน
  try {
    await conn.query('CALL create_booking(?, ?, ?, ?, @bid)', [customer_id, room_id, check_in, check_out]);
    const [[{ id }]] = await conn.query('SELECT @bid AS id');
    res.status(201).json({ booking_id: id, status: 'pending' });
  } finally {
    conn.release();
  }
});

exports.getBookingById = wrap(async (req, res) => {
  const [[row]] = await pool.query(
    `SELECT b.*, c.name AS customer_name, r.room_number, t.name AS room_type, t.price
     FROM booking b JOIN customer c ON c.id = b.customer_id ${ROOM_JOIN} WHERE b.id = ?`, [req.params.id]);
  row ? res.json(row) : notFound(res, 'booking');
});

exports.getBookingsByCustomer = wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, r.room_number, t.name AS room_type FROM booking b ${ROOM_JOIN}
     WHERE b.customer_id = ? ORDER BY b.check_in_date DESC`, [req.params.customerId]);
  res.json(rows);
});

exports.updateBookingDates = wrap(async (req, res) => {
  const { check_in, check_out } = req.body;
  const id = req.params.id;
  if (!check_in || !check_out || check_in >= check_out) return bad(res, 'valid check_in and check_out are required');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[b]] = await conn.query('SELECT room_id FROM booking WHERE id = ? FOR UPDATE', [id]);
    if (!b) { await conn.rollback(); return notFound(res, 'booking'); }
    await conn.query('SELECT id FROM room WHERE id = ? FOR UPDATE', [b.room_id]);
    const [[{ n }]] = await conn.query(
      `SELECT COUNT(*) AS n FROM booking WHERE room_id = ? AND id <> ? AND ${OVERLAP}`,
      [b.room_id, id, check_out, check_in]);
    if (n > 0) { await conn.rollback(); return bad(res, 'room is already booked for those dates'); }
    await conn.query('UPDATE booking SET check_in_date = ?, check_out_date = ? WHERE id = ?', [check_in, check_out, id]);
    await conn.commit();
    res.json({ booking_id: Number(id), check_in, check_out });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

exports.updateBookingStatus = wrap(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) return bad(res, 'invalid status');
  const [r] = await pool.query('UPDATE booking SET status = ? WHERE id = ?', [status, req.params.id]);
  if (!r.affectedRows) return notFound(res, 'booking');
  res.json({ booking_id: Number(req.params.id), status });
});

// Payment
exports.createPayment = wrap(async (req, res) => {
  const { amount, payment_date } = req.body;
  if (!(Number(amount) > 0) || !payment_date) return bad(res, 'amount (> 0) and payment_date are required');
  const [r] = await pool.query('INSERT INTO payment(booking_id, amount, payment_date) VALUES (?, ?, ?)',
    [req.params.id, amount, payment_date]);
  res.status(201).json({ payment_id: r.insertId, amount, payment_date });
});

exports.getPaymentsByBooking = wrap(async (req, res) => {
  const [[b]] = await pool.query(
    `SELECT DATEDIFF(b.check_out_date, b.check_in_date) * t.price AS due FROM booking b ${ROOM_JOIN} WHERE b.id = ?`,
    [req.params.id]);
  if (!b) return notFound(res, 'booking');
  const [payments] = await pool.query('SELECT * FROM payment WHERE booking_id = ? ORDER BY payment_date', [req.params.id]);
  const paid = payments.reduce((s, p) => s + Number(p.amount), 0);
  res.json({ total_due: Number(b.due), total_paid: paid, balance: Number(b.due) - paid, payments });
});

exports.updatePayment = wrap(async (req, res) => {
  const { amount, payment_date } = req.body;
  if (!(Number(amount) > 0) || !payment_date) return bad(res, 'amount (> 0) and payment_date are required');
  const [r] = await pool.query('UPDATE payment SET amount = ?, payment_date = ? WHERE id = ?',
    [amount, payment_date, req.params.id]);
  if (!r.affectedRows) return notFound(res, 'payment');
  res.json({ payment_id: Number(req.params.id), amount, payment_date });
});
