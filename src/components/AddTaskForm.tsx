import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Task } from '@/types/task';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) return;
    
    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(dueDate),
      completed: false,
    });
    
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsOpen(false);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-6"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Add New Task</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-card-foreground">
            Task Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-card-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details... (optional)"
            className="mt-1 resize-none"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="dueDate" className="text-sm font-medium text-card-foreground">
            Due Date *
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            defaultValue={getTomorrowDate()}
            className="mt-1"
            required
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
            disabled={!title.trim() || !dueDate}
          >
            Add Task
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}