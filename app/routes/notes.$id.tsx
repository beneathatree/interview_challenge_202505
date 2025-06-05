import { type LoaderFunctionArgs } from "@remix-run/node";
import { data as json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoteDetail } from "~/components/notes/note-detail";
import { NoteDetailSkeleton } from "~/components/notes/note-detail-skeleton";
import { getNoteById } from "~/services/notes.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const noteId = parseInt(params.id || "", 10);

  if (isNaN(noteId)) {
    throw new Response("Invalid note ID", { status: 400 });
  }

  let note = await getNoteById(noteId);
  if (!note) {
    throw new Response("Note not found", { status: 404 });
  }

  const formattedNote = {
    ...note,
    createdAt : note.createdAt.toISOString()
  }

  return ({ formattedNote });
}

export default function NoteDetailPage() {
  const { formattedNote } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="container py-8">
      {isLoading ? <NoteDetailSkeleton /> : <NoteDetail note={formattedNote} />}
    </div>
  );
}
