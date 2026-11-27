import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { TodoDemoClient } from '@/components/todo/TodoDemoClient';
import { createClient } from '@/utils/supabase/server';
import type { Category, Priority, TodoItem } from '@/lib/todo/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Démonstration Todo List',
  description:
    'Page de démonstration interactive d’une liste de tâches (Todo List) connectée à Supabase avec filtres, priorités et édition en ligne.',
};

interface SupabaseTodoRow {
  id: string | number;
  title?: string | null;
  name?: string | null;
  completed?: boolean | null;
  is_complete?: boolean | null;
  priority?: Priority | null;
  category?: Category | null;
  created_at?: string | null;
}

export default async function TodoDemoPage() {
  let initialTodos: TodoItem[] | null = null;
  let supabaseError: string | null = null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        supabaseError = error.message;
      } else if (Array.isArray(data)) {
        initialTodos = (data as SupabaseTodoRow[]).map((row) => ({
          id: String(row.id),
          title: row.title ?? row.name ?? '',
          completed: Boolean(row.completed ?? row.is_complete ?? false),
          priority: row.priority ?? 'medium',
          category: row.category ?? 'Général',
          createdAt: row.created_at ? Date.parse(row.created_at) : 0,
        }));
      }
    } catch (err: unknown) {
      supabaseError =
        err instanceof Error ? err.message : 'Erreur de connexion Supabase';
    }
  }

  return (
    <TodoDemoClient
      initialServerTodos={initialTodos}
      initialSupabaseError={supabaseError}
    />
  );
}
