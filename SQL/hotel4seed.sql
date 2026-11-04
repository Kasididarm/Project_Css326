<<<<<<< HEAD
USE hotel;

INSERT INTO room_type(id, name, description, price) VALUES
    (1, 'Standard', 'Standard room with basic amenities',             100.00),
    (2, 'Superior', 'Superior room with additional features',         120.00),
    (3, 'Deluxe',   'Deluxe room with additional amenities',          150.00),
    (4, 'Studio',   'Studio room with modern design and kitchenette', 170.00),
    (5, 'Suite',    'Suite with separate living room',                250.00);

INSERT INTO room(id, room_type_id, room_number) VALUES
    (1, 1, 101),
    (2, 2, 102),
    (3, 3, 103),
    (4, 4, 104),
    (5, 5, 105);

INSERT INTO customer(id, name, customer_email, customer_phone) VALUES
    (1, 'Alice Johnson', 'alice@email.com', '555-1234'),
    (2, 'Bob Smith',     'bob@email.com',   '555-5687');

INSERT INTO booking(id, customer_id, room_id, check_in_date, check_out_date, status) VALUES
    (1, 1, 1, '2024-06-01', '2024-06-05', 'confirmed'),
    (2, 2, 2, '2024-06-10', '2024-06-13', 'confirmed'),
    (3, 1, 3, '2024-06-15', '2024-06-20', 'confirmed');

INSERT INTO payment(booking_id, amount, payment_date) VALUES
    (1, 400.00, '2024-06-01'),
    (2, 360.00, '2024-06-10'),
    (3, 750.00, '2024-06-15');

INSERT INTO admin(id, name, admin_email, admin_phone) VALUES
    (1, 'admin',   'admin@email.com',   '555-0000'),
    (2, 'manager', 'manager@email.com', '555-1111');
