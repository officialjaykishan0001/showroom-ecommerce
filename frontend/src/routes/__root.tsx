import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 — Lost in the showroom</p>
        <h1 className="mt-4 text-5xl text-charcoal">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has been moved or no longer exists.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">Return home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl text-charcoal">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Decor Den — Luxury Sofa Showroom" },
      { name: "description", content: "Handcrafted luxury sofas, sectionals and recliners. Premium materials, timeless silhouettes, delivered nationwide." },
      { name: "author", content: "Maison Vellora" },
      { property: "og:title", content: "Decor Den — Luxury Sofa Showroom" },
      { property: "og:description", content: "Handcrafted luxury sofas, sectionals and recliners. Premium materials, timeless silhouettes, delivered nationwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Decor Den — Luxury Sofa Showroom" },
      { name: "twitter:description", content: "Handcrafted luxury sofas, sectionals and recliners. Premium materials, timeless silhouettes, delivered nationwide." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/pMfZV7a5UqbrNc49VBphuVYedxI3/social-images/social-1783419342360-decorden-logo.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/pMfZV7a5UqbrNc49VBphuVYedxI3/social-images/social-1783419342360-decorden-logo.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const hideLayout = [
    "/login",
    "/signup",
    "/admin/dashboard",
    "/admin/customers",
    "/admin/settings",
    "/admin/orders",
  ].includes(pathname);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          {!hideLayout && <Navbar />}

          <main>
            <Outlet />
          </main>

          {!hideLayout && <Footer />}
        </div>
      </QueryClientProvider>
    </GoogleOAuthProvider>

  );
}
