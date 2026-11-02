SELECT * FROM customer WHERE customer_email=? and customer_phone=?;
SELECT * FROM room_type WHERE name=? and price=?;
UPDATE booking SET check_in_date=?,check_out_date=? WHERE customer_id=? and
room_id=?;
UPDATE room_availability SET room_available=0 WHERE room_number=?;
SELECT * FROM booking WHERE customer_id=? and room_id=?;
UPDATE room SET status='booked' WHERE room_number=?;
UPDATE payment SET amount=?,payment_date=? WHERE booking_id=?;
SELECT * FROM room WHERE room_number=? and status='available';