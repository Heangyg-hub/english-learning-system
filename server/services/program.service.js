'use strict';

const Program = require('../models/Program.model');
const Level = require('../models/Level.model');
const ApiError = require('../utils/ApiError');

class ProgramService {
  async getAllPrograms(query = {}) {
    const filter = {};
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true' || query.isActive === true;
    }

    const programs = await Program.find(filter).sort({ order: 1, createdAt: 1 });
    
    // Also include count of levels per program
    const programIds = programs.map((p) => p._id);
    const levelCounts = await Level.aggregate([
      { $match: { programId: { $in: programIds } } },
      { $group: { _id: '$programId', count: { $sum: 1 } } },
    ]);

    const countMap = levelCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const enriched = programs.map((p) => ({
      ...p.toObject(),
      levelCount: countMap[p._id.toString()] || 0,
    }));

    return enriched;
  }

  async getProgramById(id) {
    const program = await Program.findById(id);
    if (!program) {
      throw new ApiError(404, 'Program not found.');
    }
    return program;
  }

  async getProgramLevels(programId, query = {}) {
    await this.getProgramById(programId); // Verify existence

    const filter = { programId };
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true' || query.isActive === true;
    }

    return Level.find(filter).sort({ order: 1, createdAt: 1 });
  }

  async createProgram(data) {
    const existing = await Program.findOne({
      $or: [{ name: data.name }, { slug: data.slug }],
    });
    if (existing) {
      throw new ApiError(409, 'A program with this name or slug already exists.');
    }

    return Program.create(data);
  }

  async updateProgram(id, data) {
    if (data.name || data.slug) {
      const conflict = await Program.findOne({
        _id: { $ne: id },
        $or: [
          ...(data.name ? [{ name: data.name }] : []),
          ...(data.slug ? [{ slug: data.slug }] : []),
        ],
      });
      if (conflict) {
        throw new ApiError(409, 'Another program already uses this name or slug.');
      }
    }

    const updated = await Program.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new ApiError(404, 'Program not found.');
    }
    return updated;
  }

  async deleteProgram(id) {
    const deleted = await Program.findByIdAndDelete(id);
    if (!deleted) {
      throw new ApiError(404, 'Program not found.');
    }
    // Clean up associated levels
    await Level.deleteMany({ programId: id });
    return deleted;
  }

  // Level operations
  async createLevel(programId, data) {
    await this.getProgramById(programId);
    return Level.create({ ...data, programId });
  }

  async updateLevel(levelId, data) {
    const updated = await Level.findByIdAndUpdate(levelId, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw new ApiError(404, 'Level not found.');
    }
    return updated;
  }

  async deleteLevel(levelId) {
    const deleted = await Level.findByIdAndDelete(levelId);
    if (!deleted) {
      throw new ApiError(404, 'Level not found.');
    }
    return deleted;
  }
}

module.exports = new ProgramService();

