// middleware/userValidation.js
const { body, validationResult } = require('express-validator');


const validateUserCreation = [
    body('username').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserUpdate = [
    body('username').optional().isLength({ min: 3 }).withMessage('username must be at least 3 characters long'),
    body('email').optional().isEmail().withMessage('Please provide a valid email address'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];




module.exports = {  validateUserCreation, validateUserUpdate };
