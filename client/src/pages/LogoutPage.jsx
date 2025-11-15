import React, { useContext } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthContext } from '@/providers/authProvider'
import { useNavigate } from 'react-router-dom'

function LogoutPage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const logoutHandle = () => {
        logout();
        navigate("/login");
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Confirm Logout</CardTitle>
                    <CardDescription>Are you sure you want to log out?</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>If you log out, you will need to log back in to access your account.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={logoutHandle}
                        variant="destructive"
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        Logout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LogoutPage
