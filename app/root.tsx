import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useEffect } from "react";
import "./tailwind.css";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthKitProvider
          devMode={false}
          clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
        >
          <RequireAuth>{children}</RequireAuth>
        </AuthKitProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export type AuthProps = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: AuthProps) {
  const { user, isLoading, signIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      signIn({
        state: { returnTo: location },
      });
    }
  }, [isLoading, signIn, user, location]);

  if (isLoading || !user) {
    return <>...Loading</>;
  }

  return children;
}
