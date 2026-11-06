'use strict';

const programService = require('../services/program.service');
const ApiResponse = require('../utils/ApiResponse');

class ProgramController {
  async getAllPrograms(req, res, next) {
    try {
      const programs = await programService.getAllPrograms(req.query);
      res.status(200).json(new ApiResponse(200, 'Programs fetched successfully', programs));
    } catch (err) {
      next(err);
    }
  }

  async getProgramById(req, res, next) {
    try {
      const program = await programService.getProgramById(req.params.id);
      res.status(200).json(new ApiResponse(200, 'Program fetched successfully', program));
    } catch (err) {
      next(err);
    }
  }

  async getProgramLevels(req, res, next) {
    try {
      const levels = await programService.getProgramLevels(req.params.id, req.query);
      res.status(200).json(new ApiResponse(200, 'Program levels fetched successfully', levels));
    } catch (err) {
      next(err);
    }
  }

  async createProgram(req, res, next) {
    try {
      const program = await programService.createProgram(req.body);
      res.status(201).json(new ApiResponse(201, 'Program created successfully', program));
    } catch (err) {
      next(err);
    }
  }

  async updateProgram(req, res, next) {
    try {
      const program = await programService.updateProgram(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, 'Program updated successfully', program));
    } catch (err) {
      next(err);
    }
  }

  async deleteProgram(req, res, next) {
    try {
      const deleted = await programService.deleteProgram(req.params.id);
      res.status(200).json(new ApiResponse(200, 'Program deleted successfully', deleted));
    } catch (err) {
      next(err);
    }
  }

  // Level management endpoints
  async createLevel(req, res, next) {
    try {
      const level = await programService.createLevel(req.params.id, req.body);
      res.status(201).json(new ApiResponse(201, 'Program level created successfully', level));
    } catch (err) {
      next(err);
    }
  }

  async updateLevel(req, res, next) {
    try {
      const level = await programService.updateLevel(req.params.levelId, req.body);
      res.status(200).json(new ApiResponse(200, 'Program level updated successfully', level));
    } catch (err) {
      next(err);
    }
  }

  async deleteLevel(req, res, next) {
    try {
      const deleted = await programService.deleteLevel(req.params.levelId);
      res.status(200).json(new ApiResponse(200, 'Program level deleted successfully', deleted));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProgramController();

