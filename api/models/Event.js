//import mongoose in the application
const mongoose = require('mongoose');

// Define a schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    capacity: { type: Number, default: 100 },
    category: { type: String, required: true, default: 'Cultural' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);