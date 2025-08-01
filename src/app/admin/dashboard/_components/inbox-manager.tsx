
'use client';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Eye, Mail, Circle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ContactSubmission } from '@/lib/types';
import { useState } from 'react';

export default function InboxManager() {
  const { state, dispatch } = useApp();
  const { submissions } = state;
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const deleteSubmission = (id: string) => {
    dispatch({ type: 'DELETE_SUBMISSION', payload: id });
    toast({ title: 'ההודעה נמחקה' });
  };
  
  const handleOpenMessage = (submission: ContactSubmission) => {
      setSelectedSubmission(submission);
      if(!submission.isRead) {
          dispatch({ type: 'UPDATE_SUBMISSION_STATUS', payload: { id: submission.id!, isRead: true }})
      }
  }

  const getContactInfo = (submission: ContactSubmission) => {
    if (submission.email && submission.phone) {
        return `${submission.email}, ${submission.phone}`;
    }
    return submission.email || submission.phone || 'לא צוין';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>תיבת פניות</CardTitle>
        <CardDescription>הודעות שנשלחו מטופס יצירת הקשר באתר.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={!!selectedSubmission} onOpenChange={(isOpen) => !isOpen && setSelectedSubmission(null)}>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[80px]">סטטוס</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>פרטי קשר</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead className="text-left w-[120px]">פעולות</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.length > 0 ? (
                    submissions.map(submission => (
                    <TableRow key={submission.id} className={cn(!submission.isRead && "font-bold")}>
                        <TableCell>
                            {!submission.isRead && <Badge>חדש</Badge>}
                        </TableCell>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{getContactInfo(submission)}</TableCell>
                        <TableCell>{format(new Date(submission.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell className="text-left">
                            <div className="flex gap-2">
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenMessage(submission)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                                        <AlertDialogDescription>פעולה זו תמחק את הפנייה לצמיתות.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteSubmission(submission.id!)}>מחק</AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            עדיין אין פניות.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
            {selectedSubmission && (
                <DialogContent className="sm:max-w-xl">
                     <DialogHeader className="text-right">
                        <DialogTitle>פרטי הפנייה</DialogTitle>
                        <DialogDescription>
                            מאת: {selectedSubmission.name}
                            <br/>
                            {selectedSubmission.email && `אימייל: ${selectedSubmission.email}`}
                            {selectedSubmission.email && selectedSubmission.phone && <br/>}
                            {selectedSubmission.phone && `טלפון: ${selectedSubmission.phone}`}
                            <br/>
                            בתאריך: {format(new Date(selectedSubmission.date), 'dd/MM/yyyy HH:mm')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-right">
                        <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                    </div>
                </DialogContent>
            )}
        </Dialog>
      </CardContent>
    </Card>
  );
}
