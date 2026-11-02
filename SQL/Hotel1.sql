USE hotel;
CREATE DATABSE IF NOT EXISTS hotel;
CREATE TABLE room(
    id INT PRIMARY KRY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    room_avaliable BOOLEAN NOT NULL,
    room_number INT NOT NULL,
    PRIMARY KEY(id),
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


INSERT into room (id,name,room_avaliable,room_number){
    VALUE(1,'DELUX',1,101)
    VALUE(2,'John Doe',1,102)
    VALUE(3,'Jane Smith',1,103)
}
INSERT into customer(id,name,customer_email,customer_phone){
    VALUE(1,'Alice Johnson','alice@emailple.com','555-1234');
    VALUE (2,'Bob Smith','bob@email.com','555-5687');
}
INSERT into booking(customer_id,room_id,check_in_date,check_out_date){
    VALUE(1,1,'2024-06-01','2024-06-05');
    VALUe(2,2,'2024-06-10','2024');
    VALUE(1,3,'2024-06-15','2024-06-20')
}
INSERT into payment(booking_id,amount,payment_date){
    VALUE(1,500.00,'2024-06,01');
    VALUE(2,300.00,'2024-06-10');
    VALUE(3,400.00,'2024-06-15');
}
INSERT into admin(id ,name,admin_email,admin_phone){
    VALUE(1,'admin','admin@email.com','555-0000');
    VALUE(2,'manager','maneger@email.com','555-1111');
}
INSERT into room_type(id,name,description,price){
    VALUE(1,'Standard','Standard rooom with basic amenities ',100.00);
    VALUE(2,'Superior','Superior room with additonal feature ',120.00);
    VALUE(3,'Deluxe','Deluxe room with additional amenities',150.00);
    VALUE(4,'Suite','Suite room with luxurious features ',210.00);
    VALUE(5,'Studio','Studio room with modern design and amenities',219.00);
}