import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Providers } from "@/components/Providers";
import CommandPalette from "@/components/CommandPalette";
import SearchTrigger from "@/components/SearchTrigger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Magnum Documentation",
  description: "Comprehensive documentation for building advanced systems across multiple languages.",
};

const languages = [
  { name: "Node.js", href: "/", active: true },
  { name: "Python", href: "#" },
  { name: "Go", href: "#" },
  { name: "Rust", href: "#" },
  { name: "TypeScript", href: "#" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="h-screen overflow-hidden flex flex-col">
        <Providers>
          {/* Top Navbar */}
          <header className="h-14 shrink-0 border-b border-border bg-background z-50">
          <div className="max-w-[1400px] w-full mx-auto flex items-center h-full px-4 sm:px-6">
            {/* Brand — shifted right on mobile for hamburger space */}
            <div className="flex items-center ml-10 lg:ml-0 shrink-0">
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-wide text-foreground uppercase">
                Magnm
              </span>
              <span className="text-text-muted text-[12px] sm:text-[13px] ml-1.5 sm:ml-2 font-light tracking-wider hidden sm:inline">
                Documentation
              </span>
            </div>

            {/* Language Tabs — hidden on mobile */}
            <nav className="ml-3 sm:ml-12 hidden md:flex items-center h-full space-x-1 overflow-x-auto no-scrollbar">
              {languages.map((lang) => (
                <a
                  key={lang.name}
                  href={lang.href}
                  className={`px-3 sm:px-4 py-1 text-[12px] sm:text-[13px] font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                    lang.active
                      ? "bg-primary/15 text-primary-dark"
                      : "text-text-muted hover:text-foreground hover:bg-black/[0.03]"
                  }`}
                >
                  {lang.name}
                </a>
              ))}
            </nav>

            {/* Search trigger — visible everywhere now */}
            <div className="ml-auto flex items-center shrink-0 max-w-[50%] sm:max-w-none">
              <SearchTrigger />
            </div>
          </div>
          </header>

          <CommandPalette />
          <ResponsiveLayout
            leftSidebar={<LeftSidebar />}
            rightSidebar={<RightSidebar />}
          >
            {children}
          </ResponsiveLayout>
        </Providers>
      </body>
    </html>
  );
}
