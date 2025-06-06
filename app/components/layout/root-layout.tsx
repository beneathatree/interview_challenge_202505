import { Link, NavLink, useLocation, Form } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface RootLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export function RootLayout({ children, isAuthenticated }: RootLayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  if (isAuthPage || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b w-full fixed bg-gray-200">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:text-primary"
          >
            Notes App
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              Notes
            </NavLink>
            <Form action="/logout" method="post">
              <Button variant="ghost" type="submit">
                Logout
              </Button>
            </Form>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>

      <footer className="border-t py-6 px-4">
        <div className="container flex flex-col md:flex-row space-y-2 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Notes App. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
