const { validationResult } = require("express-validator");
const User = require("../models/User");
const { generateToken } = require("../services/tokenService");

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { username, password } = req.body;

    // Check if username already taken
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken.",
      });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({
      username: username.toLowerCase(),
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isOnline: user.isOnline,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  POST /api/auth/login
 * @desc   Login user and return JWT
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { username, password } = req.body;

    // Fetch user with password field (select: false by default)
    const user = await User.findOne({ username: username.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isOnline: user.isOnline,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/auth/me
 * @desc   Get current authenticated user
 * @access Private
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, getMe };
