'use strict';

/**
 * ApiResponse — Standardized JSON response payload.
 */
class ApiResponse {
  /**
   * @param {number} statusCode  HTTP status code
   * @param {string} message     Message
   * @param {*}      data        Payload (object, array, or null)
   * @param {object} pagination  Optional pagination metadata
   */
  constructor(statusCode, message, data = null, pagination = null) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    if (data !== null) this.data = data;
    if (pagination !== null) this.pagination = pagination;
  }
}

module.exports = ApiResponse;

