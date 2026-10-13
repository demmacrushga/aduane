import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aduane — What should I eat today?",
  description: "A daily Ghanaian meal plan that fits your budget and goals.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#0f7a3d" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
