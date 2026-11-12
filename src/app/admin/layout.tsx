import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = { title: "Finloa admin", robots: { index: false, follow: false } };

/** Admin has its own root layout (public pages live under app/[lang]). */
export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
