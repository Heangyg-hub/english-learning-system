'use strict';

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '', trim: true },
  icon: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

programSchema.index({ order: 1 });

module.exports = mongoose.model('Program', programSchema);

