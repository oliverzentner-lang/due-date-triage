export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export type TaskPriority = 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'future';