/* ======================================================
   engine.js
   Motor gráfico genérico para dashboards
   Chart.js 4.x
====================================================== */

import { renderLineChart } from './renderers/line.js';
import { renderBarChart } from './renderers/bar.js';
import { renderDonutChart } from './renderers/donut.js';

/* ======================================================
   RESET ZOOM
====================================================== */

export function resetZoom(canvas) {
  const chart = Chart.getChart(canvas);
  if (chart?.resetZoom) chart.resetZoom();
}

/* ======================================================
   EXPORTS (API PÚBLICA)
====================================================== */

export {
  renderLineChart,
  renderBarChart,
  renderDonutChart
};
