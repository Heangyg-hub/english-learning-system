'use strict';

const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true }, // e.g. A1, A2, B1, B2, C1
  description: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

levelSchema.index({ programId: 1, order: 1 });

module.exports = mongoose.model('Level', levelSchema);

