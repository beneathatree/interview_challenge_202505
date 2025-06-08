import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect, data } from "@remix-run/node";
import { RemixServer, useLocation, Link, NavLink, Form, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, LiveReload, useActionData, useNavigation } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { pgTable, timestamp, text, serial, integer } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import * as LabelPrimitive from "@radix-ui/react-label";
import { PlusIcon } from "@radix-ui/react-icons";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { z } from "zod";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function RootLayout({ children, isAuthenticated }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";
  if (isAuthPage || !isAuthenticated) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen flex-col", children: /* @__PURE__ */ jsx("main", { className: "flex flex-1 items-center justify-center", children }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b", children: /* @__PURE__ */ jsxs("div", { className: "container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "text-xl font-bold tracking-tight hover:text-primary",
          children: "Notes App"
        }
      ),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/notes",
            className: ({ isActive }) => cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            ),
            children: "Notes"
          }
        ),
        /* @__PURE__ */ jsx(Form, { action: "/logout", method: "post", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", type: "submit", children: "Logout" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "container py-8", children }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t py-6", children: /* @__PURE__ */ jsxs("div", { className: "container flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Notes App. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/terms",
            className: "text-sm text-muted-foreground hover:text-primary",
            children: "Terms"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/privacy",
            className: "text-sm text-muted-foreground hover:text-primary",
            children: "Privacy"
          }
        )
      ] })
    ] }) })
  ] });
}
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "notes_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    // 30 days
    httpOnly: true
  }
});
async function createUserSession(userId, redirectTo) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
async function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId$1(request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return userId;
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
async function logout(request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}
async function loader$5({ request }) {
  const userId = await getUserId$1(request);
  return data({ isAuthenticated: !!userId });
}
function App() {
  const { isAuthenticated } = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full", children: [
      /* @__PURE__ */ jsx(RootLayout, { isAuthenticated, children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(LiveReload, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    // use unique name for better security
    httpOnly: true,
    // prevents JavaScript access to cookie
    path: "/",
    // cookie is available for all routes
    sameSite: "lax",
    // CSRF protection
    secrets: [process.env.SESSION_SECRET || "default-secret-please-change"],
    // used to sign the cookie
    secure: process.env.NODE_ENV === "production"
    // only use HTTPS in production
  }
});
async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  return userId || null;
}
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool);
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
relations(users, ({ many }) => ({
  notes: many(notes)
}));
relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id]
  })
}));
const queries = {
  users: {
    findByEmail: (email) => db.select().from(users).where(sql`${users.email} = ${email}`).limit(1),
    findById: (id) => db.select().from(users).where(sql`${users.id} = ${id}`).limit(1)
  }
};
async function authenticateUser(email, password) {
  const [user] = await db.select().from(users).where(sql`${users.email} = ${email} AND ${users.password} = ${password}`);
  return user || null;
}
async function getUserById(id) {
  const [user] = await queries.users.findById(id);
  return user || null;
}
async function requireAuthApi(request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw data({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUserById(userId);
  if (!user) {
    throw data({ error: "User not found" }, { status: 401 });
  }
  return { userId, user };
}
async function createNote(data2) {
  const [note] = await db.insert(notes).values(data2).returning();
  return note;
}
async function getNoteById(id) {
  const [note] = await db.select().from(notes).where(sql`${notes.id} = ${id}`);
  return note || null;
}
async function getNotesByUserId(userId, { limit = 10 } = {}) {
  const notesList = await db.select().from(notes).where(sql`${notes.userId} = ${userId}`).limit(limit);
  return {
    notes: notesList
  };
}
async function loader$4({ request }) {
  const { userId } = await requireAuthApi(request);
  try {
    const { notes: notes2 } = await getNotesByUserId(userId);
    return data({
      success: true,
      notes: notes2
    });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return data({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});
const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto"
});
function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return DATE_FORMATTER.format(dateObj);
}
function formatRelativeTime(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = /* @__PURE__ */ new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1e3);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) > 30) {
    return formatDate(dateObj);
  }
  if (Math.abs(diffInDays) > 0) {
    return RELATIVE_FORMATTER.format(diffInDays, "day");
  }
  if (Math.abs(diffInHours) > 0) {
    return RELATIVE_FORMATTER.format(diffInHours, "hour");
  }
  if (Math.abs(diffInMinutes) > 0) {
    return RELATIVE_FORMATTER.format(diffInMinutes, "minute");
  }
  return "just now";
}
function NoteCard({ note }) {
  return /* @__PURE__ */ jsxs(Card, { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "flex-none", children: /* @__PURE__ */ jsx(CardTitle, { className: "line-clamp-2", children: /* @__PURE__ */ jsx(Link, { to: `/notes/${note.id}`, className: "hover:underline", children: note.title }) }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "line-clamp-3 text-sm text-muted-foreground", children: note.description || "" }) }),
    /* @__PURE__ */ jsx(CardFooter, { className: "flex-none border-t pt-4", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: formatRelativeTime(note.createdAt) }) })
  ] });
}
function NotesGrid({
  notes: notes2,
  emptyMessage = "No notes found."
}) {
  if (notes2.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-[200px] items-center justify-center rounded-lg border border-dashed", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: emptyMessage }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: notes2.map((note) => /* @__PURE__ */ jsx(NoteCard, { note }, note.id)) });
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
function NoteForm({ defaultValues = {}, onSuccess }) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const actionData = useActionData();
  const navigation = useNavigation();
  const formRef = useRef(null);
  const isSubmitting = navigation.state === "submitting";
  useEffect(() => {
    var _a2;
    if (actionData == null ? void 0 : actionData.success) {
      (_a2 = formRef.current) == null ? void 0 : _a2.reset();
      onSuccess == null ? void 0 : onSuccess();
    }
  }, [actionData == null ? void 0 : actionData.success, onSuccess]);
  return /* @__PURE__ */ jsxs(Form, { ref: formRef, method: "post", className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "title",
          name: "title",
          defaultValue: defaultValues.title,
          required: true,
          maxLength: 255,
          "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title) ? true : void 0,
          "aria-errormessage": (_c = (_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.title) == null ? void 0 : _c.join(", ")
        }
      ),
      ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.title) && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", id: "title-error", children: actionData.errors.title.join(", ") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Description" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "description",
          name: "description",
          defaultValue: defaultValues.description,
          required: true,
          rows: 5,
          maxLength: 1e4,
          placeholder: "Write your note here...",
          "aria-invalid": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.description) ? true : void 0,
          "aria-errormessage": (_g = (_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.description) == null ? void 0 : _g.join(", ")
        }
      ),
      ((_h = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _h.description) && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", id: "description-error", children: actionData.errors.description.join(", ") })
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Saving..." : "Save Note" })
  ] });
}
function PageHeader({ className, children, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex flex-col gap-2", className), ...props, children });
}
function PageHeaderHeading({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "h1",
    {
      className: cn("text-3xl font-bold tracking-tight", className),
      ...props,
      children
    }
  );
}
function PageHeaderDescription({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx("p", { className: cn("text-muted-foreground", className), ...props, children });
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().min(1, "Description is required").max(1e4, "Description must be less than 10000 characters")
});
noteSchema.partial();
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-primary/10", className),
      ...props
    }
  );
}
function NoteSkeleton() {
  return /* @__PURE__ */ jsxs(Card, { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "flex-none space-y-2", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-4/6" })
    ] }),
    /* @__PURE__ */ jsx(CardFooter, { className: "flex-none border-t pt-4", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-24" }) })
  ] });
}
function NotesGridSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(NoteSkeleton, {}, i)) });
}
async function loader$3({ request }) {
  const userId = await requireUserId(request);
  const { notes: notes2 } = await getNotesByUserId(userId);
  const formattedNotes = notes2.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString()
  }));
  return { formattedNotes };
}
async function action$2({ request }) {
  const userId = await requireUserId(request);
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }
  const formData = await request.formData();
  const data$1 = {
    title: formData.get("title"),
    description: formData.get("description")
  };
  const result = noteSchema.safeParse(data$1);
  if (!result.success) {
    return data(
      {
        success: false,
        errors: result.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }
  try {
    const note = await createNote({
      ...result.data,
      userId
    });
    return data({ success: true, note });
  } catch (error) {
    console.error("Failed to create note:", error);
    return data({ error: "Failed to create note" }, { status: 500 });
  }
}
function NotesIndexPage() {
  const { notes: notes2 } = useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return /* @__PURE__ */ jsx("div", { className: "h-full min-h-screen bg-background", children: /* @__PURE__ */ jsx("div", { className: "container px-4 py-10 sm:px-6 lg:px-8 lg:py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto space-y-8", children: [
    /* @__PURE__ */ jsx(PageHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(PageHeaderHeading, { children: "Notes" }),
        /* @__PURE__ */ jsx(PageHeaderDescription, { children: "Manage your notes and thoughts in one place." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => {
            setIsOpen(true);
          },
          disabled: isLoading,
          children: [
            /* @__PURE__ */ jsx(PlusIcon, { className: "mr-2 h-4 w-4" }),
            "Create Note"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Separator, {}),
    isOpen ? /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Create Note" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setIsOpen(false),
            disabled: isLoading,
            children: "Cancel"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
        NoteForm,
        {
          onSuccess: () => {
            setIsOpen(false);
          }
        }
      ) })
    ] }) : null,
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Your Notes" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "A list of all your notes. Click on a note to view its details." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx(NotesGridSkeleton, {}) : /* @__PURE__ */ jsx(NotesGrid, { notes: notes2 }) })
    ] })
  ] }) }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: NotesIndexPage,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function NoteDetail({ note }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: note.title }),
      /* @__PURE__ */ jsxs(CardDescription, { children: [
        "Created ",
        formatDate(note.createdAt)
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: note.description || "" }) })
  ] });
}
function NoteDetailSkeleton() {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-2/3" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/3" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-4/6" })
    ] })
  ] });
}
async function loader$2({ params }) {
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
    createdAt: note.createdAt.toISOString()
  };
  return { formattedNote };
}
function NoteDetailPage() {
  const { formattedNote } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return /* @__PURE__ */ jsx("div", { className: "container py-8", children: isLoading ? /* @__PURE__ */ jsx(NoteDetailSkeleton, {}) : /* @__PURE__ */ jsx(NoteDetail, { note: formattedNote }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NoteDetailPage,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function action$1({ request }) {
  return logout(request);
}
async function loader$1() {
  return redirect("/login");
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
async function loader({ request }) {
  const userId = await getUserId$1(request);
  if (!userId) {
    return redirect("/login");
  }
  return redirect("/notes");
}
function Index() {
  return /* @__PURE__ */ jsx("div", { children: "Hello World" });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function LoginForm({
  redirectTo,
  errors,
  isSubmitting
}) {
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl text-center", children: "Welcome back" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "Enter your email and password to sign in" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Form, { method: "post", className: "space-y-4", children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "redirectTo", value: redirectTo }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            name: "email",
            type: "email",
            placeholder: "name@example.com",
            autoComplete: "email",
            required: true,
            "aria-describedby": (errors == null ? void 0 : errors.email) ? "email-error" : void 0
          }
        ),
        (errors == null ? void 0 : errors.email) && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", id: "email-error", children: errors.email[0] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            name: "password",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
            "aria-describedby": (errors == null ? void 0 : errors.password) ? "password-error" : void 0
          }
        ),
        (errors == null ? void 0 : errors.password) && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", id: "password-error", children: errors.password[0] })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: isSubmitting ? "Signing in..." : "Sign in" })
    ] }) })
  ] });
}
async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/notes";
  if (!email || !password) {
    return data(
      {
        errors: {
          email: ["Email is required"],
          password: ["Password is required"]
        }
      },
      { status: 400 }
    );
  }
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return data(
        {
          errors: {
            email: ["Invalid email or password"]
          }
        },
        { status: 401 }
      );
    }
    return createUserSession(user.id.toString(), redirectTo);
  } catch (error) {
    console.error("Login error:", error);
    return data(
      {
        errors: {
          email: ["An error occurred during login"]
        }
      },
      { status: 500 }
    );
  }
}
function LoginPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ jsx(
    LoginForm,
    {
      errors: actionData == null ? void 0 : actionData.errors,
      isSubmitting,
      redirectTo: "/notes"
    }
  );
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: LoginPage
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-gWF2Rvht.js", "imports": ["/assets/jsx-runtime-DlxonYWr.js", "/assets/components-Czq65UFQ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DnA4NtUh.js", "imports": ["/assets/jsx-runtime-DlxonYWr.js", "/assets/components-Czq65UFQ.js", "/assets/utils-bRKmu4jq.js", "/assets/button-D4isoa3P.js"], "css": ["/assets/root-D09Nb91H.css"] }, "routes/api.notes.list": { "id": "routes/api.notes.list", "parentId": "root", "path": "api/notes/list", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.notes.list-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/notes._index": { "id": "routes/notes._index", "parentId": "root", "path": "notes", "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/notes._index-veNG-jtY.js", "imports": ["/assets/jsx-runtime-DlxonYWr.js", "/assets/button-D4isoa3P.js", "/assets/card-D-X7nE0R.js", "/assets/skeleton-DKL58Lbh.js", "/assets/components-Czq65UFQ.js", "/assets/label-Aa_ZNhlt.js", "/assets/utils-bRKmu4jq.js"], "css": [] }, "routes/notes.$id": { "id": "routes/notes.$id", "parentId": "root", "path": "notes/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/notes._id-Bx1rRUX1.js", "imports": ["/assets/jsx-runtime-DlxonYWr.js", "/assets/skeleton-DKL58Lbh.js", "/assets/card-D-X7nE0R.js", "/assets/components-Czq65UFQ.js", "/assets/utils-bRKmu4jq.js"], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-Bl91d5Zw.js", "imports": ["/assets/jsx-runtime-DlxonYWr.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-BhN90fHB.js", "imports": ["/assets/jsx-runtime-DlxonYWr.js", "/assets/button-D4isoa3P.js", "/assets/card-D-X7nE0R.js", "/assets/label-Aa_ZNhlt.js", "/assets/components-Czq65UFQ.js", "/assets/utils-bRKmu4jq.js"], "css": [] } }, "url": "/assets/manifest-3314db56.js", "version": "3314db56" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.notes.list": {
    id: "routes/api.notes.list",
    parentId: "root",
    path: "api/notes/list",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/notes._index": {
    id: "routes/notes._index",
    parentId: "root",
    path: "notes",
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/notes.$id": {
    id: "routes/notes.$id",
    parentId: "root",
    path: "notes/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
