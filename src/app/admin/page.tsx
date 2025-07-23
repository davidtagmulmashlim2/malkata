
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const { login, isAuthenticated } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            toast({ title: 'התחברות הצליחה', description: 'ברוך הבא למערכת הניהול.' });
            router.push('/admin/dashboard');
        } else {
            toast({
                title: 'שגיאת התחברות',
                description: 'הסיסמה שהוזנה שגויה.',
                variant: 'destructive',
            });
        }
    };

    if(isAuthenticated) {
        return <div className="flex items-center justify-center min-h-screen"><p>Redirecting...</p></div>;
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-muted/40">
            <Card className="w-full max-w-sm mx-4 text-right">
                <CardHeader className="text-right">
                    <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full mb-4 w-fit">
                        <Lock className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">כניסת מנהל</CardTitle>
                    <CardDescription>יש להזין סיסמה כדי לגשת למערכת הניהול.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">סיסמה</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            כניסה
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
