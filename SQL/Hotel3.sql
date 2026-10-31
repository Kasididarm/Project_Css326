CREATE PROCEDURE check_room_availability(IN room_number INT,OUT room_available BOOLEAN)
BEGIN
    SELECT room_available INTO room_available
    FROM room
    WHERE room_number = room_number;
END