import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../config/nodeMailerConfig.js';

const prisma = new PrismaClient();

const checkTenantNameAvailability = async (tenant_name) => {
    try {
        const tenant = await prisma.tenants.findFirst({
            where: { tenant_name: tenant_name.trim().toLowerCase() },
        });
        return !tenant; // true if available, false if taken
    } catch (error) {
        console.error('Tenant Name Availability Check Error:', error);
        throw new Error('Database error');
    }
};

const signup = async (username, password, email, location, first_name, last_name, phone_number) => {
    // normalize input
    const tenant_name = username.trim().toLowerCase();
    const newUsername = `${tenant_name}-admin`;
    const newEmail = email.trim().toLowerCase();
    const newLocation = location.trim().toLowerCase();
    const newFirstName = first_name.trim();
    const newLastName = last_name.trim();
    const newPhoneNumber = phone_number.trim();

    // Verify if tenant with same username exists
    const existingTenant = await prisma.tenants.findFirst({
        where: { tenant_name: tenant_name },
    });

    if (existingTenant) {
        return { success: false, message: 'Tenant with the same username already exists' };
    }

    // Verify if user with same email exists
    const existingUser = await prisma.users.findFirst({
        where: { email: newEmail },
    });

    if (existingUser) {
        return { success: false, message: 'User with the same email already exists' };
    }

    return prisma.$transaction(async (tx) => {
        try {
            // 1. Create the tenant
            const newTenant = await tx.tenants.create({
                data: {
                    tenant_name
                }
            });

            // 2. Create the role named `${tenant_id}-admin` with full permissions
            const roleName = `${newTenant.tenant_name}-admin`;
            const permissions = [
                'PRODUCT_CREATE',
                'PRODUCT_READ',
                'PRODUCT_UPDATE',
                'PRODUCT_DELETE',

                'PRODUCT_STATUS_CREATE',
                'PRODUCT_STATUS_READ',
                'PRODUCT_STATUS_UPDATE',
                'PRODUCT_STATUS_DELETE',

                'CATEGORY_CREATE',
                'CATEGORY_READ',
                'CATEGORY_UPDATE',
                'CATEGORY_DELETE',

                'ROLE_CREATE',
                'ROLE_READ',
                'ROLE_UPDATE',
                'ROLE_DELETE',

                'USER_CREATE',
                'USER_READ',
                'USER_UPDATE',
                'USER_DELETE',

                'DOCUMENT_CREATE',
                'DOCUMENT_READ',
                'DOCUMENT_UPDATE',
                'DOCUMENT_DELETE',

                'DOCUMENT_FOLDER_CREATE',
                'DOCUMENT_FOLDER_READ',
                'DOCUMENT_FOLDER_UPDATE',
                'DOCUMENT_FOLDER_DELETE'
            ];

            const adminRole = await tx.roles.create({
                data: {
                    role_name: roleName,
                    permissions,
                    tenant_id: newTenant.tenant_id
                }
            });

            // 3. Hash password and prepare verification token
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifying_token = `${newUsername}-${newEmail}-${Math.floor(Math.random() * 1000000)}-${Date.now()}`;

            // 4. Create the user and assign the `${tenant_id}-admin` role
            const newUser = await tx.users.create({
                data: {
                    tenant_id: newTenant.tenant_id,
                    username: newUsername,
                    password_hash: hashedPassword,
                    email: newEmail,
                    location: newLocation,
                    first_name: newFirstName,
                    last_name: newLastName,
                    phone_number: newPhoneNumber,
                    role_id: adminRole.role_id,
                    verifying_token,
                    email_verified: false
                }
            });

            // 5. Send verification email (outside tx to avoid delaying commit)
            sendVerificationEmail(`${newFirstName} ${newLastName}`, newEmail, verifying_token);

            return { success: true, message: 'Tenant registered', userId: newUser.user_id, tenantId: newTenant.tenant_id };
        } catch (error) {
            console.error('Error in signup:', error);
            throw new Error('Database error');
        }
    });
};

const login = async (email, password, rememberMe = false) => {
    email = email.trim().toLowerCase();
    if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
    }

    const user = await prisma.users.findUnique({
        where: { email }
    });
    if (!user) {
        return { success: false, message: 'Email and password combination not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return { success: false, message: 'Email and password combination not found' };
    }

    const token = jwt.sign(
        {
            id: user.user_id,
            tenant_id: user.tenant_id,
            email: user.email,
            email_verified: user.email_verified
        },
        process.env.JWT_SECRET,
        {
            expiresIn: rememberMe ? '7d' : '1h'
        }
    );

    return { success: true, message: 'Login successful', token };
};

const verifyEmail = async (token) => {
    try {
        const user = await prisma.users.findFirst({
            where: { verifying_token: token },
        });

        if (!user) {
            return { success: false, message: 'Invalid token' };
        }

        await prisma.users.update({
            where: { user_id: user.user_id },
            data: { email_verified: true, verifying_token: "" },
        });

        return { success: true, message: 'Email verified' };
    } catch (error) {
        console.error('Verify Email Service Error:', error);
        return { success: false, message: 'Database error' };
    }
};

const getProfile = async (userId) => {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
                phone_number: true,
                location: true,
                role_id: true,
                tenant_id: true,  // Added tenant_id
                email_verified: true,
                roles_users_role_idToroles: {  // Use the correct relation field name
                    select: {
                        role_name: true,
                        permissions: true,  // Fetch permissions as well
                    },
                },
            },
        });

        if (!user) {
            return { success: false, error: 'User Not Found' };
        }

        return { success: true, user };
    } catch (error) {
        console.error('Get Profile Service Error:', error);
        return { success: false, error: 'Database error' };
    }
};

const resetPassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: { password_hash: true },
        });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return { success: false, message: 'Current password is incorrect' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
            where: { user_id: userId },
            data: { password_hash: hashedPassword },
        });
        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        console.error('Reset Password Service Error:', error);
        return { success: false, message: 'Database error' };
    }
};

const editProfile = async (userId, first_name, last_name, phone_number, location) => {
    try {
        await prisma.users.update({
            where: { user_id: userId },
            data: {
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                phone_number: phone_number.trim(),
                location: location.trim(),
            },
        });
        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Edit Profile Service Error:', error);
        throw { success: false, message: 'Database error' };
    }
};

export {
    checkTenantNameAvailability,
    signup,
    verifyEmail,
    login,
    resetPassword,
    getProfile,
    editProfile
};
