const form = document.getElementById("bookingform");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="title"]:checked');
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const room = document.getElementById("room").value;

    console.log("Title:", title ? title.value : "");
    console.log("First name:", fname);
    console.log("Last name:", lname);
    console.log("Check in:", checkin);
    console.log("Check out:", checkout);
    console.log("Room:", room);
});