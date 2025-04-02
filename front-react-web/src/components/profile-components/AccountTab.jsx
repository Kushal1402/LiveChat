import React, { useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, CardDescription , CardContent} from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


const AccountTab = () => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    function handleProfileUpdate() {
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }                
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                        Update your email address. You'll need to verify any new email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleProfileUpdate}>Update Email</Button>
                </CardFooter>
            </Card>
        </>
    )
}

export default AccountTab