USE hotel;

SELECT * FROM customer WHERE customer_email = 'alice@email.com';

SELECT * FROM room_type WHERE name = 'Standard';

UPDATE booking SET check_in_date = '2026-12-10', check_out_date = '2026-12-12' WHERE id = 1;

SELECT * FROM booking WHERE customer_id = 'alice@email.com' AND room_id = ?;

UPDATE room SET status = 'booked' WHERE room_number = ?;

UPDATE payment SET amount = ?, payment_date = ? WHERE id = ?;

SELECT * FROM room WHERE room_number = ? AND status = 'available';

UPDATE room SET status = 'available' WHERE room_number = ?;