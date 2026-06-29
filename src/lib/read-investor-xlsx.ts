import path from "path"
import fs from "fs"

export type FirmRow = {
  id: string; sno: number; name: string; country: string; city: string; state: string
  domain: string; website: string; linkedin: string; twitter: string; phone: string
  emails: string[]; overview: string
}

export type TeamRow = {
  id: string; sno: number; investorName: string; teamMember: string
  designation: string; location: string; emails: string[]; linkedin: string; summary: string
}

function readJSON<T>(filename: string): T[] {
  const p = path.join(process.cwd(), "data", "json", filename)
  if (!fs.existsSync(p)) return []
  return JSON.parse(fs.readFileSync(p, "utf8")) as T[]
}

const cache: Record<string, unknown[]> = {}
function cached<T>(key: string, load: () => T[]): T[] {
  if (!cache[key]) cache[key] = load()
  return cache[key] as T[]
}

export const getEarlyStageVCFirms = () => cached<FirmRow>("vc-firms",  () => readJSON("vc-firms.json"))
export const getEarlyStageVCTeam  = () => cached<TeamRow>("vc-team",   () => readJSON("vc-team.json"))
export const getFamilyOfficeFirms = () => cached<FirmRow>("fo-firms",  () => readJSON("fo-firms.json"))
export const getFamilyOfficeTeam  = () => cached<TeamRow>("fo-team",   () => readJSON("fo-team.json"))
export const getIncubatorFirms    = () => cached<FirmRow>("inc-firms", () => readJSON("inc-firms.json"))
export const getIncubatorTeam     = () => cached<TeamRow>("inc-team",  () => readJSON("inc-team.json"))
