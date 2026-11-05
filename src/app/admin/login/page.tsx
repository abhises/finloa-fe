import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="lg">
      <aside className="lg-brand" aria-hidden="true">
        <div className="lg-brand__copy">
          <span className="lg-brand__logo">FINLOA</span>
          <p className="lg-brand__kicker">ADMIN</p>
          <p className="lg-brand__title">We grow brands and audiences.</p>
          <p className="lg-brand__text">Publish blog posts, add YouTube videos and follow up on leads, all in one place.</p>
        </div>
        <span className="lg-brand__mark">F</span>
      </aside>

      <main className="lg-main">
        <div className="lg-card">
          <span className="lg-card__logo">FINLOA</span>
          <div>
            <h1 className="lg-card__title">Welcome back</h1>
            <p className="lg-card__sub">Sign in to the Finloa admin.</p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
          <Link href="/" className="lg-home">
            ← Back to finloa.com
          </Link>
        </div>
        <p className="lg-foot">© 2026 Finloa</p>
      </main>
    </div>
  );
}
