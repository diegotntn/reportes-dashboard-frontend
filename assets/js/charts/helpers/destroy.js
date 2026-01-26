/* ======================================================
   destroy.js
   Helper para destruir instancias previas de Chart.js
====================================================== */

export function destroyIfExists(canvas) {
  const chart = Chart.getChart(canvas);
  if (chart) chart.destroy();
}
