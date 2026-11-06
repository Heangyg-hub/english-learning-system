'use strict';

const vocabularyService = require('../services/vocabulary.service');
const ApiResponse = require('../utils/ApiResponse');

class VocabularyController {
  async getAllVocabulary(req, res, next) {
    try {
      const result = await vocabularyService.getAllVocabulary(req.query);
      res.status(200).json(
        new ApiResponse(200, 'Vocabulary list fetched successfully', result.items, result.pagination)
      );
    } catch (err) {
      next(err);
    }
  }

  async getVocabularyById(req, res, next) {
    try {
      const vocab = await vocabularyService.getVocabularyById(req.params.id);
      res.status(200).json(new ApiResponse(200, 'Vocabulary details fetched successfully', vocab));
    } catch (err) {
      next(err);
    }
  }

  async createVocabulary(req, res, next) {
    try {
      const vocab = await vocabularyService.createVocabulary(req.body);
      res.status(201).json(new ApiResponse(201, 'Vocabulary created successfully', vocab));
    } catch (err) {
      next(err);
    }
  }

  async updateVocabulary(req, res, next) {
    try {
      const vocab = await vocabularyService.updateVocabulary(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, 'Vocabulary updated successfully', vocab));
    } catch (err) {
      next(err);
    }
  }

  async deleteVocabulary(req, res, next) {
    try {
      const deleted = await vocabularyService.deleteVocabulary(req.params.id);
      res.status(200).json(new ApiResponse(200, 'Vocabulary deleted successfully', deleted));
    } catch (err) {
      next(err);
    }
  }

  async getVocabularyStats(req, res, next) {
    try {
      const stats = await vocabularyService.getVocabularyStats();
      res.status(200).json(new ApiResponse(200, 'Vocabulary stats fetched successfully', stats));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VocabularyController();

