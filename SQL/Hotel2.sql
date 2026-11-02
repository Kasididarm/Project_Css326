USE hotel;
SELECT * FROM customer WHERE customer_email=? and customer_phone=?;
SELECT * FROM room_type WHERE name=? and price=?;
UPDATE booking SET check_in_date=?,check_out_date=? WHERE customer_id=? and
room_id=?;
SELECT * FROM booking WHERE customer_id=? and room_id=?;
UPDATE room SET status='booked' WHERE room_number=?;
UPDATE payment SET amount=?,payment_date=? WHERE booking_id=?;
SELECT * FROM room WHERE room_number=0 and status='available';
UPDATE room SET status='available ' WHERE room_type_id=? and room_number=?;
