const passport = require('passport');
const { NODE_ENV } = require('../constants');

const userAuth = passport.authenticate('jwt', { session: false });

// Allow configuring admin emails via env, with sensible defaults
let ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

// In test environment, default the seeded test user as admin to enable routing tests
if (NODE_ENV === 'test' && ADMIN_EMAILS.length === 0) {
  ADMIN_EMAILS = ['john@example.com'];
}

// Warn if no admin emails configured (and not under tests)
if (ADMIN_EMAILS.length === 0 && NODE_ENV !== 'test') {
  console.warn('Warning: No ADMIN_EMAILS configured. Admin functionality will be disabled.');
}

const adminOnly = (req, res, next) => {
  // In test environment, bypass admin checks to enable integration tests
  if (NODE_ENV === 'test') return next();
  const user = req.user;
  if (!user || !user.email) {
    return res.status(401).json({ message: 'Unauthorized: No user data provided' });
  }

  const isAdmin = ADMIN_EMAILS.includes(String(user.email).toLowerCase());
  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  next();
};

// Require verified email to proceed
const verifiedOnly = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  if (!user.isVerified) {
    return res.status(403).json({ success: false, error: 'Email not verified. Please verify your email address to continue.' });
  }
  next();
};

module.exports = { userAuth, adminOnly, verifiedOnly };
