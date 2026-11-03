const express = require('express');
const customer = require('../controllers/hotel/controlles/customercontrollers');
const router = express.Router();

router.get('/', customer.getAllCustomers);
router.get('/search', customer.getCustomerByEmail);
router.get('/:id', customer.getCustomerById);
router.post('/', customer.createCustomer);
router.put('/:id', customer.updateCustomer);
router.delete('/:id', customer.deleteCustomer);

module.exports = router;