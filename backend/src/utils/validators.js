const validator = require('validator');

/**
 * Validates herb input data
 * @param {Object} data - The input data from req.body
 * @param {boolean} isUpdate - Whether this is an update operation (makes required fields optional)
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateHerbInput = (data, isUpdate = false) => {
  const errors = [];

  // 1. Required fields check (only strictly enforced on creation)
  if (!isUpdate) {
    if (!data.name || validator.isEmpty(data.name.trim())) {
      errors.push('Common name is required');
    }
    if (!data.description || validator.isEmpty(data.description.trim())) {
      errors.push('Description is required');
    }
  }

  // 2. String length and format validations
  if (data.name !== undefined) {
    if (!validator.isLength(data.name, { min: 2, max: 100 })) {
      errors.push('Name must be between 2 and 100 characters');
    }
  }

  if (data.scientificName !== undefined && data.scientificName) {
    if (!validator.isLength(data.scientificName, { max: 150 })) {
      errors.push('Scientific name must be under 150 characters');
    }
  }

  if (data.family !== undefined && data.family) {
    if (!validator.isLength(data.family, { max: 100 })) {
      errors.push('Family name must be under 100 characters');
    }
  }

  if (data.description !== undefined) {
    if (!validator.isLength(data.description, { min: 10, max: 5000 })) {
      errors.push('Description must be between 10 and 5000 characters');
    }
  }

  // 3. Array validations (Tags)
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    } else {
      if (data.tags.length > 20) {
        errors.push('Maximum 20 tags allowed');
      }
      data.tags.forEach((tag) => {
        if (typeof tag !== 'string' || validator.isEmpty(tag.trim())) {
          errors.push('Each tag must be a non-empty string');
        }
        if (tag.length > 50) {
          errors.push('Each tag must be under 50 characters');
        }
      });
    }
  }

  // 4. JSON object validations 
  // (If passed as strings from multipart/form-data, ensure they are valid JSON)
  const jsonFields = ['uses', 'growing', 'care'];
  jsonFields.forEach((field) => {
    if (data[field] !== undefined && typeof data[field] === 'string') {
      try {
        JSON.parse(data[field]);
      } catch (e) {
        errors.push(`${field} must be a valid JSON string`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateHerbInput,
};