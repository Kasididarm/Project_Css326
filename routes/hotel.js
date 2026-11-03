const express = require('express');
const hotel = require('../controllers/hotel/controlles/hotelcontrollers');
const router = express.Router();
 
router.get('/room-types', hotel.getRoomTypes);
router.get('/rooms', hotel.getRooms);
router.get('/rooms/available', hotel.getAvailableRooms);
router.patch('/rooms/:roomNumber/status', hotel.updateRoomStatus);
 
router.post('/bookings', hotel.createBooking);
router.get('/bookings/:id', hotel.getBookingById);
router.patch('/bookings/:id/dates', hotel.updateBookingDates);
router.patch('/bookings/:id/status', hotel.updateBookingStatus);
router.get('/customers/:customerId/bookings', hotel.getBookingsByCustomer);
 
router.post('/bookings/:id/payments', hotel.createPayment);
router.get('/bookings/:id/payments', hotel.getPaymentsByBooking);
router.patch('/payments/:id', hotel.updatePayment);
 
module.exports = router;