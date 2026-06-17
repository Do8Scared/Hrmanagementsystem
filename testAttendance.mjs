import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  // Test Attendance
  console.log("Fetching employees...");
  const { data: emp, error: empErr } = await supabase.from('employees').select('*').limit(1).single();
  if (empErr) {
    console.error("Emp error", empErr);
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toTimeString().slice(0, 5);
  
  console.log("Testing Time In...");
  const record = {
    employee_id: emp.id,
    date: today,
    time_in: timeStr,
    status: 'Present'
  };
  
  const { data: inData, error: inErr } = await supabase.from('attendance_records').insert(record).select().single();
  if (inErr) {
    console.error("Time In Error:", inErr);
  } else {
    console.log("Time In Success:", inData);
    
    console.log("Testing Time Out...");
    const { data: outData, error: outErr } = await supabase.from('attendance_records')
      .update({ time_out: '18:00' })
      .eq('id', inData.id)
      .select().single();
      
    if (outErr) {
      console.error("Time Out Error:", outErr);
    } else {
      console.log("Time Out Success:", outData);
    }
    
    // cleanup
    await supabase.from('attendance_records').delete().eq('id', inData.id);
  }
}
test();
