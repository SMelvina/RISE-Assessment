import { ParticipantSubmission } from '../data/adminSubmissions';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

/**
 * Save a new submission to Supabase in the cloud
 */
export async function syncSubmissionToSupabase(submission: ParticipantSubmission): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(submission),
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase sync warning:', err);
    return false;
  }
}

/**
 * Fetch all cloud submissions from Supabase
 */
export async function fetchSubmissionsFromSupabase(): Promise<ParticipantSubmission[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/submissions?select=*&order=completedAt.desc`,
      {
        method: 'GET',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as ParticipantSubmission[]) : [];
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return [];
  }
}

