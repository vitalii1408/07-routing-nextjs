import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

export const dynamic = 'force-dynamic';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const filter = slug[0];

  if (filter !== 'all' && !tags.includes(filter as NoteTag)) {
    notFound();
  }

  const tag = filter === 'all' ? undefined : (filter as NoteTag);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
