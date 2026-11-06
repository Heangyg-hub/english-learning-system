'use strict';

const Vocabulary = require('../models/Vocabulary.model');
const ApiError = require('../utils/ApiError');

class VocabularyService {
  async getAllVocabulary(queryParams = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      difficulty,
      topic,
      tag,
      partOfSpeech,
      isVerified,
    } = queryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    if (topic) {
      filter.topics = topic;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (partOfSpeech) {
      filter['meanings.partOfSpeech'] = partOfSpeech.toLowerCase();
    }

    if (isVerified !== undefined && isVerified !== '') {
      filter.isVerified = isVerified === 'true' || isVerified === true;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { word: searchRegex },
        { 'meanings.khmerMeaning': searchRegex },
        { 'meanings.examples.english': searchRegex },
        { 'meanings.examples.khmer': searchRegex },
        { tags: searchRegex },
        { topics: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      Vocabulary.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Vocabulary.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  async getVocabularyById(id) {
    const vocab = await Vocabulary.findById(id);
    if (!vocab) {
      throw new ApiError(404, 'Vocabulary word not found.');
    }
    return vocab;
  }

  async createVocabulary(data) {
    return Vocabulary.create(data);
  }

  async updateVocabulary(id, data) {
    const updated = await Vocabulary.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new ApiError(404, 'Vocabulary word not found.');
    }

    return updated;
  }

  async deleteVocabulary(id) {
    const deleted = await Vocabulary.findByIdAndDelete(id);
    if (!deleted) {
      throw new ApiError(404, 'Vocabulary word not found.');
    }
    return deleted;
  }

  async getVocabularyStats() {
    const [total, verified, easy, medium, hard] = await Promise.all([
      Vocabulary.countDocuments(),
      Vocabulary.countDocuments({ isVerified: true }),
      Vocabulary.countDocuments({ difficulty: 'easy' }),
      Vocabulary.countDocuments({ difficulty: 'medium' }),
      Vocabulary.countDocuments({ difficulty: 'hard' }),
    ]);

    return { total, verified, easy, medium, hard };
  }
}

module.exports = new VocabularyService();

