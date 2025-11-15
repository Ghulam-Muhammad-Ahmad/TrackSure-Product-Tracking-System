import React, { useState, useContext } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { API } from '../config/api'; // Import the API configurations
import axios from 'axios'; // Import axios for making HTTP requests
import { AuthContext } from '../providers/authProvider'; // Import the AuthContext

function AccountPassword() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // Add success state
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Add state to show success message

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { token } = useContext(AuthContext); // Use the token from the AuthContext

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleShowPassword = (field) => {
        switch (field) {
            case 'currentPassword':
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case 'newPassword':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirmPassword':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    const validatePasswords = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New password and confirm password must match.');
            return false;
        }
        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validatePasswords()) {
            try {
                // Set the token in the headers for authentication
                axios.defaults.headers.common['x-jwt-bearer'] = token;
                // Handle password change logic using the API
                const response = await axios.post(API.RESET_PASSWORD, { newPassword: passwordData.newPassword, currentPassword: passwordData.currentPassword });
                if (response.data.success) {
                    console.log('Password change requested:', passwordData);
                    setSuccess(true); // Set success state to true
                    setShowSuccessMessage(true); // Show success message
                    setPasswordData({ // Reset form
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                    setTimeout(() => {
                        setShowSuccessMessage(false); // Hide success message after 1 second
                    }, 1000);
                    // Optionally, handle successful password change
                } else {
                    console.error('Failed to change password:', response.data);
                    setError(`Error: ${response.data.message}`);
                }
            } catch (error) {
                console.error(error);
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className='w-full relative pt-5'>
            <>
                <h2 className='text-2xl font-bold tracking-tight'>
                    Change Password
                </h2>
                <p className='text-muted-foreground'>Change your password here.</p>
                <Separator className="my-4" />

                <form onSubmit={handleSubmit}>
                    <div className='account-formgroup relative'>
                        <label htmlFor="currentPassword">Current Password</label>
                        <Input
                            name="currentPassword"
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your current password"
                        />
                        <span onClick={() => handleShowPassword('currentPassword')} className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                            {showCurrentPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    <div className='account-formgroup relative'>
                        <label htmlFor="newPassword">New Password</label>
                        <Input
                            name="newPassword"
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                        />
                        <span onClick={() => handleShowPassword('newPassword')} className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                            {showNewPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    <div className='account-formgroup relative'>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <Input
                            name="confirmPassword"
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                        />
                        <span onClick={() => handleShowPassword('confirmPassword')} className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                                {showConfirmPassword ? "Hide" : "Show"}
                        </span>
                    </div>

                    {error && <p className='text-red-500'>{error}</p>}
                    {showSuccessMessage && <p className='text-green-500'>Password changed successfully</p>}
                    <Button type="submit" className='mt-4'>Save Changes</Button>
                </form>
            </>
        </div>
    );
}

export default AccountPassword;
