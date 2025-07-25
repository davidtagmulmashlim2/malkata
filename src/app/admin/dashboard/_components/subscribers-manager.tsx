
'use client';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function SubscribersManager() {
  const { state, dispatch } = useApp();
  const { subscribers } = state;

  const deleteSubscriber = (id: string) => {
    dispatch({ type: 'DELETE_SUBSCRIBER', payload: id });
    toast({ title: 'הנרשם נמחק' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ניהול מועדון לקוחות</CardTitle>
        <CardDescription>צפה ונהל את רשימת הנרשמים למועדון הלקוחות.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>תאריך הרשמה</TableHead>
              <TableHead className="text-left">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length > 0 ? (
                subscribers.map(subscriber => (
                <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.name}</TableCell>
                    <TableCell>{subscriber.phone}</TableCell>
                    <TableCell>{format(new Date(subscriber.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell className="text-left">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                            <AlertDialogDescription>פעולה זו תמחק את הנרשם לצמיתות.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSubscriber(subscriber.id)}>מחק</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        עדיין אין נרשמים.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
