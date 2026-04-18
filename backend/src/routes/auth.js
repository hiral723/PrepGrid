import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/index.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"PrepGrid" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your PrepGrid verification code',
    html: `<div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;background:#1a1a1a;color:#fff;border-radius:12px">
      <h2 style="color:#60a5fa;margin:0 0 16px">PrepGrid</h2>
      <p style="color:#aaa;margin:0 0 24px">Your verification code:</p>
      <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#fff;background:#2a2a2a;padding:20px;border-radius:8px;text-align:center">${otp}</div>
      <p style="color:#666;font-size:12px;margin:24px 0 0">Expires in 10 minutes.</p>
    </div>`
  });
};

const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name, email, passwordHash,
      otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });
    await sendOTP(email, otp);
    res.status(201).json({ message: 'Check your email for OTP.', userId: user._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp?.code || user.otp.code !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ message: 'OTP expired' });
    user.isVerified = true; user.otp = undefined;
    await user.save();
    const tokens = generateTokens(user._id);
    res.json({ message: 'Email verified!', user: user.toPublic(), ...tokens });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first', userId: user._id });
    const tokens = generateTokens(user._id);
    res.json({ user: user.toPublic(), ...tokens });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/google — Google OAuth (receives token from frontend)
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'No credential provided' });

    // Decode the JWT from Google (verify with Google's public key)
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const googleUser = await response.json();

    if (googleUser.error) return res.status(401).json({ message: 'Invalid Google token' });
    if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) return res.status(401).json({ message: 'Token audience mismatch' });

    const { email, name, sub: googleId, picture } = googleUser;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name, email,
        passwordHash: await bcrypt.hash(googleId + process.env.JWT_SECRET, 12),
        isVerified: true,
        googleId, avatar: picture
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const tokens = generateTokens(user._id);
    res.json({ user: user.toPublic(), ...tokens });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to email', userId: user._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const user = await User.findById(userId);
    if (!user || user.otp?.code !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ message: 'OTP expired' });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokens = generateTokens(decoded.id);
    res.json(tokens);
  } catch (err) { res.status(401).json({ message: 'Invalid refresh token' }); }
});

export default router;