/* ======================================================
   tooltip.js
   Tooltip base reutilizable para Chart.js
====================================================== */

export const BASE_TOOLTIP = {
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
};
