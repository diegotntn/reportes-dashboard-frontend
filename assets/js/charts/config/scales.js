/* ======================================================
   scales.js
   Escalas base reutilizables para Chart.js
====================================================== */

export const BASE_SCALES = {
  y: {
    beginAtZero: true,
    grid: {
      color: '#e5e7eb',
      drawBorder: false
    },
    ticks: {
      color: '#6b7280',
      maxTicksLimit: 6
    }
  },

  x: {
    grid: {
      display: false
    },
    ticks: {
      color: '#6b7280',
      autoSkip: true
    }
  }
};
