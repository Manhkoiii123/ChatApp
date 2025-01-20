import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import { renameSync, unlinkSync } from "fs";
const maxAge = 3 * 24 * 60 * 60 * 1000;
import jwt from "jsonwebtoken";
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password });
    res.cookie("jwt", createToken(email, newUser.id), {
      httpOnly: true,
      maxAge: maxAge,
      sameSite: "none",
      secure: true,
    });
    await newUser.save();
    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        profileSetup: newUser.profileSetup,
      },
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or password is not correct" });
    }
    res.cookie("jwt", createToken(email, user.id), {
      httpOnly: true,
      maxAge: maxAge,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
      message: "Login successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, image, color } = req.body;
    if (!firstName || !lastName || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        image,
        color,
        profileSetup: true,
      },
      { new: true }
    );
    return res.status(200).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const date = Date.now();
    let fileName = `uploads/profiles/` + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: user.image,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const removeProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();
    return res.status(200).json({
      message: "Profile image removed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 1,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
