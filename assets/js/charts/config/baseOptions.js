/* ======================================================
   baseOptions.js
   Configuración base compartida para Chart.js
====================================================== */

export const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.5,

  interaction: {
    mode: 'index',
    intersect: false
  },

  animation: { duration: 300 },

  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 16,
        color: '#374151',
        font: { size: 12, weight: '500' }
      }
    },

    tooltip: {
      enabled: true,
      backgroundColor: '#111827',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      padding: 10,
      borderWidth: 1,
      borderColor: '#374151',
      displayColors: false,

      callbacks: {
        title(items) {
          const x = items?.[0]?.raw?.x;
          if (!x) return '';
          return new Date(x).toLocaleDateString('es-MX');
        },

        label(ctx) {
          const p = ctx.raw;
          if (!p?.kpis) return '';

          const kpi =
            ctx.dataset?.kpi ??
            ctx.chart?.config?._config?.kpi ??
            'importe';

          const valor =
            p.kpis?.[kpi] ??
            p.kpis?.importe ??
            0;

          return `Total: ${Number(valor).toLocaleString('es-MX')}`;
        }
      }
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb', drawBorder: false },
      ticks: { color: '#6b7280', maxTicksLimit: 6 }
    },

    x: {
      grid: { display: false },
      ticks: { color: '#6b7280', autoSkip: true }
    }
  }
};
