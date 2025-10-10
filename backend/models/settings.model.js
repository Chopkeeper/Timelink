const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
    // Using a fixed key to ensure only one settings document exists
    key: { type: String, default: "main_settings", unique: true }, 
    officeLocation: { type: LocationSchema, required: true },
    checkInRadiusMeters: { type: Number, required: true }
});

module.exports = mongoose.model('Settings', SettingsSchema);
