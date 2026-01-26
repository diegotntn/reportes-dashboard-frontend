/* ======================================================
   line.js
   Renderer de gráfica de línea (una o varias series)
====================================================== */

import { BASE_OPTIONS } from '../config/baseOptions.js';
import { BASE_SCALES } from '../config/scales.js';
import { BASE_TOOLTIP } from '../plugins/tooltip.js';
import { destroyIfExists } from '../helpers/destroy.js';
import { adaptDensity } from '../helpers/density.js';
import { buildDataset } from '../builders/dataset.js';

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
