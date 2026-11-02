USE hotel;
CREATE DATABSE IF NOT EXISTS hotel;

DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS room_type;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS app_user;
CREATE TABLE room(
    id INT PRIMARY KRY AUTO_INCREMENT,
    room_type_id INT NOT NULL,
    room_number INT NOT NULL UNIQUE,
    status ENUM('available','booked') NOT NULL DEFAULT 'available',
    FOREIGN KEY(room_type_id) REFERENCES room_type(id)
)
CREATE TABLE customer(
    id INT PRIMARY KRY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    customer_email VARCHAR(50) NOT NULL,
    cutomer_phone VARCHAR(15) NOT NULL,
    PRIMARY KEY(id),
)
CREATE TABLE booking(
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customer(id),
    FOREIGN KEY(room_id) REFERENCES room(id)
)
CREATE TABLE payment(
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES booking(id);
)
CREATE TABLE room_type(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL (10,2) NOT NULL
)
CREATE TABLE admin(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    admin_email VARCHAR(50) NOT NULL,
    admin_phone VARCHAR(15) NOT NULL
);
CREATE TABLE app_user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','staff','user') NOT NULL DEFAULT 'user',
    customer_id INT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE SET NULL
)

