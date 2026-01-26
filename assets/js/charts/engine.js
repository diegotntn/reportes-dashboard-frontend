/* ======================================================
   engine.js
   Motor gráfico genérico para dashboards
   Chart.js 4.x
====================================================== */

import { BASE_OPTIONS } from './config/baseOptions.js';
import { BASE_SCALES } from './config/scales.js';
import { BASE_TOOLTIP } from './plugins/tooltip.js';
import { destroyIfExists } from './helpers/destroy.js';
import { adaptDensity } from './helpers/density.js';
import { resolveKpi } from './helpers/kpi.js';

/* ======================================================
   DATASET BUILDER (RETROCOMPATIBLE)
====================================================== */

function buildDataset(serie, cfg, density, payload) {
  return {
    label: cfg.label,
    borderColor: cfg.color,
    backgroundColor: cfg.bg,
    tension: 0.3,
    fill: cfg.fill ?? true,
    spanGaps: true,
    pointRadius: density.pointRadius,
    pointHoverRadius: density.pointRadius + 2,
    kpi: cfg.kpi ?? payload.kpi,

    data: serie.map(p => ({
      x: p.fecha,
      y: resolveKpi(p, cfg, payload),
      ...p
    }))
  };
}

/* ======================================================
   LINE CHART — UNA O VARIAS SERIES
====================================================== */

export function renderLineChart(canvas, payload, options = {}) {

  destroyIfExists(canvas);

  if (!payload?.series || payload.series.length === 0) return;

  const allPoints = payload.series.reduce(
    (a, s) => a + (s.serie?.length || 0),
    0
  );

  const density = adaptDensity(allPoints);

  const datasets = payload.series.map(s =>
    buildDataset(s.serie, s, density, payload)
  );

  const unit =
    payload.periodo === 'dia'    ? 'day'   :
    payload.periodo === 'semana' ? 'week'  :
    payload.periodo === 'mes'    ? 'month' :
    'year';

  return new Chart(canvas, {
    type: 'line',

    data: { datasets },

    options: {
      ...BASE_OPTIONS,
      ...options,

      plugins: {
        ...BASE_OPTIONS.plugins,
        tooltip: BASE_TOOLTIP,
        ...(options.plugins || {})
      },

      scales: {
        y: {
          ...BASE_SCALES.y,
          ...(options.scales?.y || {})
        },

        x: {
          ...BASE_SCALES.x,
          type: 'time',
          time: {
            unit,
            tooltipFormat: 'dd/MM/yyyy',
            displayFormats: {
              day: 'dd/MM',
              week: "'Sem' WW",
              month: 'MMM yyyy',
              year: 'yyyy'
            }
          },
          ticks: {
            ...BASE_SCALES.x.ticks,
            maxTicksLimit: density.maxTicksLimit,
            ...(options.scales?.x?.ticks || {})
          },
          ...(options.scales?.x || {})
        }
      }
    }
  });
}

/* ======================================================
   BAR CHART (SIN CAMBIOS)
====================================================== */

export function renderBarChart(canvas, general, options = {}) {

  destroyIfExists(canvas);
  if (!general?.serie) return;

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: general.serie.map(p => p.label),
      datasets: [{
        label: 'Importe',
        data: general.serie.map(p => p.kpis.importe),
        borderRadius: 6,
        maxBarThickness: 48,
        backgroundColor: '#2563eb'
      }]
    },
    options: { ...BASE_OPTIONS, ...options }
  });
}

/* ======================================================
   DONUT / PIE (SIN CAMBIOS)
====================================================== */

export function renderDonutChart(canvas, labels, data, options = {}) {

  destroyIfExists(canvas);

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        tooltip: BASE_TOOLTIP
      },
      ...options
    }
  });
}

/* ======================================================
   RESET ZOOM
====================================================== */

export function resetZoom(canvas) {
  const chart = Chart.getChart(canvas);
  if (chart?.resetZoom) chart.resetZoom();
}
