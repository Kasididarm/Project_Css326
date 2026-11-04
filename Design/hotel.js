const params = new URLSearchParams(window.location.search);

let checkin = params.get("check_in");
let checkout = params.get("check_out");
const roomType = params.get("room_type");
let currentBookingId = null;

document.getElementById("showCheckin").textContent = checkin;
document.getElementById("showCheckout").textContent = checkout;
document.getElementById("showRoomType").textContent = roomType;


const roomImages = {
    standard: "messageImage_1793708464561.jpg",
    superior: "images.jpg",
    deluxe: "messageImage_1793708743049.jpg",
    studio: "images (2).jpg",
    suite: "images (1).jpg"
};

async function loadRooms() {

    const roomList = document.getElementById("roomList");

    try {

        const response = await fetch(
            `/hotel/rooms/available?check_in=${checkin}&check_out=${checkout}`
        );

        const rooms = await response.json();

        console.log("Rooms from database:", rooms);

        if (!response.ok) {
            throw new Error(rooms.error || "Cannot load rooms");
        }

        const filteredRooms = rooms.filter(room =>
            room.room_type.toLowerCase() === roomType.toLowerCase()
        );

        console.log("Filtered rooms:", filteredRooms);

        roomList.innerHTML = "";

        if (filteredRooms.length === 0) {

            roomList.innerHTML = `
                <p>No available ${roomType} rooms for these dates.</p>
            `;

            return;
        }

        filteredRooms.forEach(room => {

            const card = document.createElement("div");

            card.className = "room-card";

            card.innerHTML = `
                <img
                    src="${roomImages[room.room_type.toLowerCase()]}"
                    width="300"
                    alt="${room.room_type} room"
                >
            <div class="room-info">

                <h2>${room.room_type} Room</h2>

                <p>Room ${room.room_number}</p>

                <p>$${room.price} / night</p>

                <button class="book-btn" onclick="bookRoom(${room.id})">
                    Book
                </button>
            </div>
            `;

            roomList.appendChild(card);
        });

    } catch (error) {

        console.error("Load rooms error:", error);

        roomList.innerHTML = `
            <p>Unable to load rooms.</p>
        `;
    }
}

async function getOrCreateCustomer() {

    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");
    const email = sessionStorage.getItem("email");
    const phone = sessionStorage.getItem("phone");


    if (!email || !phone) {
        throw new Error("Customer information is missing");
    }

    const searchResponse = await fetch(
        `/customers/search?email=${encodeURIComponent(email)}`
    );

    if (searchResponse.ok) {

        const customer = await searchResponse.json();

        console.log("Existing customer:", customer);

        return customer;
    }

    if (searchResponse.status === 404) {

        const createResponse = await fetch("/customers", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: `${firstName} ${lastName}`,
                customer_email: email,
                customer_phone: phone
            })
        });


        const customer = await createResponse.json();


        if (!createResponse.ok) {
            throw new Error(
                customer.error || "Cannot create customer"
            );
        }


        console.log("New customer:", customer);

        return customer;
    }


    throw new Error("Cannot find customer");
}

async function bookRoom(roomId) {

    try {
        const customer = await getOrCreateCustomer();

        const response = await fetch("/hotel/bookings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                customer_id: customer.id,
                room_id: roomId,
                check_in: checkin,
                check_out: checkout
            })
        });


        const booking = await response.json();
        currentBookingId = booking.booking_id;


        if (!response.ok) {
            throw new Error(
                booking.error || "Cannot create booking"
            );
        }


        console.log("Booking:", booking);

        window.location.href =
            `success.html?booking_id=${booking.booking_id}`;


    } catch (error) {

        console.error("Booking error:", error);

        alert(error.message);
    }
}

async function changeDate() {

    if (!currentBookingId) {
        alert("Please book a room first.");
        return;
    }

    const newCheckin =
        document.getElementById("newCheckin").value;

    const newCheckout =
        document.getElementById("newCheckout").value;

    if (!newCheckin || !newCheckout) {
        alert("Please select new dates.");
        return;
    }

    const response = await fetch(
        `/hotel/bookings/${currentBookingId}/dates`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                check_in: newCheckin,
                check_out: newCheckout
            })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Cannot change date.");
        return;
    }

    checkin = newCheckin;
    checkout = newCheckout;

    document.getElementById("showCheckin").textContent = checkin;
    document.getElementById("showCheckout").textContent = checkout;

    alert("Booking date updated.");
}

function showBooking(booking) {

    document.getElementById("myBooking").innerHTML = `
        <h2>My Booking</h2>

        <p>Booking ID: ${booking.booking_id}</p>

        <p>Room type: ${roomType}</p>

        <p>Check in: ${checkin}</p>

        <p>Check out: ${checkout}</p>

        <p>Status: ${booking.status}</p>

        ${
            booking.status !== "cancelled"
                ? `
                    <button onclick="cancelBooking(${booking.booking_id})">
                        Cancel Booking
                    </button>
                `
                : ""
        }
    `;
}

async function cancelBooking(bookingId) {

    try {

        const response = await fetch(
            `/hotel/bookings/${bookingId}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: "cancelled"
                })
            }
        );


        const booking = await response.json();

        const confirmedBooking = await confirmResponse.json();

        showBooking(confirmedBooking);
        
        if (!response.ok) {
            alert(booking.error || "Cannot create booking");
            return;
}

        if (!response.ok) {
            throw new Error(
                booking.error || "Cannot cancel booking"
            );
        }


        console.log("Cancelled booking:", booking);

        showBooking(booking);

    } catch (error) {

        console.error("Cancel error:", error);

        alert(error.message);
    }
}

loadRooms();