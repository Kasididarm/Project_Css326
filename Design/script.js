const form = document.getElementById("bookingform");
const message = document.getElementById("booking-message");
const submitButton = form.querySelector('button[type="submit"]');

async function requestJson(url, options) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
    }
    return data;
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="title"]:checked');
    const firstName = document.getElementById("fname").value.trim();
    const lastName = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;
    const requestedRoomType = document.getElementById("room").value.toLowerCase();

    message.textContent = "Checking room availability...";
    submitButton.disabled = true;

    try {
        const query = new URLSearchParams({ check_in: checkIn, check_out: checkOut });
        const availableRooms = await requestJson(`/hotel/rooms/available?${query}`);
        const room = availableRooms.find(
            (item) => item.room_type.toLowerCase() === requestedRoomType
        );
        if (!room) {
            throw new Error("No room of that type is available for those dates.");
        }

        const customers = await requestJson("/customers");
        let customer = customers.find(
            (item) => item.customer_email.toLowerCase() === email.toLowerCase()
        );

        if (!customer) {
            const name = [title?.value, firstName, lastName].filter(Boolean).join(" ");
            customer = await requestJson("/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, customer_email: email, customer_phone: phone })
            });
        }

        const booking = await requestJson("/hotel/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_id: customer.id,
                room_id: room.id,
                check_in: checkIn,
                check_out: checkOut
            })
        });

        message.textContent = `Booking #${booking.booking_id} created (${booking.status}). Room ${room.room_number}.`;
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});
