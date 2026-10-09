const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { googleAuth, syncCalendar, register, login, forgotPassword, verifyOtp, resetPassword } = require("../controllers/authController");

// Limit login and OTP verification attempts to protect against brute-force attacks.
// 10 attempts per 15-minute window per IP address.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,   // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
});

// OTP endpoint gets a tighter limit: 5 attempts per 15 minutes.
// A 6-digit OTP has 900,000 combinations; without this, an attacker
// could cycle through all of them before the 5-minute TTL expires.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many OTP attempts. Please request a new OTP and try again." },
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email", "https://www.googleapis.com/auth/calendar.events"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleAuth);
router.post("/google/sync-calendar", syncCalendar);
router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-otp", otpLimiter, verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;