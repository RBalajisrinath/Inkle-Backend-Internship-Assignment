export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  POST_NOT_FOUND: 'Post not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_ALREADY_EXISTS: 'User with this email or username already exists',
  UNAUTHORIZED_ACCESS: 'Not authorized to access this resource',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  VALIDATION_FAILED: 'Validation failed',
  CANNOT_FOLLOW_YOURSELF: 'Cannot follow yourself',
  CANNOT_BLOCK_YOURSELF: 'Cannot block yourself',
  ALREADY_FOLLOWING: 'Already following this user',
  ALREADY_BLOCKED: 'User already blocked',
  POST_ALREADY_LIKED: 'Post already liked',
  POST_NOT_LIKED: 'Post not liked yet'
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  POST_CREATED: 'Post created successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_LIKED: 'Post liked successfully',
  POST_UNLIKED: 'Post unliked successfully',
  USER_FOLLOWED: 'Successfully followed user',
  USER_UNFOLLOWED: 'Successfully unfollowed user',
  USER_BLOCKED: 'Successfully blocked user',
  USER_UNBLOCKED: 'Successfully unblocked user',
  USER_DELETED: 'User deleted successfully',
  ADMIN_PROMOTED: 'User promoted to admin successfully',
  ADMIN_DEMOTED: 'Admin demoted to user successfully'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_POST_LIMIT: 20,
  DEFAULT_ACTIVITY_LIMIT: 50,
  MAX_LIMIT: 100
} as const;

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  BIO_MAX_LENGTH: 200,
  POST_CONTENT_MAX_LENGTH: 1000
} as const;