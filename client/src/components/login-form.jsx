import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import axios from 'axios';
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

export function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added state for loading
  const authContext = useContext(AuthContext);

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.post(API.LOGIN, {
        email: email,
        password: password,
        rememberMe: rememberMe,
      });
      if (response.data.success) {
        setLoginError(null);
        setLoginSuccess('Login successful! Redirecting to Dahsboard.....');
        authContext.setToken(response.data.token);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setLoginSuccess(null);
        setLoginError(response.data.error);
      }
    } catch (error) {
      setLoginSuccess(null);
      console.error('Error logging in:', error);
      setLoginError('An error occurred while logging in.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="overflow-hidden py-0 ">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[80vh]">
         <div className="flex items-center w-full">   
          <form onSubmit={handleSubmit} className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your TrackSure account
                </p>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} required value={password} className="pr-12" onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-2 py-1 text-sm text-gray-700">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 rounded-lg"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Label htmlFor="rememberMe">Remember Me</Label>
              </div>
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              {loginSuccess && <div className="text-green-500 text-sm">{loginSuccess}</div>}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button onClick={handleSignUpClick} className="underline underline-offset-4 cursor-pointer">
                  Sign up
                </button>
              </div>
            
            </div>
          </form>
          </div>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/loginimg.jpg"
              alt="Image"
              className="absolute inset-0 h-full  w-full object-cover dark:brightness-[0.2] dark:grayscale"
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
