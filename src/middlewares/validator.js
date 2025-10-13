'use strict';

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false, // return all errors
      stripUnknown: true // remove unknown fields
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        field: detail.context.key
      }));
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errorDetails 
      });
    }

    next();
  };
};

module.exports = validate;
