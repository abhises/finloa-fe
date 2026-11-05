"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { adminApi, when } from "@/lib/admin-client";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;
type Status = (typeof STATUSES)[number];

type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  website: string | null;
  videosPerMonth: string | null;
  platforms: string[];
  message: string | null;
  status: Status;
  source: string;
  plan: { slug: string; name: string } | null;
  createdAt: string;
};

const PAGE_SIZE = 25;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Status | "">("");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE), ...(status && { status }) });
    adminApi<{ data: Lead[]; meta: { total: number } }>(`/leads?${qs}`)
      .then((r) => {
        setLeads(r.data);
        setTotal(r.meta.total);
      })
      .catch((e: Error) => setError(e.message));
  }, [page, status]);
  useEffect(load, [load]);

  async function setLeadStatus(l: Lead, s: Status) {
    try {
      await adminApi(`/leads/${l.id}`, { method: "PATCH", json: { status: s } });
      setLeads((all) => all?.map((x) => (x.id === l.id ? { ...x, status: s } : x)) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Leads</h1>
          <p>Enquiries from the contact forms across the site.</p>
        </div>
      </div>
      {error && <p className="ad-error">{error}</p>}
      <div className="ad-filters">
        <div className="ad-seg">
          {(["", ...STATUSES] as const).map((s) => (
            <button
              key={s || "all"}
              type="button"
              aria-pressed={status === s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
            >
              {s ? s[0] + s.slice(1).toLowerCase() : "All"}
            </button>
          ))}
        </div>
        <span className="ad-hint">{total} total</span>
      </div>

      {!leads ? (
        <p className="ad-hint">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="ad-hint">No leads here.</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="ad-hide-sm">Page</th>
                <th className="ad-hide-sm">Received</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <Fragment key={l.id}>
                  <tr>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {l.firstName} {l.lastName}
                      </div>
                      <a href={`mailto:${l.email}`} className="ad-hint">
                        {l.email}
                      </a>
                    </td>
                    <td className="ad-hide-sm">{l.source}</td>
                    <td className="ad-hide-sm ad-hint">{when(l.createdAt)}</td>
                    <td>
                      <select className="ad-input" style={{ width: "auto", padding: "5px 8px" }} value={l.status} onChange={(e) => setLeadStatus(l, e.target.value as Status)} aria-label="Status">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s[0] + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="ad-actions">
                        <button type="button" className="ad-btn ad-btn--sm" onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id}>
                          {open === l.id ? "Close" : "Details"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {open === l.id && (
                    <tr>
                      <td colSpan={5} style={{ background: "#fafbfd" }}>
                        <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "6px 12px", margin: 0 }}>
                          {[
                            ["Company", l.company],
                            ["Website", l.website],
                            ["Plan", l.plan?.name],
                            ["Videos / month", l.videosPerMonth],
                            ["Platforms", l.platforms.join(", ")],
                            ["Message", l.message],
                          ]
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <Fragment key={k}>
                                <dt className="ad-hint">
                                  {k}
                                </dt>
                                <dd style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                                  {v}
                                </dd>
                              </Fragment>
                            ))}
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <div className="ad-filters" style={{ marginTop: 14 }}>
          <button type="button" className="ad-btn ad-btn--sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Newer
          </button>
          <span className="ad-hint">
            Page {page} of {pages}
          </span>
          <button type="button" className="ad-btn ad-btn--sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Older →
          </button>
        </div>
      )}
    </>
  );
}
