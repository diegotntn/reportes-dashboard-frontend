/* ======================================================
   normalizeSeries
   ======================================================
   - Normaliza una serie de datos contra un calendario maestro
   - NO conoce UI, charts ni estado global
   - Devuelve serie lista para graficar
====================================================== */

import { normalizarClave } from '../calendar/buildCalendar.js';

/* ─────────────────────────────
   API PRINCIPAL
───────────────────────────── */

/**
 * @param {Object} params
 * @param {Object} params.data          Datos de la persona (incluye serie)
 * @param {Object} params.calendario    Resultado de buildCalendar
 * @param {String} params.kpi           KPI a normalizar
 *
 * @returns {Array} serie normalizada
 */
export function normalizeSeries({ data, calendario, kpi }) {
  const { labelsKey, labelsDate, agrupar } = calendario;

  const acumulado = new Map();

  for (const punto of data.serie || []) {
    const key = normalizarClave(punto.periodo, agrupar);
    if (!key) continue;

    const val = Number(punto.kpis?.[kpi]);
    acumulado.set(
      key,
      (acumulado.get(key) ?? 0) + (Number.isFinite(val) ? val : 0)
    );
  }

  return labelsKey.map((key, i) => ({
    key,
    fecha: labelsDate[i],
    kpis: {
      [kpi]: acumulado.get(key) ?? 0
    }
  }));
}
