USE hotel;

SELECT * FROM customer WHERE customer_email = ?;

SELECT * FROM room_type WHERE name = ?;

UPDATE booking SET check_in_date = ?, check_out_date = ? WHERE id = ?;

SELECT * FROM booking WHERE customer_id = ? AND room_id = ?;

UPDATE room SET status = 'booked' WHERE room_number = ?;

UPDATE payment SET amount = ?, payment_date = ? WHERE id = ?;

SELECT * FROM room WHERE room_number = ? AND status = 'available';

UPDATE room SET status = 'available' WHERE room_number = ?;