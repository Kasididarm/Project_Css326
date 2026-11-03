USE hotel;

ALTER TABLE booking
    ADD COLUMN status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending';

DROP PROCEDURE IF EXISTS check_room_availability;
DROP PROCEDURE IF EXISTS get_customer_details;
DROP PROCEDURE IF EXISTS create_app_user;
DROP PROCEDURE IF EXISTS create_booking;

DELIMITER $$

CREATE PROCEDURE check_room_availability(
    IN  p_room_number INT,
    OUT p_available   BOOLEAN
)
BEGIN
    SET p_available = EXISTS(
        SELECT 1 FROM room
        WHERE room_number = p_room_number AND status = 'available'
    );
END$$

CREATE PROCEDURE get_customer_details(IN p_email VARCHAR(50))
BEGIN
    SELECT * FROM customer WHERE customer_email = p_email;
END$$

CREATE PROCEDURE create_app_user(
    IN p_username VARCHAR(50),
    IN p_password_hash VARCHAR(255),
    IN p_role ENUM('admin','staff','user')
)
BEGIN
    INSERT INTO app_user(username, password, role)
    VALUES (p_username, p_password_hash, p_role);
END$$

CREATE PROCEDURE create_booking(
    IN  p_customer_id INT,
    IN  p_room_id     INT,
    IN  p_check_in    DATE,
    IN  p_check_out   DATE,
    OUT p_booking_id  INT
)
BEGIN
    DECLARE v_room_status VARCHAR(20);
    DECLARE v_overlap_count INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_check_in >= p_check_out THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'check-out must be after check-in';
    END IF;

    START TRANSACTION;

    SELECT status INTO v_room_status FROM room WHERE id = p_room_id FOR UPDATE;

    IF v_room_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'room not found';
    END IF;

    SELECT COUNT(*) INTO v_overlap_count
    FROM booking
    WHERE room_id = p_room_id
      AND status <> 'cancelled'
      AND p_check_in < check_out_date
      AND p_check_out > check_in_date;

    IF v_overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'room is already booked for those dates';
    END IF;

    INSERT INTO booking(customer_id, room_id, check_in_date, check_out_date, status)
    VALUES (p_customer_id, p_room_id, p_check_in, p_check_out, 'pending');

    SET p_booking_id = LAST_INSERT_ID();

    COMMIT;
END$$

DELIMITER ;