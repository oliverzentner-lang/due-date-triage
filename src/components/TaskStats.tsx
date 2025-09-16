import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { Task } from '@/types/task';
import { getTaskPriority } from '@/utils/taskUtils';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const overdueTasks = tasks.filter(task => !task.completed && getTaskPriority(task) === 'overdue').length;
  const todayTasks = tasks.filter(task => !task.completed && getTaskPriority(task) === 'today').length;
  const upcomingTasks = tasks.filter(task => !task.completed && ['tomorrow', 'this-week', 'future'].includes(getTaskPriority(task))).length;

  const stats = [
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      className: 'bg-gradient-success text-success-foreground',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      className: 'bg-gradient-urgent text-urgent-foreground',
    },
    {
      label: 'Due Today',
      value: todayTasks,
      icon: Clock,
      className: 'bg-gradient-warning text-warning-foreground',
    },
    {
      label: 'Upcoming',
      value: upcomingTasks,
      icon: Calendar,
      className: 'bg-gradient-future text-future-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.className}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}