/* ======================================================
   bar.js
   Renderer de gráfica de barras
====================================================== */

import { BASE_OPTIONS } from '../config/baseOptions.js';
import { destroyIfExists } from '../helpers/destroy.js';

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
    options: {
      ...BASE_OPTIONS,
      ...options
    }
  });
}
