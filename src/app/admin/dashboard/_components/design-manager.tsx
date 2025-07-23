'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const designSchema = z.object({
  theme: z.string(),
  animation: z.enum(['none', 'fadeIn', 'slideUp']),
});

const themes = [
    { name: 'ברירת מחדל (חם)', value: 'default' },
    { name: 'רטרו', value: 'retro' },
    { name: 'אורבני', value: 'urban' },
    { name: 'טרמינל', value: 'terminal' },
    { name: 'אוקיינוס', value: 'ocean' },
    { name: 'יער', value: 'forest' },
    { name: 'זריחה', value: 'sunrise' },
    { name: 'יוקרתי', value: 'luxury' },
    { name: 'טבעי', value: 'natural' },
    { name: 'מינימליסטי', value: 'minimal' },
];

export default function DesignManager() {
  const { state, dispatch } = useApp();
  const { design } = state;

  const form = useForm<z.infer<typeof designSchema>>({
    resolver: zodResolver(designSchema),
    values: design,
  });

  const onSubmit = (values: z.infer<typeof designSchema>) => {
    dispatch({ type: 'UPDATE_DESIGN', payload: values });
    toast({ title: 'הגדרות עיצוב עודכנו!' });
    // Note: Applying themes would require a more complex setup to dynamically change CSS variables.
    // This implementation saves the choice, but doesn't visually apply all themes yet.
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ניהול עיצוב</CardTitle>
        <CardDescription>התאם את המראה והתחושה של האתר.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-headline">ערכת נושא</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר ערכת נושא" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themes.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>{theme.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animation"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-headline">אנימציית טעינת עמודים</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">ללא</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fadeIn" />
                        </FormControl>
                        <FormLabel className="font-normal">Fade In</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="slideUp" />
                        </FormControl>
                        <FormLabel className="font-normal">Slide Up</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">שמור שינויי עיצוב</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
