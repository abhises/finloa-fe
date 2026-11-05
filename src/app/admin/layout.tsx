import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = { title: "Finloa admin", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return children;
}
