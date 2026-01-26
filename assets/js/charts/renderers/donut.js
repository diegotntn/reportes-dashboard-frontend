/* ======================================================
   donut.js
   Renderer de gráfica Donut / Pie
====================================================== */

import { BASE_TOOLTIP } from '../plugins/tooltip.js';
import { destroyIfExists } from '../helpers/destroy.js';

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
