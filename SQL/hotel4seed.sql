<<<<<<< HEAD
USE hotel;

INSERT INTO room_type(id, name, description, price) VALUES
    (1, 'Standard', 'Standard room with basic amenities', 100.00),
    (2, 'Superior', 'Superior room with additional features', 120.00),
    (3, 'Deluxe',   'Deluxe room with additional amenities', 150.00),
    (4, 'Suite',    'Suite room with luxurious features', 210.00),
    (5, 'Studio',   'Studio room with modern design and amenities', 219.00);

INSERT INTO room(room_type_id, room_number) VALUES
    (1, 101),
    (2, 102),
    (3, 103),
    (4, 104),
    (5, 105);

INSERT INTO customer(id, name, customer_email, customer_phone) VALUES
    (1, 'Alice Johnson', 'alice@email.com', '555-1234'),
    (2, 'Bob Smith',     'bob@email.com',   '555-5687');

INSERT INTO booking(customer_id, room_id, check_in_date, check_out_date) VALUES
    (1, 1, '2024-06-01', '2024-06-05'),
    (2, 2, '2024-06-10', '2024-06-13'),
    (1, 3, '2024-06-15', '2024-06-20');

INSERT INTO payment(booking_id, amount, payment_date) VALUES
    (1, 500.00, '2024-06-01'),
    (2, 300.00, '2024-06-10'),
    (3, 400.00, '2024-06-15');

INSERT INTO admin(id, name, admin_email, admin_phone) VALUES
    (1, 'admin',   'admin@email.com',   '555-0000'),
    (2, 'manager', 'manager@email.com', '555-1111');
