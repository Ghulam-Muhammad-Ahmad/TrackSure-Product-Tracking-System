import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API } from "@/config/api"
import axios from 'axios'; // Added axios import

export function SignUpForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for show/hide password
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added state for loading

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.length > 2) {
      try {
        const response = await axios.post(API.VERIFYUSERNAME, { username: newUsername });
        const data = response.data;
        setIsUsernameAvailable(data.usernameNotFound);
      } catch (error) {
        console.error('Error verifying username:', error);
      }
    }else{
      setIsUsernameAvailable(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isUsernameAvailable) {
      return;
    }

    setIsLoading(true); // Set loading state
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post(API.SIGNUP, {
        username: username,
        password: password,
        email: email,
        location: location,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        role_id: 1
      });
      const result = response.data;
      if (result.success) {
        setSignupError("");
        setSignupSuccess('Sign up successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSignupSuccess('');
        setSignupError(result.message);
      }
    } catch (error) {
      setSignupSuccess('');
      console.error('Error signing up:', error);
      setSignupError(error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome to TrackSure</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up for a new account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Your last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Your phone number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2 locationinput">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Your location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  required
                  value={username}
                  onChange={handleUsernameChange}
                />
                {isUsernameAvailable !== null && (
                  <div className={`text-sm ${isUsernameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isUsernameAvailable ? 'Username is available' : 'Username is not available'}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="on"
                  required
                  minLength="6"
                  className="pr-20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute right-0 top-7 mx-4"
                  onClick={() => setShowPassword(prevState => !prevState)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Sign Up'}
              </Button>
              {signupError && <div className="text-red-500 text-sm">{signupError}</div>}
              {signupSuccess && <div className="text-green-500 text-sm">{signupSuccess}</div>}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <button onClick={() => navigate('/login')} className="underline underline-offset-4 cursor-pointer">
                  Login
                </button>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signupimg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
