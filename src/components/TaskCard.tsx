import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar } from 'lucide-react';
import { Task } from '@/types/task';
import { getTaskPriority, formatRelativeDate } from '@/utils/taskUtils';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  overdue: 'bg-gradient-urgent text-urgent-foreground border-urgent',
  today: 'bg-gradient-warning text-warning-foreground border-warning',
  tomorrow: 'bg-gradient-future text-future-foreground border-future',
  'this-week': 'bg-gradient-future text-future-foreground border-future',
  future: 'bg-gradient-success text-success-foreground border-success',
};

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const priority = getTaskPriority(task);
  const relativeDate = formatRelativeDate(task.dueDate);
  
  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-elevated",
      "bg-gradient-card shadow-card",
      task.completed && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-card-foreground truncate",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1 line-clamp-2",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge 
              variant={task.completed ? "secondary" : "default"}
              className={cn(
                "text-xs font-medium",
                !task.completed && priorityStyles[priority]
              )}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {relativeDate}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}