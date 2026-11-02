USE hotel;
CREATE PROCEDURE check_room_availability(IN room_number INT,OUT room_available BOOLEAN)
BEGIN
    SELECT room_available INTO room_available
    FROM room
    WHERE room_number = room_number;
END
CREATE PROCEDURE get_customer_details (IN customer_email VARCHAR(50))
BEGIN
    SELECT *
    FROM customer
    WHERE email = customer_email;
END
TRANCATE TABLE room;
TRUNCATE TABLE customer;
CREATE PROCEDURE app_user(IN username VARCHAR(50),IN password VARCHAR(255),IN role ENUM('admin','staff','user'))
BEGIN
    INSERT INTO app_user(username,password,role) VALUES(username,password,role);
END