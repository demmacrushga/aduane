import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Aduane — What should I eat today?";
const description =
  "A free daily Ghanaian meal plan that fits your budget: waakye, kontomire, banku, kenkey and more, with prices in GH₵.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  icons: { icon: "/icon.svg" },
  openGraph: { title, description, type: "website", locale: "en_GH", siteName: "Aduane" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#0f7a3d" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
