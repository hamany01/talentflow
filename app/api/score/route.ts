
import { NextRequest, NextResponse } from 'next/server';
import { scoreResume } from '@/lib/ai/score';

export async function POST(req: NextRequest) {
  const { resumeText, jobRequirements } = await req.json();

  const must: string[] = [];
  const nice: string[] = [];
  const degreeHints: string[] = [];

  if (typeof jobRequirements === 'string') {
    const parts = jobRequirements.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    parts.forEach((p, idx) => {
      if (idx < 5) must.push(p);
      else nice.push(p);
    });
  }

  const result = scoreResume(resumeText || '', { must, nice, degreeHints, minYears: 2 });
  return NextResponse.json(result);
}
