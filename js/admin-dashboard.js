document.addEventListener('DOMContentLoaded', () => {
  // --- Chart.js ---
  const canvas = document.getElementById('attendanceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Data from mockData.ts
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const presentData = [18, 19, 18, 20, 21, 20];
  const lateData = [3, 2, 4, 2, 1, 2];
  const absentData = [1, 1, 0, 0, 1, 0];
  const undertimeData = [0, 0, 0, 1, 0, 1];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Present',
          data: presentData,
          backgroundColor: '#10B981',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        },
        {
          label: 'Late',
          data: lateData,
          backgroundColor: '#F59E0B',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        },
        {
          label: 'Absent',
          data: absentData,
          backgroundColor: '#EF4444',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        },
        {
          label: 'Undertime',
          data: undertimeData,
          backgroundColor: '#F97316',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#FFFFFF',
          titleColor: '#2A1215',
          bodyColor: '#7A5C50',
          borderColor: '#E8D8C8',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false
          },
          ticks: {
            color: '#7A5C50',
            font: {
              family: "'Nunito', system-ui, sans-serif",
              size: 12
            }
          },
          border: {
            display: false
          }
        },
        y: {
          stacked: false,
          grid: {
            color: '#F0E6D8',
            tickLength: 0
          },
          ticks: {
            color: '#7A5C50',
            font: {
              family: "'Nunito', system-ui, sans-serif",
              size: 12
            }
          },
          border: {
            display: false,
            dash: [3, 3]
          }
        }
      }
    }
  });
});
