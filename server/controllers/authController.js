import { registerUser, loginUser } from '../models/userModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword, fullName } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const user = await registerUser(username, email, password, fullName);
  res.status(201).json({ success: true, message: 'User registered successfully', user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUser(email, password);
  res.status(200).json({ success: true, message: 'Login successful', ...result });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
});
