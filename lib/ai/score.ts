
export type JobRequirement = {
  must?: string[];
  nice?: string[];
  minYears?: number;
  degreeHints?: string[];
};

export function simpleNormalize(t: string): string {
  return (t || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
}

export function keywordCount(text: string, kw: string): number {
  const reg = new RegExp(`(^|\s)${kw.toLowerCase()}(\s|$)`, 'g');
  return (text.toLowerCase().match(reg) || []).length;
}

export function scoreResume(resumeText: string, req: JobRequirement) {
  const text = simpleNormalize(resumeText);

  let score = 0;
  const reasons: string[] = [];

  const must = req.must || [];
  let missingMust = 0;
  for (const m of must) {
    const c = keywordCount(text, m);
    if (c > 0) { score += 10; reasons.push(`Contains required: ${m}`); }
    else { missingMust++; reasons.push(`Missing required: ${m}`); }
  }
  if (missingMust > 0) score -= missingMust * 10;

  const nice = req.nice || [];
  let niceHits = 0;
  for (const n of nice) {
    const c = keywordCount(text, n);
    if (c > 0) { score += 2; niceHits += 1; }
  }
  if (niceHits > 0) reasons.push(`Preferred matches: ${niceHits}`);

  if (typeof req.minYears === 'number') {
    const m = text.match(/(\d+)\s*(year|years|yr|yrs|سنة|سنوات)/i);
    if (m) {
      const yrs = parseInt(m[1], 10);
      if (!isNaN(yrs)) {
        if (yrs >= req.minYears) { score += 15; reasons.push(`Experience >= ${req.minYears} yrs`); }
        else { score -= 5; reasons.push(`Experience < ${req.minYears} yrs`); }
      }
    }
  }

  const degs = req.degreeHints || [];
  for (const d of degs) {
    if (keywordCount(text, d) > 0) { score += 5; reasons.push(`Has degree/cert: ${d}`); }
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let label: 'Strong'|'Consider'|'Not a fit' = 'Consider';
  if (score >= 70) label = 'Strong';
  else if (score < 40) label = 'Not a fit';

  return { score, label, reasons: reasons.slice(0, 3) };
}
