SELECT * FROM room WHERE room_number=? and room_avaliable=1;
SELECT * FROM customer WHERE customer_email=? and customer_phone=?;
UPDATE booking SET check_in_date=?,check_out_date=? WHERE customer_id=? and
room_id=?;
SELECT * FROM booking WHERE customer_id=? and room_id=?;
UPDATE room SET room_avaliable=0 WHERE room_number=?;
UPDATE payment SET amount=?,payment_date=? WHERE booking_id=?;
