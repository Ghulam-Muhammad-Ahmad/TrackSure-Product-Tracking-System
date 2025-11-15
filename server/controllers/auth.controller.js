import { checkTenantNameAvailability, signup as signupService, login as loginService, resetPassword as resetPasswordService, getProfile as getProfileService, verifyEmail as verifyEmailService, editProfile as editProfileService } from '../services/auth.service.js';
import jwt from 'jsonwebtoken';
const verifyJwt = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
};

const verify = async (req, res, next) => {
    const { username } = req.body;

    try {
        const isAvailable = await checkTenantNameAvailability(username);
        res.status(200).json({
            message: isAvailable ? 'Username is available' : 'Username is not available',
            usernameNotFound: isAvailable,
        });
    } catch (error) {
        console.error('Username Verification Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const signup = async (req, res, next) => {
    const { username, password, email, location, first_name, last_name, phone_number } = req.body;
    if (!username || !password || !email || !location || !first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const result = await signupService(username, password, email, location, first_name, last_name, phone_number);
        res.status(201).json(result);
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
const verifyEmail = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required', message: 'Token is required', success: false });
    }
    try {
        const result = await verifyEmailService(token);
        res.status(200).json(result);
    } catch (error) {
        console.error('Email Verification Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, rememberMe = false } = req.body;
        const result = await loginService(email, password, rememberMe);
        if (result.success) {
            res.status(200).json({ ...result, success: true });
        } else {
            res.status(200).json({ error: result.message, success: false });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error', success: false });
    }
};
const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, currentPassword } = req.body;
        const authHeaderJWT = req.headers['x-jwt-bearer'];
        if (!authHeaderJWT) {
            return res.status(401).json({ success: false, message: 'Authorization header missing or malformed' });
        }

        const jwt = authHeaderJWT;

        if (!newPassword || !currentPassword) {
            return res.status(400).json({ success: false, message: 'New password and current password are required' });
        }

        const decodedJwt = await verifyJwt(jwt); // Assuming a verifyJwt function is available
        if (!decodedJwt) {
            return res.status(401).json({ success: false, message: 'Invalid JWT' });
        }

        const userId = decodedJwt.id; // Extract user id from jwt
        const result = await resetPasswordService(userId, currentPassword, newPassword);
        if (result.success) {
            res.status(200).json({ success: true, message: 'Password reset successfully' });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getProfile = async (req, res, next) => {
    try {
        const authHeaderJWT = req.headers['x-jwt-bearer'];
        if (!authHeaderJWT) {
            return res.status(401).json({ success:false, error: 'Authorization header missing or malformed' });
        }

        const decodedJwt = await verifyJwt(authHeaderJWT); // Assuming a verifyJwt function is available
        if (!decodedJwt) {
            return res.status(401).json({ success:false, error: 'Invalid JWT' });
        }

        const userId = decodedJwt.id; // Extract user id from jwt
        const profile = await getProfileService(userId); // Assuming a getProfileService function is available
        res.status(200).json(profile);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ success:false, error: 'Server error' });
    }
};

const editProfile = async (req, res, next) => {
    try {
        const authHeaderJWT = req.headers['x-jwt-bearer'];
        if (!authHeaderJWT) {
            return res.status(401).json({ success:false, error: 'Authorization header missing or malformed' });
        }

        const decodedJwt = await verifyJwt(authHeaderJWT); // Assuming a verifyJwt function is available
        if (!decodedJwt) {
            return res.status(401).json({ success:false, error: 'Invalid JWT' });
        }

        const userId = decodedJwt.id; // Extract user id from jwt
        const { first_name, last_name, phone_number, location } = req.body;
        const result = await editProfileService(userId, first_name, last_name, phone_number, location);
        res.status(200).json(result);
    } catch (error) {
        console.error('Edit Profile Error:', error);
        res.status(500).json({ success:false, error: 'Server error' });
    }
};

export default {
    verify,
    signup,
    verifyEmail,
    login,
    resetPassword,
    getProfile,
    editProfile
};
