import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { sortTasksByPriority } from '@/utils/taskUtils';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskStats } from '@/components/TaskStats';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // Convert date strings back to Date objects
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
      }));
      setTasks(tasksWithDates);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task added!",
      description: "Your new task has been created.",
    });
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast({
        title: "Task completed! 🎉",
        description: "Great job staying productive!",
      });
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Task has been removed from your list.",
      variant: "destructive",
    });
  };

  const sortedTasks = sortTasksByPriority(tasks);
  const activeTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Task Tracker</h1>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Smart Priority
            </Badge>
          </div>
          <p className="text-primary-foreground/80">
            Stay organized with automatic priority sorting by due date
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Add Task Form */}
        <AddTaskForm onAddTask={addTask} />

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-primary rounded-full"></div>
              Active Tasks ({activeTasks.length})
            </h2>
            <div className="space-y-3">
              {activeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-success rounded-full"></div>
              Completed ({completedTasks.length})
            </h2>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-primary rounded-full inline-block mb-4">
              <CheckSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No tasks yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first task and start staying organized!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
