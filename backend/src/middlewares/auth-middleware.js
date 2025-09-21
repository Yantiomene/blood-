const passport = require('passport');

const userAuth = passport.authenticate('jwt', { session: false });
// Allow configuring admin emails via env, with sensible defaults
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'yan2016tiomene@gmail.com,yaninthe.douanla@keecash.fr')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

const adminOnly = (req, res, next) => {
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
