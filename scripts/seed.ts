import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {
  employees,
  attendanceRecords,
  payrollRecords,
  leaveRequests,
  leaveBalances,
  performanceEvaluations
} from '../src/app/data/mockData.js'; // Wait, mockData is .ts. I should use ts-node or similar.

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding employees...');
  const { error: empError } = await supabase.from('employees').upsert(
    employees.map(e => ({
      id: e.id,
      name: e.name,
      department: e.department,
      position: e.position,
      status: e.status,
      email: e.email,
      phone: e.phone,
      join_date: e.joinDate,
      initials: e.initials,
      address: e.address,
      emergency_contact: e.emergencyContact,
      salary: e.salary,
      gender: e.gender,
      birth_date: e.birthDate
    }))
  );
  if (empError) console.error('Employee error:', empError);

  console.log('Seeding attendance...');
  const { error: attError } = await supabase.from('attendance_records').upsert(
    attendanceRecords.map(a => ({
      id: a.id,
      employee_id: a.employeeId,
      date: a.date,
      time_in: a.timeIn,
      time_out: a.timeOut,
      total_hours: a.totalHours,
      status: a.status
    }))
  );
  if (attError) console.error('Attendance error:', attError);

  console.log('Seeding payroll...');
  const { error: payError } = await supabase.from('payroll_records').upsert(
    payrollRecords.map(p => ({
      id: p.id,
      employee_id: p.employeeId,
      employee_name: p.employeeName,
      department: p.department,
      period: p.period,
      basic_salary: p.basicSalary,
      overtime: p.overtime,
      gross_pay: p.grossPay,
      sss: p.sss,
      philhealth: p.philhealth,
      pagibig: p.pagibig,
      tax: p.tax,
      total_deductions: p.totalDeductions,
      net_pay: p.netPay,
      status: p.status
    }))
  );
  if (payError) console.error('Payroll error:', payError);

  console.log('Seeding leaves...');
  const { error: leaveError } = await supabase.from('leave_requests').upsert(
    leaveRequests.map(l => ({
      id: l.id,
      employee_id: l.employeeId,
      employee_name: l.employeeName,
      department: l.department,
      leave_type: l.leaveType,
      start_date: l.startDate,
      end_date: l.endDate,
      days: l.days,
      reason: l.reason,
      status: l.status,
      applied_date: l.appliedDate
    }))
  );
  if (leaveError) console.error('Leave error:', leaveError);

  console.log('Seeding leave balances...');
  const { error: balError } = await supabase.from('leave_balances').upsert(
    leaveBalances.map(l => ({
      employee_id: l.employeeId,
      vacation_leave: l.vacationLeave,
      vacation_used: l.vacationUsed,
      sick_leave: l.sickLeave,
      sick_used: l.sickUsed,
      emergency_leave: l.emergencyLeave,
      emergency_used: l.emergencyUsed
    }))
  );
  if (balError) console.error('Leave balance error:', balError);

  console.log('Seeding performance evaluations...');
  const { error: perfError } = await supabase.from('performance_evaluations').upsert(
    performanceEvaluations.map(p => ({
      id: p.id,
      employee_id: p.employeeId,
      employee_name: p.employeeName,
      department: p.department,
      period: p.period,
      attendance_rating: p.criteria.attendance,
      productivity_rating: p.criteria.productivity,
      teamwork_rating: p.criteria.teamwork,
      communication_rating: p.criteria.communication,
      initiative_rating: p.criteria.initiative,
      overall_rating: p.overallRating,
      evaluator: p.evaluator,
      date: p.date,
      comments: p.comments
    }))
  );
  if (perfError) console.error('Performance error:', perfError);

  console.log('Done!');
}

seed().catch(console.error);
