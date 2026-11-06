'use strict';

const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  english: { type: String, required: true, trim: true },
  khmer: { type: String, default: '', trim: true },
  structure: { type: String, default: '', trim: true },
  vocabularyNotes: [{ type: String, trim: true }]
}, { _id: false });

const collocationSchema = new mongoose.Schema({
  phrase: { type: String, required: true, trim: true },
  khmerMeaning: { type: String, default: '', trim: true },
  example: { type: String, default: '', trim: true },
  exampleKhmer: { type: String, default: '', trim: true }
}, { _id: false });

const meaningSchema = new mongoose.Schema({
  partOfSpeech: {
    type: String,
    required: true,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'phrase', 'idiom'],
    lowercase: true,
    trim: true
  },
  khmerMeaning: { type: String, required: true, trim: true },
  structures: [{ type: String, trim: true }],
  usageKhmer: { type: String, default: '', trim: true },
  examples: [exampleSchema],
  collocations: [collocationSchema],
  order: { type: Number, default: 0 }
});

const vocabularySchema = new mongoose.Schema({
  language: { type: String, default: 'english', immutable: true },
  word: { type: String, required: true, trim: true, index: true },
  pronunciation: { type: String, default: '', trim: true }, // e.g. /əˈbændən/
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'],
    default: 'easy',
    index: true
  },

  tags: [{ type: String, trim: true, index: true }],
  topics: [{ type: String, trim: true, index: true }],
  noteKhmer: { type: String, default: '', trim: true },

  meanings: [meaningSchema],

  synonyms: [{
    word: { type: String, required: true, trim: true },
    khmerMeaning: { type: String, default: '', trim: true },
    differenceKhmer: { type: String, default: '', trim: true }
  }],

  antonyms: [{
    word: { type: String, required: true, trim: true },
    khmerMeaning: { type: String, default: '', trim: true }
  }],

  relatedWords: [{
    word: { type: String, required: true, trim: true },
    khmerMeaning: { type: String, default: '', trim: true },
    relationship: { type: String, default: '', trim: true }
  }],

  phrasalVerbs: [{
    phrase: { type: String, required: true, trim: true },
    khmerMeaning: { type: String, default: '', trim: true },
    example: { type: String, default: '', trim: true },
    exampleKhmer: { type: String, default: '', trim: true }
  }],

  idioms: [{
    phrase: { type: String, required: true, trim: true },
    khmerMeaning: { type: String, default: '', trim: true },
    example: { type: String, default: '', trim: true },
    exampleKhmer: { type: String, default: '', trim: true }
  }],

  imageUrl: { type: String, default: '', trim: true },
  audioUrl: { type: String, default: '', trim: true },
  isVerified: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  versionKey: false
});

// Full-text search index
vocabularySchema.index({ word: 'text', 'meanings.khmerMeaning': 'text', tags: 'text' });

module.exports = mongoose.model('Vocabulary', vocabularySchema);

