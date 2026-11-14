#!/usr/bin/env node
/**
 * Builds src/i18n/texts.json: every translatable text on the public site, so the admin "Pages" screen can edit it.
 *
 * It collects
 *   - t("English", "Nederlands") calls with two plain string arguments, and
 *   - the [en, nl] title/description pairs passed to pageMetadata(),
 * from src/app/[lang] and src/components (not the admin). Texts built from variables (t(`${x} …`)) can't be edited.
 *
 * Runs automatically before `npm run dev` and `npm run build`; run it by hand with `npm run texts`.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "src");
const OUT = path.join(SRC, "i18n", "texts.json");

// Same hash as textKey() in src/i18n/config.ts
function textKey(en, nl) {
  const str = `${en}\u0000${nl}`;
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "admin" ? [] : walk(full);
    return /\.tsx?$/.test(e.name) ? [full] : [];
  });
}

const isStr = (n) => n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n));

/** Component files this file imports ("@/components/x" or "./x"), as absolute paths without extension. */
function componentImports(file, src) {
  const out = [];
  for (const st of src.statements) {
    if (!ts.isImportDeclaration(st) || st.importClause?.isTypeOnly) continue;
    const spec = st.moduleSpecifier.text;
    if (spec.startsWith("@/components/")) out.push(path.join(SRC, "components", spec.slice(13)));
    else if (spec.startsWith("./") && file.startsWith(path.join(SRC, "components"))) out.push(path.join(path.dirname(file), spec));
  }
  return out;
}
const importsOf = {};

function extract(file) {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  importsOf[file.replace(/\.tsx?$/, "")] = componentImports(file, src);
  const found = [];
  // `seo`: the text is the page's <title> or meta description (browser tab / Google), not text on the page itself
  const add = (en, nl, seo) => found.push({ key: textKey(en, nl), en, nl, ...(seo && { seo }) });
  /** "title" / "description" when a t() call sits in `title: t(…)` / `description: t(…)` inside generateMetadata */
  const metaProp = (node, inMeta) => {
    if (!inMeta || !ts.isPropertyAssignment(node.parent) || !ts.isIdentifier(node.parent.name)) return undefined;
    const p = node.parent.name.text;
    return p === "title" || p === "description" ? p : undefined;
  };
  const visit = (node, inMeta = false) => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === "generateMetadata") inMeta = true;
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      const args = node.arguments;
      if (name === "t" && args.length === 2 && isStr(args[0]) && isStr(args[1])) add(args[0].text, args[1].text, metaProp(node, inMeta));
      if (name === "pageMetadata")
        args.forEach((a, i) => {
          if (ts.isArrayLiteralExpression(a) && a.elements.length === 2 && isStr(a.elements[0]) && isStr(a.elements[1]))
            add(a.elements[0].text, a.elements[1].text, i === 1 ? "title" : "description");
        });
    }
    ts.forEachChild(node, (n) => visit(n, inMeta));
  };
  visit(src);
  // keep the first occurrence of each text, in source order
  const seen = new Set();
  return found.filter((t) => !seen.has(t.key) && seen.add(t.key));
}

/** "src/app/[lang]/seo/page.tsx" → { label: "SEO", path: "/seo" } */
const PAGE_LABELS = {
  "": "Home",
  "ai-marketing": "AI Marketing",
  blog: "Blog",
  "blog/[slug]": "Blog post template",
  careers: "Careers",
  "content-marketing": "Content Marketing",
  "for-creators": "For Creators",
  "idea-to-product": "Idea to Product",
  netherlands: "Netherlands",
  "paid-media": "Paid Media",
  privacy: "Privacy",
  seo: "SEO",
  services: "Services",
  terms: "Terms & Conditions",
  videos: "Video Creation",
  "website-design": "Website Design",
  "why-finloa": "Why Finloa",
};
const titleCase = (s) => s.replace(/(^|-)(\w)/g, (_, d, c) => (d ? " " : "") + c.toUpperCase());

function describe(file) {
  const rel = path.relative(SRC, file).split(path.sep).join("/");
  const page = rel.match(/^app\/\[lang\]\/(?:(.*)\/)?(page|layout)\.tsx$/);
  if (page) {
    const route = page[1] ?? "";
    if (page[2] === "layout") return { id: "layout", group: "shared", label: "Site-wide (default title & description)", path: "/", file: rel };
    const label = PAGE_LABELS[route] ?? titleCase(route.split("/").pop() ?? route);
    return { id: route || "home", group: "page", label, path: route.includes("[") ? null : `/${route}`, file: rel };
  }
  const name = path.basename(rel).replace(/\.tsx?$/, "");
  return { id: `component:${name}`, group: "shared", label: titleCase(name), path: null, file: rel };
}

const sections = [];
const idOf = {};
for (const file of walk(path.join(SRC, "app", "[lang]")).concat(walk(path.join(SRC, "components")))) {
  const texts = extract(file);
  const info = describe(file);
  idOf[file.replace(/\.tsx?$/, "")] = info.id;
  if (texts.length) sections.push({ ...info, texts });
}
// Shared components each page shows (followed through imports), so the admin can list them with the page
const withTexts = new Set(sections.map((s) => s.id));
function includes(base, seen = new Set()) {
  for (const dep of importsOf[base] ?? []) {
    if (seen.has(dep)) continue;
    seen.add(dep);
    includes(dep, seen);
  }
  return seen;
}
for (const s of sections) {
  if (s.group !== "page") continue;
  const base = path.join(SRC, s.file).replace(/\.tsx?$/, "");
  s.includes = [...includes(base)].map((d) => idOf[d]).filter((id) => id && withTexts.has(id) && id !== s.id).sort();
}
sections.sort((a, b) =>
  a.group !== b.group ? (a.group === "page" ? -1 : 1) : a.id === "home" ? -1 : b.id === "home" ? 1 : a.label.localeCompare(b.label),
);

// Which sections use each text (an edit changes it everywhere)
const usedIn = {};
for (const s of sections) for (const t of s.texts) (usedIn[t.key] ??= []).push(s.id);

const json = JSON.stringify({ sections, usedIn }, null, 1) + "\n";
let old = "";
try {
  old = readFileSync(OUT, "utf8");
} catch {}
if (old !== json) writeFileSync(OUT, json);
const total = Object.keys(usedIn).length;
console.log(`[texts] ${total} editable texts in ${sections.length} pages/components → src/i18n/texts.json`);
