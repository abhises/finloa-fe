"use client";

import { useEffect, useState } from "react";
import { adminApi, when } from "@/lib/admin-client";

type Subscriber = { id: string; email: string; source: string; createdAt: string };

export default function SubscribersPage() {
  const [subs, setSubs] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<{ data: Subscriber[] }>("/subscribers")
      .then((r) => setSubs(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);

  function exportCsv() {
    if (!subs) return;
    const csv = ["email,source,subscribed", ...subs.map((s) => `${s.email},${s.source},${s.createdAt}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "finloa-subscribers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Subscribers</h1>
          <p>Newsletter sign-ups from the blog.</p>
        </div>
        <button type="button" className="ad-btn" onClick={exportCsv} disabled={!subs?.length}>
          Export CSV
        </button>
      </div>
      {error && <p className="ad-error">{error}</p>}
      {!subs ? (
        <p className="ad-hint">Loading…</p>
      ) : subs.length === 0 ? (
        <p className="ad-hint">No subscribers yet.</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Source</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{s.source}</td>
                  <td className="ad-hint">{when(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
