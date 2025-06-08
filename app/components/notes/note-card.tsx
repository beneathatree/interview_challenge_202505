import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Note } from "~/db/schema";
import { getRandomBackgroundColorCard } from "~/lib/utils";
import { formatRelativeTime } from "~/utils/date";
import { Form } from "@remix-run/react";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const { style } = getRandomBackgroundColorCard();

  return (
    <Card style={style} className="flex flex-col w-80 h-80">
      <CardHeader className="flex-none">
        <CardTitle className="line-clamp-2 font-semibold text-2xl">
          <Link to={`/notes/${note.id}`} className="hover:underline">
            {note.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 text-xl text-muted-foreground">
          {note.description || ""}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div>
          <p className="text-md text-muted-foreground">
            {formatRelativeTime(note.createdAt)}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <div className="bg-black p-2 rounded-full flex items-center justify-center w-10 h-10">
            <Pencil1Icon className="w-6 h-6 text-gray-200 hover:cursor-pointer" />
          </div>

          <div className="bg-black p-2 rounded-full flex items-center justify-center w-10 h-10">
            <Form method="post" reloadDocument>
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="noteId" value={note.id} />
              <button
                title="Delete note"
                type="submit"
                onClick={(e) => {
                  if (
                    !confirm(
                      "Are you sure you wanna delete this note? This can't be undone."
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <TrashIcon className="w-6 h-6 text-gray-200 hover:cursor-pointer" />
              </button>
            </Form>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
