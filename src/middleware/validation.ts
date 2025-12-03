import { body, param, ValidationChain } from 'express-validator';
import { VALIDATION_RULES } from '../constants';

export const signupValidation: ValidationChain[] = [
  body('username')
    .trim()
    .isLength({ min: VALIDATION_RULES.USERNAME_MIN_LENGTH, max: VALIDATION_RULES.USERNAME_MAX_LENGTH })
    .withMessage(`Username must be between ${VALIDATION_RULES.USERNAME_MIN_LENGTH} and ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: VALIDATION_RULES.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: VALIDATION_RULES.BIO_MAX_LENGTH })
    .withMessage(`Bio must not exceed ${VALIDATION_RULES.BIO_MAX_LENGTH} characters`)
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const postValidation: ValidationChain[] = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: VALIDATION_RULES.POST_CONTENT_MAX_LENGTH })
    .withMessage(`Post content must not exceed ${VALIDATION_RULES.POST_CONTENT_MAX_LENGTH} characters`)
];

export const updateProfileValidation: ValidationChain[] = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: VALIDATION_RULES.USERNAME_MIN_LENGTH, max: VALIDATION_RULES.USERNAME_MAX_LENGTH })
    .withMessage(`Username must be between ${VALIDATION_RULES.USERNAME_MIN_LENGTH} and ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: VALIDATION_RULES.BIO_MAX_LENGTH })
    .withMessage(`Bio must not exceed ${VALIDATION_RULES.BIO_MAX_LENGTH} characters`)
];

export const uuidValidation: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format')
];
