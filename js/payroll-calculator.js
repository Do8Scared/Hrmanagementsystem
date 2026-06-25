document.addEventListener('DOMContentLoaded', () => {
  // Input fields
  const empNameInput = document.getElementById('emp-name');
  const payPeriodInput = document.getElementById('pay-period');
  const basicSalaryInput = document.getElementById('basic-salary');
  const overtimePayInput = document.getElementById('overtime-pay');
  const allowancesInput = document.getElementById('allowances');
  const absencesInput = document.getElementById('absences');

  // Output fields
  const outName = document.getElementById('out-name');
  const outPeriod = document.getElementById('out-period');
  const outGross = document.getElementById('out-gross');
  const outSss = document.getElementById('out-sss');
  const outPhilhealth = document.getElementById('out-philhealth');
  const outPagibig = document.getElementById('out-pagibig');
  const outTax = document.getElementById('out-tax');
  const outTotalDeductions = document.getElementById('out-total-deductions');
  const outNetPay = document.getElementById('out-net-pay');

  // Format currency helper
  function formatCurrency(value) {
    return '₱ ' + value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Calculation function
  function calculatePayroll() {
    // Get text values
    const name = empNameInput.value.trim() || 'Juan dela Cruz';
    const period = payPeriodInput.value.trim() || 'June 1-30, 2026';

    // Get numeric values
    const basic = parseFloat(basicSalaryInput.value) || 0;
    const overtime = parseFloat(overtimePayInput.value) || 0;
    const allowances = parseFloat(allowancesInput.value) || 0;
    const absences = parseFloat(absencesInput.value) || 0;

    // Gross Pay
    const grossPay = basic + overtime + allowances - absences;

    // Statutory Deductions
    const sss = basic * 0.045;
    const philhealth = basic * 0.025;
    const pagibig = 200.00;

    // Taxable Income
    let taxableIncome = (basic + overtime) - (sss + philhealth + pagibig + absences);
    if (taxableIncome < 0) taxableIncome = 0;

    // Withholding Tax
    let withholdingTax = taxableIncome * 0.15;
    if (withholdingTax < 0) withholdingTax = 0;

    // Total Deductions
    const totalDeductions = sss + philhealth + pagibig + withholdingTax;

    // Net Pay
    let netPay = grossPay - totalDeductions;
    if (netPay < 0) netPay = 0;

    // Update Output DOM
    outName.textContent = name;
    outPeriod.textContent = period;
    
    outGross.textContent = formatCurrency(grossPay);
    outSss.textContent = formatCurrency(sss);
    outPhilhealth.textContent = formatCurrency(philhealth);
    outPagibig.textContent = formatCurrency(pagibig);
    outTax.textContent = formatCurrency(withholdingTax);
    outTotalDeductions.textContent = formatCurrency(totalDeductions);
    outNetPay.textContent = formatCurrency(netPay);
  }

  // Attach event listeners to all inputs
  const allInputs = [empNameInput, payPeriodInput, basicSalaryInput, overtimePayInput, allowancesInput, absencesInput];
  allInputs.forEach(input => {
    input.addEventListener('input', calculatePayroll);
  });

  // Initial calculation
  calculatePayroll();
});
