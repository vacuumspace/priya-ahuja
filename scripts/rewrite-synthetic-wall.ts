/**
 * Rewrites the text of synthetic wall entries that haven't surfaced yet
 * (scheduledAt still in the future) with a fresh pick from WIN_TEMPLATES in
 * each persona's voice. Already-visible posts and real user entries are
 * never touched.
 *
 * Run with: npx tsx scripts/rewrite-synthetic-wall.ts
 */

import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"
import { resolve } from "path"
import { PERSONAS, WIN_TEMPLATES, applyVoice } from "./synthetic-wall-lines"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < n && copy.length > 0; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

async function rewrite() {
  const voices = new Map(PERSONAS.map((p) => [p.name, p.voice]))
  const rows = (await sql`
    select e.id, u.name from daily_win_entries e
    join users u on u.id = e.user_id
    where u.email like '%@dailywins.seed' and e.scheduled_at > now()
  `) as { id: string; name: string }[]
  console.log(`Rewriting ${rows.length} upcoming synthetic entries...`)

  const ids: string[] = []
  const texts: string[] = []
  for (const r of rows) {
    const voice = voices.get(r.name) ?? "plain"
    ids.push(r.id)
    // A nested text[][] can't go through unnest, so join with a separator
    // that never appears in the templates and split back in SQL.
    texts.push(pick(WIN_TEMPLATES, Math.random() < 0.35 ? 2 : 1).map((l) => applyVoice(l, voice)).join("\u0001"))
  }

  for (let i = 0; i < ids.length; i += 500) {
    await sql`
      update daily_win_entries e
      set points = string_to_array(v.t, chr(1)), updated_at = now()
      from unnest(${ids.slice(i, i + 500)}::uuid[], ${texts.slice(i, i + 500)}::text[]) as v(id, t)
      where e.id = v.id and e.scheduled_at > now()
    `
  }
  console.log("Done.")
}

rewrite().catch((err) => { console.error(err); process.exit(1) })
