const pool = require('../../../db');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, customer_email, customer_phone }) {
  if (!name || !customer_email || !customer_phone) {
    return 'name, customer_email and customer_phone are required';
  }
  if (name.length > 50) return 'name must be at most 50 characters';
  if (customer_email.length > 50 || !EMAIL_RE.test(customer_email)) return 'invalid customer_email';
  if (customer_phone.length > 15) return 'customer_phone must be at most 15 characters';
  return null;
}

function handleError(res, err) {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'email is already in use' });
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ error: 'customer has bookings and cannot be deleted' });
  }
  console.error(err);
  return res.status(500).json({ error: 'internal server error' });
}

exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer ORDER BY id');
    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'customer not found' });
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCustomerByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email is required' });
  try {
    const [results] = await pool.query('CALL get_customer_details(?)', [email]);
    const rows = results[0];
    if (rows.length === 0) return res.status(404).json({ error: 'customer not found' });
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err);
  }
};

exports.createCustomer = async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { name, customer_email, customer_phone } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO customer(name, customer_email, customer_phone) VALUES (?, ?, ?)',
      [name, customer_email, customer_phone]
    );
    res.status(201).json({ id: result.insertId, name, customer_email, customer_phone });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateCustomer = async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { name, customer_email, customer_phone } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE customer SET name = ?, customer_email = ?, customer_phone = ? WHERE id = ?',
      [name, customer_email, customer_phone, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'customer not found' });
    res.json({ id: Number(req.params.id), name, customer_email, customer_phone });
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM customer WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'customer not found' });
    res.status(204).end();
  } catch (err) {
    handleError(res, err);
  }
};