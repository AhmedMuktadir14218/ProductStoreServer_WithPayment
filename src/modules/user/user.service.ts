import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from './user.model';
import config from '../../config';

export const registerUser = async (email: string, password: string, role: 'user' | 'admin' = 'user', profileImage: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  // Upload the profile image to ImageBB and get the URL// Profile image is a base64 string

  // Create new user with the uploaded image URL
  const newUser = await User.create({ email, password, role});

  return {
    _id: newUser._id,
    email: newUser.email,
    role: newUser.role, // Send the image URL as part of the response
  };
};

export const loginUser = async (email: string, password: string) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtSecret as string,
    { expiresIn: '1d' }
  );

  return { token, user: { _id: user._id, email: user.email, role: user.role } };
};

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};
