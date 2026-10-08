export interface TaskItem {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isDone: boolean;
  order: number;
  createdAt: string;
}
