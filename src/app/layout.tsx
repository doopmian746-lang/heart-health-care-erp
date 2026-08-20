import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heart Health Care Foundation — ERP",
  description: "Every Heart Matters. Every Life Matters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
