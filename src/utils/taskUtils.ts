import { Task, TaskPriority } from '@/types/task';

export function getTaskPriority(task: Task): TaskPriority {
  if (task.completed) return 'future';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() + 7);
  
  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  if (taskDate < today) return 'overdue';
  if (taskDate.getTime() === today.getTime()) return 'today';
  if (taskDate.getTime() === tomorrow.getTime()) return 'tomorrow';
  if (taskDate <= thisWeek) return 'this-week';
  return 'future';
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    'overdue': 0,
    'today': 1,
    'tomorrow': 2,
    'this-week': 3,
    'future': 4,
  };

  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    const aPriority = getTaskPriority(a);
    const bPriority = getTaskPriority(b);
    
    if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    }
    
    // Same priority, sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function formatRelativeDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() === today.getTime()) return 'Today';
  if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
  if (taskDate < today) return 'Overdue';
  
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  
  return taskDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}