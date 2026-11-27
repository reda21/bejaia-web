export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'active' | 'completed';
export type Category = 'Général' | 'Préparation' | 'Visite' | 'Perso';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  percent: number;
}

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'demo-1',
    title: 'Préparer l’itinéraire du Cap Carbon et du Pic des Singes',
    completed: true,
    priority: 'high',
    category: 'Visite',
    createdAt: 1,
  },
  {
    id: 'demo-2',
    title: 'Vérifier la météo marine pour la sortie vers Tichy',
    completed: false,
    priority: 'medium',
    category: 'Préparation',
    createdAt: 2,
  },
  {
    id: 'demo-3',
    title: 'Tester les filtres, l’édition en ligne et les priorités',
    completed: false,
    priority: 'low',
    category: 'Général',
    createdAt: 3,
  },
];

export function computeTodoStats(todos: TodoItem[]): TodoStats {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, active, percent };
}

export function filterTodos(
  todos: TodoItem[],
  options: {
    status: FilterStatus;
    priority: Priority | 'all';
    searchQuery: string;
  }
): TodoItem[] {
  const query = options.searchQuery.trim().toLowerCase();
  return todos.filter((todo) => {
    if (options.status === 'active' && todo.completed) return false;
    if (options.status === 'completed' && !todo.completed) return false;
    if (options.priority !== 'all' && todo.priority !== options.priority) {
      return false;
    }
    if (query && !todo.title.toLowerCase().includes(query)) return false;
    return true;
  });
}
