const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') }); // load .env first 

const express = require('express'); 
const hotelRouter = require('./routes/hotel'); 
const customersRouter = require('./routes/customers'); 

const app = express(); 

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // Front-end entry point

// Updated API routes for a Hotel System
app.use('/hotel', hotelRouter); 
app.use('/customers', customersRouter); 

// 404 Handler
app.use((req, res) => res.status(404).json({ error: 'Not found' })); 

const PORT = Number(process.env.PORT || 3000); 

if (require.main === module) { 
    app.listen(PORT, () => console.log(`Hotel Management server running on http://localhost:${PORT}`)); 
} 

module.exports = app;;