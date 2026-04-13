import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "A personal blog built with Next.js and Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="text-xl font-bold">My Blog</a>
            <div className="flex items-center gap-4">
              <a href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                Login
              </a>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          Built with Next.js + Supabase
        </footer>
      </body>
    </html>
  );
}
