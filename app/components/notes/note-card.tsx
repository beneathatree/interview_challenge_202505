import { Pencil1Icon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Note } from "~/db/schema";
import { formatRelativeTime } from "~/utils/date";
import { Form } from "@remix-run/react";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

// Predefined color schemes for consistency
const colorSchemes = [
  {
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    accent: "text-blue-600",
    hover: "hover:from-blue-100 hover:to-blue-200"
  },
  {
    gradient: "from-purple-50 to-purple-100", 
    border: "border-purple-200",
    accent: "text-purple-600",
    hover: "hover:from-purple-100 hover:to-purple-200"
  },
  {
    gradient: "from-green-50 to-green-100",
    border: "border-green-200", 
    accent: "text-green-600",
    hover: "hover:from-green-100 hover:to-green-200"
  },
  {
    gradient: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    accent: "text-orange-600", 
    hover: "hover:from-orange-100 hover:to-orange-200"
  },
  {
    gradient: "from-pink-50 to-pink-100",
    border: "border-pink-200",
    accent: "text-pink-600",
    hover: "hover:from-pink-100 hover:to-pink-200"
  },
  {
    gradient: "from-teal-50 to-teal-100",
    border: "border-teal-200",
    accent: "text-teal-600",
    hover: "hover:from-teal-100 hover:to-teal-200"
  }
];

// Get consistent color based on note ID
function getColorScheme(noteId: string) {
  const hash = noteId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorSchemes[hash % colorSchemes.length];
}

export function NoteCard({ note }: NoteCardProps) {
  const colorScheme = getColorScheme(note.id.toString());
  const isFavorite = note.hasFavourite;

  return (
    <Card 
      className={`
        group relative w-80 h-80 flex flex-col overflow-hidden
        bg-gradient-to-br ${colorScheme.gradient} ${colorScheme.border}
        border-2 shadow-sm hover:shadow-lg transition-all duration-300
        ${colorScheme.hover}
      `}
    >
      {/* Favorite Star - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <Form method="post" className="inline">
          <input type="hidden" name="intent" value="toggleFavorite" />
          <input type="hidden" name="noteId" value={note.id} />
          <button
            type="submit"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`
              rounded-full p-2 transition-all duration-200
              ${isFavorite 
                ? 'bg-yellow-100 hover:bg-yellow-200 shadow-sm' 
                : 'bg-white/70 hover:bg-white/90 backdrop-blur-sm'
              }
            `}
          >
            <StarIcon
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-500 hover:text-yellow-500'
              }`}
            />
          </button>
        </Form>
      </div>

      {/* Header */}
      <CardHeader className="flex-none pb-3">
        <CardTitle className="pr-12">
          <Link 
            to={`/notes/${note.id}`} 
            className={`
              block text-xl font-bold line-clamp-2 leading-tight
              hover:underline transition-colors duration-200
              ${colorScheme.accent} hover:opacity-80
            `}
          >
            {note.title}
          </Link>
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 py-0">
        <p className="text-gray-600 line-clamp-4 text-sm leading-relaxed">
          {note.description || "No description available..."}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-none pt-4 border-t border-white/50">
        <div className="flex justify-between items-center w-full">
          {/* Date */}
          <div className="text-xs text-gray-500 font-medium">
            {formatRelativeTime(note.createdAt)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Edit Button */}
            <Link
              to={`/notes/${note.id}/edit`}
              className={`
                p-2 rounded-full transition-all duration-200
                bg-white/70 hover:bg-white shadow-sm hover:shadow-md
                group/edit
              `}
              title="Edit note"
            >
              <Pencil1Icon className="w-4 h-4 text-gray-600 group-hover/edit:text-blue-600 transition-colors" />
            </Link>

            {/* Delete Button */}
            <Form method="post" className="inline">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="noteId" value={note.id} />
              <button
                type="submit"
                title="Delete note"
                className={`
                  p-2 rounded-full transition-all duration-200
                  bg-white/70 hover:bg-red-50 shadow-sm hover:shadow-md
                  group/delete
                `}
                onClick={(e) => {
                  if (
                    !confirm(
                      "Are you sure you want to delete this note? This action cannot be undone."
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <TrashIcon className="w-4 h-4 text-gray-600 group-hover/delete:text-red-600 transition-colors" />
              </button>
            </Form>
          </div>
        </div>
      </CardFooter>

      {/* Favorite Badge - Optional visual indicator */}
      {isFavorite && (
        <div className="absolute top-0 right-12 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-b-md font-medium shadow-sm">
          ★ Favorite
        </div>
      )}
    </Card>
  );
}