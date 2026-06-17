export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  email: string;
  phone: string;
  joinDate: string;
  initials: string;
  address: string;
  emergencyContact: string;
  salary: number;
  gender: string;
  birthDate: string;
}

export const employees: Employee[] = [
  { id: 'EMP001', name: 'Maria Santos', department: 'Operations', position: 'Operations Manager', status: 'Active', email: 'maria.santos@hrms.ph', phone: '+63 917 123 4567', joinDate: '2019-03-15', initials: 'MS', address: '123 Rizal St., Makati City', emergencyContact: 'Jose Santos — +63 917 999 0000', salary: 85000, gender: 'Female', birthDate: '1985-07-22' },
  { id: 'EMP002', name: 'Juan dela Cruz', department: 'Engineering', position: 'Software Engineer', status: 'Active', email: 'juan.delacruz@hrms.ph', phone: '+63 918 234 5678', joinDate: '2021-06-01', initials: 'JD', address: '456 Mabini Ave., Quezon City', emergencyContact: 'Rosa dela Cruz — +63 918 888 1111', salary: 75000, gender: 'Male', birthDate: '1993-11-05' },
  { id: 'EMP003', name: 'Ana Reyes', department: 'Marketing', position: 'Marketing Specialist', status: 'Active', email: 'ana.reyes@hrms.ph', phone: '+63 919 345 6789', joinDate: '2020-09-10', initials: 'AR', address: '789 Luna St., Pasig City', emergencyContact: 'Pedro Reyes — +63 919 777 2222', salary: 55000, gender: 'Female', birthDate: '1995-03-18' },
  { id: 'EMP004', name: 'Carlo Mendoza', department: 'Finance', position: 'Finance Analyst', status: 'On Leave', email: 'carlo.mendoza@hrms.ph', phone: '+63 920 456 7890', joinDate: '2022-01-20', initials: 'CM', address: '321 Aguinaldo Blvd., Manila', emergencyContact: 'Liza Mendoza — +63 920 666 3333', salary: 60000, gender: 'Male', birthDate: '1990-06-14' },
  { id: 'EMP005', name: 'Sofia Garcia', department: 'Human Resources', position: 'HR Specialist', status: 'Active', email: 'sofia.garcia@hrms.ph', phone: '+63 921 567 8901', joinDate: '2018-11-05', initials: 'SG', address: '654 Bonifacio St., Taguig City', emergencyContact: 'Marco Garcia — +63 921 555 4444', salary: 65000, gender: 'Female', birthDate: '1988-09-30' },
  { id: 'EMP006', name: 'Miguel Torres', department: 'Sales', position: 'Sales Representative', status: 'Active', email: 'miguel.torres@hrms.ph', phone: '+63 922 678 9012', joinDate: '2023-02-14', initials: 'MT', address: '987 Del Pilar St., Mandaluyong', emergencyContact: 'Carmen Torres — +63 922 444 5555', salary: 45000, gender: 'Male', birthDate: '1997-01-25' },
  { id: 'EMP007', name: 'Isabella Lim', department: 'Design', position: 'Product Designer', status: 'Active', email: 'isabella.lim@hrms.ph', phone: '+63 923 789 0123', joinDate: '2021-08-30', initials: 'IL', address: '147 Quezon Ave., Caloocan', emergencyContact: 'Victor Lim — +63 923 333 6666', salary: 70000, gender: 'Female', birthDate: '1992-04-12' },
  { id: 'EMP008', name: 'Rafael Cruz', department: 'Engineering', position: 'Backend Developer', status: 'Inactive', email: 'rafael.cruz@hrms.ph', phone: '+63 924 890 1234', joinDate: '2020-04-22', initials: 'RC', address: '258 Katipunan Ave., Quezon City', emergencyContact: 'Elena Cruz — +63 924 222 7777', salary: 72000, gender: 'Male', birthDate: '1991-12-08' },
  { id: 'EMP009', name: 'Camille Bautista', department: 'Finance', position: 'Accountant', status: 'Active', email: 'camille.bautista@hrms.ph', phone: '+63 925 901 2345', joinDate: '2019-07-08', initials: 'CB', address: '369 Shaw Blvd., Mandaluyong', emergencyContact: 'Tony Bautista — +63 925 111 8888', salary: 58000, gender: 'Female', birthDate: '1994-08-17' },
  { id: 'EMP010', name: 'Jerome Villanueva', department: 'Operations', position: 'Operations Coordinator', status: 'Active', email: 'jerome.villanueva@hrms.ph', phone: '+63 926 012 3456', joinDate: '2022-10-17', initials: 'JV', address: '741 Commonwealth Ave., Quezon City', emergencyContact: 'Grace Villanueva — +63 926 000 9999', salary: 52000, gender: 'Male', birthDate: '1996-02-28' },
];

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Undertime';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  totalHours: number | null;
  status: AttendanceStatus;
}

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'ATT001', employeeId: 'EMP002', date: '2026-06-01', timeIn: '08:02', timeOut: '17:05', totalHours: 9.05, status: 'Present' },
  { id: 'ATT002', employeeId: 'EMP002', date: '2026-06-02', timeIn: '08:15', timeOut: '17:00', totalHours: 8.75, status: 'Present' },
  { id: 'ATT003', employeeId: 'EMP002', date: '2026-06-03', timeIn: '09:32', timeOut: '17:00', totalHours: 7.47, status: 'Late' },
  { id: 'ATT004', employeeId: 'EMP002', date: '2026-06-04', timeIn: null, timeOut: null, totalHours: null, status: 'Absent' },
  { id: 'ATT005', employeeId: 'EMP002', date: '2026-06-05', timeIn: '08:00', timeOut: '17:00', totalHours: 9.0, status: 'Present' },
  { id: 'ATT006', employeeId: 'EMP002', date: '2026-06-08', timeIn: '08:05', timeOut: '15:30', totalHours: 7.42, status: 'Undertime' },
  { id: 'ATT007', employeeId: 'EMP002', date: '2026-06-09', timeIn: '08:01', timeOut: '17:02', totalHours: 9.02, status: 'Present' },
  { id: 'ATT008', employeeId: 'EMP002', date: '2026-06-10', timeIn: '08:00', timeOut: '17:00', totalHours: 9.0, status: 'Present' },
  { id: 'ATT009', employeeId: 'EMP002', date: '2026-06-11', timeIn: '09:15', timeOut: '17:00', totalHours: 7.75, status: 'Late' },
  { id: 'ATT010', employeeId: 'EMP002', date: '2026-06-12', timeIn: '08:03', timeOut: '17:01', totalHours: 8.97, status: 'Present' },
  { id: 'ATT011', employeeId: 'EMP002', date: '2026-06-15', timeIn: '08:00', timeOut: '17:00', totalHours: 9.0, status: 'Present' },
  { id: 'ATT012', employeeId: 'EMP002', date: '2026-06-16', timeIn: '08:07', timeOut: null, totalHours: null, status: 'Present' },
  // Other employees - June 2026
  { id: 'ATT013', employeeId: 'EMP001', date: '2026-06-16', timeIn: '07:55', timeOut: '17:00', totalHours: 9.08, status: 'Present' },
  { id: 'ATT014', employeeId: 'EMP003', date: '2026-06-16', timeIn: '08:10', timeOut: '17:00', totalHours: 8.83, status: 'Present' },
  { id: 'ATT015', employeeId: 'EMP005', date: '2026-06-16', timeIn: '08:00', timeOut: '17:00', totalHours: 9.0, status: 'Present' },
  { id: 'ATT016', employeeId: 'EMP006', date: '2026-06-16', timeIn: '09:45', timeOut: '17:00', totalHours: 7.25, status: 'Late' },
  { id: 'ATT017', employeeId: 'EMP007', date: '2026-06-16', timeIn: '08:02', timeOut: '17:01', totalHours: 8.98, status: 'Present' },
  { id: 'ATT018', employeeId: 'EMP009', date: '2026-06-16', timeIn: '08:00', timeOut: '17:00', totalHours: 9.0, status: 'Present' },
  { id: 'ATT019', employeeId: 'EMP010', date: '2026-06-16', timeIn: '08:00', timeOut: '17:00', totalHours: 9.0, status: 'Present' },
];

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  basicSalary: number;
  overtime: number;
  grossPay: number;
  sss: number;
  philhealth: number;
  pagibig: number;
  tax: number;
  totalDeductions: number;
  netPay: number;
  status: 'Processed' | 'Pending' | 'Paid';
}

export const payrollRecords: PayrollRecord[] = [
  { id: 'PAY001', employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Operations', period: 'June 2026', basicSalary: 85000, overtime: 3200, grossPay: 88200, sss: 900, philhealth: 1700, pagibig: 100, tax: 12500, totalDeductions: 15200, netPay: 73000, status: 'Pending' },
  { id: 'PAY002', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'June 2026', basicSalary: 75000, overtime: 1500, grossPay: 76500, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 64200, status: 'Pending' },
  { id: 'PAY003', employeeId: 'EMP003', employeeName: 'Ana Reyes', department: 'Marketing', period: 'June 2026', basicSalary: 55000, overtime: 800, grossPay: 55800, sss: 787.5, philhealth: 1100, pagibig: 100, tax: 5800, totalDeductions: 7787.5, netPay: 48012.5, status: 'Pending' },
  { id: 'PAY004', employeeId: 'EMP004', employeeName: 'Carlo Mendoza', department: 'Finance', period: 'June 2026', basicSalary: 60000, overtime: 0, grossPay: 60000, sss: 900, philhealth: 1200, pagibig: 100, tax: 6800, totalDeductions: 9000, netPay: 51000, status: 'Pending' },
  { id: 'PAY005', employeeId: 'EMP005', employeeName: 'Sofia Garcia', department: 'Human Resources', period: 'June 2026', basicSalary: 65000, overtime: 2000, grossPay: 67000, sss: 900, philhealth: 1300, pagibig: 100, tax: 7900, totalDeductions: 10200, netPay: 56800, status: 'Pending' },
  { id: 'PAY006', employeeId: 'EMP006', employeeName: 'Miguel Torres', department: 'Sales', period: 'June 2026', basicSalary: 45000, overtime: 2500, grossPay: 47500, sss: 787.5, philhealth: 900, pagibig: 100, tax: 3800, totalDeductions: 5587.5, netPay: 41912.5, status: 'Pending' },
  { id: 'PAY007', employeeId: 'EMP007', employeeName: 'Isabella Lim', department: 'Design', period: 'June 2026', basicSalary: 70000, overtime: 1000, grossPay: 71000, sss: 900, philhealth: 1400, pagibig: 100, tax: 8900, totalDeductions: 11300, netPay: 59700, status: 'Pending' },
  { id: 'PAY008', employeeId: 'EMP009', employeeName: 'Camille Bautista', department: 'Finance', period: 'June 2026', basicSalary: 58000, overtime: 0, grossPay: 58000, sss: 900, philhealth: 1160, pagibig: 100, tax: 6200, totalDeductions: 8360, netPay: 49640, status: 'Pending' },
  { id: 'PAY009', employeeId: 'EMP010', employeeName: 'Jerome Villanueva', department: 'Operations', period: 'June 2026', basicSalary: 52000, overtime: 1200, grossPay: 53200, sss: 787.5, philhealth: 1040, pagibig: 100, tax: 4800, totalDeductions: 6727.5, netPay: 46472.5, status: 'Pending' },
];

export const employeePayslips: PayrollRecord[] = [
  { id: 'PAY_EMP002_JUN', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'June 2026', basicSalary: 75000, overtime: 1500, grossPay: 76500, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 64200, status: 'Pending' },
  { id: 'PAY_EMP002_MAY', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'May 2026', basicSalary: 75000, overtime: 2500, grossPay: 77500, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 65200, status: 'Paid' },
  { id: 'PAY_EMP002_APR', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'April 2026', basicSalary: 75000, overtime: 0, grossPay: 75000, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 62700, status: 'Paid' },
  { id: 'PAY_EMP002_MAR', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'March 2026', basicSalary: 75000, overtime: 1800, grossPay: 76800, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 64500, status: 'Paid' },
  { id: 'PAY_EMP002_FEB', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'February 2026', basicSalary: 75000, overtime: 3000, grossPay: 78000, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 65700, status: 'Paid' },
  { id: 'PAY_EMP002_JAN', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'January 2026', basicSalary: 75000, overtime: 0, grossPay: 75000, sss: 900, philhealth: 1500, pagibig: 100, tax: 9800, totalDeductions: 12300, netPay: 62700, status: 'Paid' },
];

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Bereavement Leave';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
}

export const leaveRequests: LeaveRequest[] = [
  { id: 'LV001', employeeId: 'EMP004', employeeName: 'Carlo Mendoza', department: 'Finance', leaveType: 'Sick Leave', startDate: '2026-06-10', endDate: '2026-06-14', days: 5, reason: 'Medical procedure and recovery', status: 'Approved', appliedDate: '2026-06-08' },
  { id: 'LV002', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', leaveType: 'Vacation Leave', startDate: '2026-06-22', endDate: '2026-06-24', days: 3, reason: 'Family vacation in Palawan', status: 'Pending', appliedDate: '2026-06-14' },
  { id: 'LV003', employeeId: 'EMP003', employeeName: 'Ana Reyes', department: 'Marketing', leaveType: 'Emergency Leave', startDate: '2026-06-05', endDate: '2026-06-05', days: 1, reason: 'Family emergency requiring immediate attendance', status: 'Approved', appliedDate: '2026-06-05' },
  { id: 'LV004', employeeId: 'EMP007', employeeName: 'Isabella Lim', department: 'Design', leaveType: 'Vacation Leave', startDate: '2026-06-29', endDate: '2026-07-03', days: 5, reason: 'Pre-planned summer vacation', status: 'Pending', appliedDate: '2026-06-12' },
  { id: 'LV005', employeeId: 'EMP009', employeeName: 'Camille Bautista', department: 'Finance', leaveType: 'Sick Leave', startDate: '2026-06-03', endDate: '2026-06-03', days: 1, reason: 'Flu and fever, visited clinic', status: 'Approved', appliedDate: '2026-06-03' },
  { id: 'LV006', employeeId: 'EMP006', employeeName: 'Miguel Torres', department: 'Sales', leaveType: 'Vacation Leave', startDate: '2026-07-15', endDate: '2026-07-18', days: 4, reason: 'Rest and family bonding', status: 'Pending', appliedDate: '2026-06-16' },
  { id: 'LV007', employeeId: 'EMP010', employeeName: 'Jerome Villanueva', department: 'Operations', leaveType: 'Sick Leave', startDate: '2026-06-01', endDate: '2026-06-02', days: 2, reason: 'Flu symptoms', status: 'Rejected', appliedDate: '2026-06-01' },
];

export interface LeaveBalance {
  employeeId: string;
  vacationLeave: number;
  vacationUsed: number;
  sickLeave: number;
  sickUsed: number;
  emergencyLeave: number;
  emergencyUsed: number;
}

export const leaveBalances: LeaveBalance[] = [
  { employeeId: 'EMP001', vacationLeave: 15, vacationUsed: 3, sickLeave: 10, sickUsed: 1, emergencyLeave: 5, emergencyUsed: 0 },
  { employeeId: 'EMP002', vacationLeave: 15, vacationUsed: 5, sickLeave: 10, sickUsed: 2, emergencyLeave: 5, emergencyUsed: 1 },
  { employeeId: 'EMP003', vacationLeave: 15, vacationUsed: 7, sickLeave: 10, sickUsed: 3, emergencyLeave: 5, emergencyUsed: 1 },
  { employeeId: 'EMP004', vacationLeave: 15, vacationUsed: 2, sickLeave: 10, sickUsed: 7, emergencyLeave: 5, emergencyUsed: 0 },
  { employeeId: 'EMP005', vacationLeave: 15, vacationUsed: 4, sickLeave: 10, sickUsed: 0, emergencyLeave: 5, emergencyUsed: 2 },
];

export interface EvaluationCriteria {
  attendance: number;
  productivity: number;
  teamwork: number;
  communication: number;
  initiative: number;
}

export interface PerformanceEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  criteria: EvaluationCriteria;
  overallRating: number;
  evaluator: string;
  date: string;
  comments: string;
}

export const performanceEvaluations: PerformanceEvaluation[] = [
  { id: 'EVAL001', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'Q1 2026', criteria: { attendance: 4, productivity: 5, teamwork: 4, communication: 4, initiative: 5 }, overallRating: 4.4, evaluator: 'Maria Santos', date: '2026-04-05', comments: 'Excellent technical work. Shows strong initiative in proposing solutions and consistently delivers on time.' },
  { id: 'EVAL002', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'Q4 2025', criteria: { attendance: 3, productivity: 4, teamwork: 4, communication: 4, initiative: 4 }, overallRating: 3.8, evaluator: 'Maria Santos', date: '2026-01-10', comments: 'Good overall performance. Areas of improvement: punctuality and documentation.' },
  { id: 'EVAL003', employeeId: 'EMP003', employeeName: 'Ana Reyes', department: 'Marketing', period: 'Q1 2026', criteria: { attendance: 5, productivity: 4, teamwork: 5, communication: 5, initiative: 4 }, overallRating: 4.6, evaluator: 'Sofia Garcia', date: '2026-04-08', comments: 'Outstanding team player with excellent communication. Campaign results exceeded targets by 18%.' },
  { id: 'EVAL004', employeeId: 'EMP005', employeeName: 'Sofia Garcia', department: 'Human Resources', period: 'Q1 2026', criteria: { attendance: 5, productivity: 5, teamwork: 5, communication: 5, initiative: 4 }, overallRating: 4.8, evaluator: 'Maria Santos', date: '2026-04-10', comments: 'Exceptional HR performance. Streamlined onboarding processes and improved employee satisfaction scores.' },
  { id: 'EVAL005', employeeId: 'EMP007', employeeName: 'Isabella Lim', department: 'Design', period: 'Q1 2026', criteria: { attendance: 4, productivity: 5, teamwork: 4, communication: 4, initiative: 5 }, overallRating: 4.4, evaluator: 'Maria Santos', date: '2026-04-07', comments: 'Creative and innovative. Delivered redesigned product UI that increased user engagement by 23%.' },
  { id: 'EVAL006', employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Operations', period: 'Q1 2026', criteria: { attendance: 5, productivity: 5, teamwork: 5, communication: 5, initiative: 5 }, overallRating: 5.0, evaluator: 'Board of Directors', date: '2026-04-12', comments: 'Exemplary leadership. Successfully led the operations team through a major system migration with zero downtime.' },
];

export const monthlyAttendanceData = [
  { month: 'Jan', present: 182, late: 12, absent: 8, undertime: 5 },
  { month: 'Feb', present: 175, late: 15, absent: 10, undertime: 7 },
  { month: 'Mar', present: 190, late: 8, absent: 5, undertime: 4 },
  { month: 'Apr', present: 185, late: 11, absent: 7, undertime: 6 },
  { month: 'May', present: 188, late: 9, absent: 6, undertime: 5 },
  { month: 'Jun', present: 96, late: 8, absent: 4, undertime: 3 },
];

export const recentActivities = [
  { id: 1, action: 'New employee onboarded', subject: 'Miguel Torres', time: '2 hours ago', type: 'employee' },
  { id: 2, action: 'Leave request approved', subject: 'Carlo Mendoza', time: '4 hours ago', type: 'leave' },
  { id: 3, action: 'Payroll processed', subject: 'May 2026 — 9 employees', time: '1 day ago', type: 'payroll' },
  { id: 4, action: 'Performance evaluation submitted', subject: 'Ana Reyes — Q1 2026', time: '2 days ago', type: 'performance' },
  { id: 5, action: 'Leave request rejected', subject: 'Jerome Villanueva', time: '3 days ago', type: 'leave' },
  { id: 6, action: 'Employee profile updated', subject: 'Isabella Lim', time: '4 days ago', type: 'employee' },
];
