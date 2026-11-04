const params = new URLSearchParams(window.location.search);

const bookingId = params.get("booking_id");


async function loadBooking() {

    const response = await fetch(
        `/hotel/bookings/${bookingId}`
    );

    const booking = await response.json();

    document.getElementById("bookingId").textContent =
        booking.id;

    document.getElementById("room").textContent =
        `${booking.room_type} Room ${booking.room_number}`;

    document.getElementById("checkin").textContent =
        booking.check_in_date;

    document.getElementById("checkout").textContent =
        booking.check_out_date;

    document.getElementById("status").textContent =
        booking.status;
}

async function cancelBooking() {

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

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Cannot cancel booking");
        return;
    }

    document.getElementById("status").textContent =
        "cancelled";

    alert("Booking cancelled.");
}


loadBooking();