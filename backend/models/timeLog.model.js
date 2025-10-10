const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number },
}, { _id: false });

const TimeLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: 'User' },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkIn: { type: Date },
  checkOut: { type: Date },
  checkInLocation: LocationSchema,
  checkOutLocation: LocationSchema,
});

// Create a compound index to ensure one log per user per day
TimeLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TimeLog', TimeLogSchema);
