'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSubjects } from '@/components/SubjectSelector';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const FONT_SIZES = [
  { value: 0.75, label: 'Small' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: 'Large' },
];

const THEME_COLORS = [
  { name: 'Blue', value: '221 83% 53%' },
  { name: 'Teal', value: '174 51% 33%' },
  { name: 'Green', value: '142 76% 36%' },
  { name: 'Orange', value: '25 95% 53%' },
  { name: 'Rose', value: '347 90% 49%' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(1);
  const [themeColor, setThemeColor] = useState('221 83% 53%');
  const [mounted, setMounted] = useState(false);
  const { subjects, addSubject, removeSubject } = useSubjects();
  const [newSubject, setNewSubject] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const storedFontSize = localStorage.getItem('font-size');
    if (storedFontSize) {
      const size = parseFloat(storedFontSize);
      setFontSize(size);
      document.body.style.setProperty('--font-size', `${size}rem`);
    }
    const storedThemeColor = localStorage.getItem('theme-color');
    if (storedThemeColor) {
      setThemeColor(storedThemeColor);
      document.documentElement.style.setProperty('--primary', storedThemeColor);
    }
  }, []);

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    document.body.style.setProperty('--font-size', `${newSize}rem`);
    localStorage.setItem('font-size', newSize.toString());
  };

  const handleThemeColorChange = (value: string) => {
    setThemeColor(value);
    document.documentElement.style.setProperty('--primary', value);
    localStorage.setItem('theme-color', value);
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      addSubject(newSubject);
      toast({ title: 'Subject added', description: `"${newSubject}" has been added.` });
      setNewSubject('');
    } else {
       toast({ title: 'Error', description: 'Subject cannot be empty or already exist.', variant: 'destructive' });
    }
  };
  
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex flex-wrap gap-2">
                {THEME_COLORS.map((color) => (
                  <Button
                    key={color.name}
                    variant={themeColor === color.value ? 'default' : 'outline'}
                    onClick={() => handleThemeColorChange(color.value)}
                    style={{
                      backgroundColor: themeColor === color.value ? `hsl(${color.value})` : undefined,
                    }}
                  >
                  {color.name}
                </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Slider
                min={0.75}
                max={1.25}
                step={0.25}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small</span>
                <span>Normal</span>
                <span>Large</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Subjects</CardTitle>
            <CardDescription>
              Add or remove subjects to categorize your documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center justify-between rounded-md border p-3">
                  <span>{subject}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubject(subject)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new subject.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Subject Name"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubject();
                        (e.target as HTMLElement).closest('[role="dialog"]')
                          ?.querySelector('[aria-label="Close"]')
                          // @ts-ignore
                          ?.click()
                      }
                    }}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddSubject}>Add Subject</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
