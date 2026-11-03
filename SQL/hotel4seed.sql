USE hotel
INSERT into customer(id,name,customer_email,customer_phone){
    VALUE(1,'Alice Johnson','alice@emailple.com','555-1234');
    VALUE (2,'Bob Smith','bob@email.com','555-5687');
}
INSERT into booking(customer_id,room_id,check_in_date,check_out_date){
    VALUE(1,1,'2024-06-01','2024-06-05');
    VALUe(2,2,'2024-06-10','2024-06-13');
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
INSERT into 
INSERT into room(room_type_id,room_number) VALUES
    (1,101),
    (2,102),
    (3,103),
    (4,104),
    (5,105);