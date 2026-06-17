import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const s = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function describeAll() {
  const tables = [
    'employees', 'attendance_records', 'leave_requests', 'leave_balances',
    'payroll_records', 'performance_evaluations', 'announcements', 'acknowledgements',
    'job_postings', 'applicants', 'interviews', 'manpower_requests'
  ];

  for (const t of tables) {
    const { data, error } = await s.from(t).select('*').limit(1);
    if (error) {
      console.log(`\n--- ${t} --- ERROR: ${error.message}`);
      continue;
    }
    if (data && data.length > 0) {
      console.log(`\n--- ${t} ---`);
      for (const [key, val] of Object.entries(data[0])) {
        console.log(`  ${key}: ${typeof val} = ${JSON.stringify(val)}`);
      }
    } else {
      // Try to insert a minimal row and see what columns exist from the error
      console.log(`\n--- ${t} --- (empty, trying to discover schema)`);
      const { error: insertErr } = await s.from(t).insert({ __dummy__: 1 }).select().single();
      if (insertErr) {
        console.log(`  Schema hint: ${insertErr.message}`);
      }
    }
  }
}

describeAll();
