const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') }); // load .env first 

const express = require('express'); 
const hotelRouter = require('./routes/hotel'); 
const customersRouter = require('./routes/customer'); 

const app = express(); 

app.use(express.json()); 
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Design', 'Index.html')));
app.use(express.static(path.join(__dirname, 'Design')));
app.use('/Design', express.static(path.join(__dirname, 'Design')));
app.use('/Design2', express.static(path.join(__dirname, 'Design2')));

// Updated API routes for a Hotel System
app.use('/hotel', hotelRouter); 
app.use('/customers', customersRouter); 

// 404 Handler
app.use((req, res) => res.status(404).json({ error: 'Not found' })); 

const PORT = Number(process.env.PORT || 3000); 

if (require.main === module) { 
    app.listen(PORT, () => console.log(`Hotel Management server running on http://localhost:${PORT}`)); 
} 

module.exports = app;
