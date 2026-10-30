USE hotel;
INSERRT into room (name,room_avaliable,room_number){
    VALUE('DELUX',1,101)
    VALUE('John Doe',1,102)
    VALUE('Jane Smith',1,103)
}
INSERT into customer(name,customer_email,customer_phone){
    VALUE('Alice Johnson','alice@emailple.com','555-1234');
    VALUE ('Bob Smith','bob@email.com',555-5687);
}
INSERT into booking(customer_id,room_id,check_in_date,check_out_date){}