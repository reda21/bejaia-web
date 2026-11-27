import { describe, expect, it } from 'bun:test';
import {
  INITIAL_TODOS,
  computeTodoStats,
  filterTodos,
  type TodoItem,
} from '@/lib/todo/utils';

describe('computeTodoStats', () => {
  it('returns zeroes for an empty list', () => {
    expect(computeTodoStats([])).toEqual({
      total: 0,
      completed: 0,
      active: 0,
      percent: 0,
    });
  });

  it('computes active, completed, and rounded percentage', () => {
    expect(computeTodoStats(INITIAL_TODOS)).toEqual({
      total: 3,
      completed: 1,
      active: 2,
      percent: 33,
    });
  });

  it('returns 100% when all todos are completed', () => {
    const allDone: TodoItem[] = INITIAL_TODOS.map((t) => ({
      ...t,
      completed: true,
    }));
    expect(computeTodoStats(allDone)).toEqual({
      total: 3,
      completed: 3,
      active: 0,
      percent: 100,
    });
  });
});

describe('filterTodos', () => {
  it('returns all todos with default filters', () => {
    const result = filterTodos(INITIAL_TODOS, {
      status: 'all',
      priority: 'all',
      searchQuery: '',
    });
    expect(result).toHaveLength(3);
  });

  it('filters by active and completed status', () => {
    const active = filterTodos(INITIAL_TODOS, {
      status: 'active',
      priority: 'all',
      searchQuery: '',
    });
    expect(active.map((t) => t.id)).toEqual(['demo-2', 'demo-3']);

    const completed = filterTodos(INITIAL_TODOS, {
      status: 'completed',
      priority: 'all',
      searchQuery: '',
    });
    expect(completed.map((t) => t.id)).toEqual(['demo-1']);
  });

  it('filters by priority and case-insensitive search query', () => {
    const result = filterTodos(INITIAL_TODOS, {
      status: 'active',
      priority: 'medium',
      searchQuery: '  TICHY ',
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('demo-2');
  });
});
