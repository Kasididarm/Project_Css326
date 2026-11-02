USE hotel;
SET FOREIGN_KEY_CHECKS=0;
CREATE PROCEDURE check_room_availability(IN room_number INT,OUT room_available BOOLEAN)
BEGIN
    SELECT room_available INTO room_available
    FROM room
    WHERE room_number = 0 and status='available';
END
CREATE PROCEDURE get_customer_details (IN customer_email VARCHAR(50))
BEGIN
    SELECT *
    FROM customer
    WHERE email = customer_email;
END
TRUNCATE TABLE room;
TRUNCATE TABLE customer;
CREATE PROCEDURE app_user(IN username VARCHAR(50),IN password VARCHAR(255),IN role ENUM('admin','staff','user'))
BEGIN
     
    INSERT INTO app_user(username,password,role) VALUES(username,password,role);
END
CREATE PROCEDURE booking(IN p_customer_id INT,IN p_room_id INT,IN p_check_in DATE,IN p_check_out DATE)
BEGIN
    DECLARE v_room_status VARCHAR(20);
    DECLARE v_overlap_count INT;
    DECLARE  EXIT HANDLER FOR SQLEXCEPTION
    BEGIN 
        ROLLBACK;
        RESIGNAL;
    END;
    
    IF p_check_in >=p_check_out THEN
        SIGNAL SQLSTATE '45000'SET MESSAGE_TEXT='check-out must be after check-in';
    END IF;
    IF NOT EXISTS(SELECT 1 FROM room WHERE id=p_room_id AND status='available') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='room is not available';
    END IF;
    START TRANSACTION;
    SELECT status INTO v_room_status FROM room WHERE id=p_room_id FOR UPDATE;
    IF v_room_status='booked'THEN
        SIGNAL SQLSTATE '45000'SET MESSAGE_TEXT='room is already booked';
    END IF;
    IF v_room_status<>'available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='room is not available';
    END IF;
    SELECT COUNT(*) INTO v_overlap_count FROM booking WHERE room_id=p_room_id
    AND (p_check_in < check_out_date AND p_check_out > check_in_date);
    IF v_overlap_count>0 THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='room is already for those dates';
    END IF:
    INSERT INTO booking(customer_id,room_id,check_in_date,check_out_date,status) VALUE(p_customer_id,p_room_id,p_check_in,p_check_out,'pending');
    SET p_booking_id=LAST_INSERT_ID();

    COMMIT;
END