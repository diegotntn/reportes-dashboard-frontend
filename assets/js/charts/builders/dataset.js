/* ======================================================
   dataset.js
   Builder de datasets para Chart.js (retrocompatible)
====================================================== */

import { resolveKpi } from '../helpers/kpi.js';

export function buildDataset(serie, cfg, density, payload) {
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
