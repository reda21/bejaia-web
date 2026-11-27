'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  CheckCheck,
  Database,
  Edit3,
  HardDrive,
  ListTodo,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { createClient as createSupabaseBrowserClient } from '@/utils/supabase/client';
import {
  INITIAL_TODOS,
  computeTodoStats,
  filterTodos,
  type Category,
  type FilterStatus,
  type Priority,
  type TodoItem,
} from '@/lib/todo/utils';

const STORAGE_KEY = 'bejaia_todo_demo_v1';

const PRIORITY_META: Record<
  Priority,
  { label: string; badgeClass: string; dotClass: string }
> = {
  high: {
    label: 'Haute',
    badgeClass:
      'bg-[#C47B55]/15 text-[#9E4E28] border-[#C47B55]/30 dark:text-[#E29A74]',
    dotClass: 'bg-[#C47B55]',
  },
  medium: {
    label: 'Moyenne',
    badgeClass:
      'bg-[#087E9B]/12 text-[#087E9B] border-[#087E9B]/25 dark:text-[#3AB8D6]',
    dotClass: 'bg-[#087E9B]',
  },
  low: {
    label: 'Basse',
    badgeClass:
      'bg-[#356B50]/12 text-[#356B50] border-[#356B50]/25 dark:text-[#62B88C]',
    dotClass: 'bg-[#356B50]',
  },
};

const CATEGORIES: Category[] = ['Général', 'Préparation', 'Visite', 'Perso'];
const STORAGE_EVENT = 'bejaia-todo-demo-change';

let cachedRaw: string | null = null;
let cachedTodos: TodoItem[] = INITIAL_TODOS;

function getTodosSnapshot(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedTodos;
    }
    cachedRaw = raw;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedTodos = parsed;
        return cachedTodos;
      }
    }
  } catch {
    // Ignore invalid localStorage payload
  }
  cachedTodos = INITIAL_TODOS;
  return cachedTodos;
}

function getTodosServerSnapshot(): TodoItem[] {
  return INITIAL_TODOS;
}

function subscribeTodos(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function writeTodos(next: TodoItem[]) {
  try {
    const serialized = JSON.stringify(next);
    cachedRaw = serialized;
    cachedTodos = next;
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota errors
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

interface TodoDemoClientProps {
  initialServerTodos?: TodoItem[] | null;
  initialSupabaseError?: string | null;
}

export function TodoDemoClient({
  initialServerTodos = null,
  initialSupabaseError = null,
}: TodoDemoClientProps) {
  const supabaseEnabled =
    initialServerTodos !== null && !initialSupabaseError;
  const localTodos = useSyncExternalStore(
    subscribeTodos,
    getTodosSnapshot,
    getTodosServerSnapshot
  );
  const [remoteTodos, setRemoteTodos] = useState<TodoItem[] | null>(
    initialServerTodos
  );
  const [supabaseError, setSupabaseError] = useState<string | null>(
    initialSupabaseError
  );

  const todos = supabaseEnabled && remoteTodos !== null ? remoteTodos : localTodos;

  const updateTodos = (updater: (prev: TodoItem[]) => TodoItem[]) => {
    if (supabaseEnabled && remoteTodos !== null) {
      setRemoteTodos((prev) => updater(prev ?? []));
      return;
    }
    writeTodos(updater(localTodos));
  };

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState<Category>('Général');

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const stats = useMemo(() => computeTodoStats(todos), [todos]);

  const filteredTodos = useMemo(
    () =>
      filterTodos(todos, {
        status: statusFilter,
        priority: priorityFilter,
        searchQuery,
      }),
    [todos, statusFilter, priorityFilter, searchQuery]
  );

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const item: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: trimmed,
      completed: false,
      priority: newPriority,
      category: newCategory,
      createdAt: Date.now(),
    };

    updateTodos((prev) => [item, ...prev]);
    setNewTitle('');

    if (supabaseEnabled) {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('todos')
        .insert({
          title: item.title,
          completed: item.completed,
          priority: item.priority,
          category: item.category,
        })
        .select('id')
        .single();

      if (error) {
        setSupabaseError(error.message);
      } else if (data?.id) {
        setRemoteTodos((prev) =>
          (prev ?? []).map((t) =>
            t.id === item.id ? { ...t, id: String(data.id) } : t
          )
        );
        setSupabaseError(null);
      }
    }
  };

  const toggleTodo = async (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;

    updateTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: nextCompleted } : todo
      )
    );

    if (supabaseEnabled) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('todos')
        .update({ completed: nextCompleted })
        .eq('id', id);
      if (error) setSupabaseError(error.message);
    }
  };

  const deleteTodo = async (id: string) => {
    updateTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingTitle('');
    }

    if (supabaseEnabled) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) setSupabaseError(error.message);
    }
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (id: string) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      await deleteTodo(id);
      return;
    }
    updateTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: trimmed } : todo))
    );
    setEditingId(null);
    setEditingTitle('');

    if (supabaseEnabled) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('todos')
        .update({ title: trimmed })
        .eq('id', id);
      if (error) setSupabaseError(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const toggleAll = async () => {
    const allDone = todos.length > 0 && todos.every((t) => t.completed);
    const nextCompleted = !allDone;
    const ids = todos
      .filter((t) => t.completed !== nextCompleted)
      .map((t) => t.id);

    updateTodos((prev) => prev.map((t) => ({ ...t, completed: nextCompleted })));

    if (supabaseEnabled && ids.length > 0) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('todos')
        .update({ completed: nextCompleted })
        .in('id', ids);
      if (error) setSupabaseError(error.message);
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    updateTodos((prev) => prev.filter((t) => !t.completed));

    if (supabaseEnabled && completedIds.length > 0) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', completedIds);
      if (error) setSupabaseError(error.message);
    }
  };

  const resetDemo = async () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
    setEditingId(null);

    if (!supabaseEnabled) {
      writeTodos(INITIAL_TODOS);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const currentIds = todos.map((t) => t.id);
    if (currentIds.length > 0) {
      await supabase.from('todos').delete().in('id', currentIds);
    }
    const { data, error } = await supabase
      .from('todos')
      .insert(
        INITIAL_TODOS.map((item) => ({
          title: item.title,
          completed: item.completed,
          priority: item.priority,
          category: item.category,
        }))
      )
      .select();

    if (error) {
      setSupabaseError(error.message);
    } else if (Array.isArray(data)) {
      setRemoteTodos(
        data.map((row) => ({
          id: String(row.id),
          title: String(row.title ?? ''),
          completed: Boolean(row.completed),
          priority: (row.priority as Priority) ?? 'medium',
          category: (row.category as Category) ?? 'Général',
          createdAt: row.created_at ? Date.parse(String(row.created_at)) : Date.now(),
        }))
      );
      setSupabaseError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#087E9B]/25 bg-[#087E9B]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#087E9B]">
                <Sparkles className="h-3.5 w-3.5" />
                Page de démonstration
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  supabaseEnabled && !supabaseError
                    ? 'border-[#356B50]/25 bg-[#356B50]/10 text-[#356B50] dark:text-[#62B88C]'
                    : 'border-[#103B50]/15 bg-white text-[#51636D]'
                }`}
              >
                {supabaseEnabled && !supabaseError ? (
                  <>
                    <Database className="h-3.5 w-3.5" />
                    Supabase
                  </>
                ) : (
                  <>
                    <HardDrive className="h-3.5 w-3.5" />
                    Mode local (localStorage)
                  </>
                )}
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#103B50] sm:text-4xl">
              Gestionnaire de tâches
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#51636D] sm:text-base">
              Ajoutez, modifiez, filtrez et organisez vos tâches par priorité.{' '}
              {supabaseEnabled
                ? 'Synchronisé avec votre table Supabase todos.'
                : 'Sauvegardé localement dans votre navigateur.'}
            </p>
            {supabaseError && (
              <p className="mt-2 text-xs font-medium text-[#C47B55]">
                Supabase : {supabaseError}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-[#103B50]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#103B50] shadow-xs transition hover:bg-[#F4EFE5] sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser la démo
          </button>
        </div>

        {/* Stats & Progress Card */}
        <div className="mb-6 rounded-2xl border border-[#103B50]/12 bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#087E9B]/10 text-[#087E9B]">
                <ListTodo className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#51636D]">
                  Progression globale
                </p>
                <p className="text-lg font-bold text-[#103B50]">
                  {stats.completed} sur {stats.total} tâche
                  {stats.total > 1 ? 's' : ''} terminée
                  {stats.completed > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="rounded-lg bg-[#F4EFE5] px-3 py-1.5 text-[#103B50]">
                {stats.active} en cours
              </span>
              <span className="rounded-lg bg-[#356B50]/12 px-3 py-1.5 text-[#356B50] dark:text-[#62B88C]">
                {stats.percent}%
              </span>
            </div>
          </div>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#F4EFE5]">
            <motion.div
              className="h-full rounded-full bg-[#087E9B]"
              initial={false}
              animate={{ width: `${stats.percent}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            />
          </div>
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleAddTodo}
          className="mb-6 rounded-2xl border border-[#103B50]/12 bg-white p-4 shadow-xs sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nouvelle tâche (ex. Réserver un guide pour Gouraya)..."
              aria-label="Titre de la nouvelle tâche"
              className="flex-1 rounded-xl border border-[#103B50]/15 bg-[#FAF8F3] px-4 py-2.5 text-sm text-[#102530] placeholder:text-[#51636D]/70 focus:border-[#087E9B] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087E9B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103B50] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#51636D]">Priorité :</span>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                aria-label="Priorité de la nouvelle tâche"
                className="rounded-lg border border-[#103B50]/15 bg-[#FAF8F3] px-2.5 py-1.5 font-medium text-[#103B50]"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#51636D]">Catégorie :</span>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                aria-label="Catégorie de la nouvelle tâche"
                className="rounded-lg border border-[#103B50]/15 bg-[#FAF8F3] px-2.5 py-1.5 font-medium text-[#103B50]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Filters & Search Toolbar */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#103B50]/12 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `Toutes (${stats.total})` },
                { id: 'active', label: `À faire (${stats.active})` },
                { id: 'completed', label: `Terminées (${stats.completed})` },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#103B50] text-white dark:bg-[#3AB8D6] dark:text-[#0B1720]'
                      : 'bg-[#FAF8F3] text-[#51636D] hover:bg-[#F4EFE5] hover:text-[#103B50]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as Priority | 'all')
              }
              aria-label="Filtrer par priorité"
              className="rounded-lg border border-[#103B50]/15 bg-[#FAF8F3] px-2.5 py-1.5 text-xs font-medium text-[#103B50]"
            >
              <option value="all">Toutes priorités</option>
              <option value="high">Priorité haute</option>
              <option value="medium">Priorité moyenne</option>
              <option value="low">Priorité basse</option>
            </select>

            <div className="relative flex-1 sm:w-48 sm:flex-none">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#51636D]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                aria-label="Rechercher une tâche"
                className="w-full rounded-lg border border-[#103B50]/15 bg-[#FAF8F3] py-1.5 pl-8 pr-3 text-xs text-[#102530] placeholder:text-[#51636D]/70 focus:border-[#087E9B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="overflow-hidden rounded-2xl border border-[#103B50]/12 bg-white shadow-xs">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EFE5] text-[#51636D]">
                <ListTodo className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-[#103B50]">
                Aucune tâche à afficher
              </p>
              <p className="mt-1 text-xs text-[#51636D]">
                Ajoutez une nouvelle tâche ci-dessus ou ajustez vos filtres.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#103B50]/10">
              <AnimatePresence initial={false}>
                {filteredTodos.map((todo) => {
                  const priority = PRIORITY_META[todo.priority];
                  const isEditing = editingId === todo.id;

                  return (
                    <motion.li
                      key={todo.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-[#FAF8F3] sm:px-5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo.id)}
                        aria-label={
                          todo.completed
                            ? `Marquer "${todo.title}" comme à faire`
                            : `Marquer "${todo.title}" comme terminée`
                        }
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          todo.completed
                            ? 'border-[#356B50] bg-[#356B50] text-white'
                            : 'border-[#103B50]/30 bg-white hover:border-[#087E9B]'
                        }`}
                      >
                        {todo.completed && <Check className="h-3.5 w-3.5" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(todo.id);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                              aria-label="Modifier le titre de la tâche"
                              className="w-full rounded-lg border border-[#087E9B] bg-white px-2.5 py-1 text-sm text-[#102530] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => saveEdit(todo.id)}
                              aria-label="Valider la modification"
                              className="rounded-lg bg-[#356B50] p-1.5 text-white hover:opacity-90"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              aria-label="Annuler la modification"
                              className="rounded-lg bg-[#F4EFE5] p-1.5 text-[#51636D] hover:text-[#103B50]"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span
                              onDoubleClick={() => startEditing(todo)}
                              className={`text-sm font-medium transition ${
                                todo.completed
                                  ? 'text-[#51636D] line-through opacity-75'
                                  : 'text-[#102530]'
                              }`}
                            >
                              {todo.title}
                            </span>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="rounded-md bg-[#F4EFE5] px-2 py-0.5 text-[11px] font-medium text-[#51636D]">
                                {todo.category}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${priority.badgeClass}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${priority.dotClass}`}
                                />
                                {priority.label}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex shrink-0 items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                          <button
                            type="button"
                            onClick={() => startEditing(todo)}
                            aria-label={`Modifier "${todo.title}"`}
                            className="rounded-lg p-1.5 text-[#51636D] transition hover:bg-[#F4EFE5] hover:text-[#087E9B]"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTodo(todo.id)}
                            aria-label={`Supprimer "${todo.title}"`}
                            className="rounded-lg p-1.5 text-[#51636D] transition hover:bg-[#C47B55]/15 hover:text-[#C47B55]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}

          {/* Footer Bulk Actions */}
          {todos.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#103B50]/10 bg-[#FAF8F3] px-4 py-3 text-xs text-[#51636D] sm:px-5">
              <button
                type="button"
                onClick={toggleAll}
                className="inline-flex items-center gap-1.5 font-semibold text-[#103B50] transition hover:text-[#087E9B]"
              >
                <CheckCheck className="h-4 w-4" />
                {todos.every((t) => t.completed)
                  ? 'Tout marquer à faire'
                  : 'Tout marquer terminé'}
              </button>

              {stats.completed > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#C47B55] transition hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer les terminées ({stats.completed})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
