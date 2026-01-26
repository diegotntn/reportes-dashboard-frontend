/* ======================================================
   data/normalizer.js
   Normalización de series por periodo
====================================================== */

import {
  extraerFechaISO,
  isoWeekYear,
  isoWeekNumber
} from '../utils/pasillosFechas.js';

/* ======================================================
   NORMALIZACIÓN DE SERIES
====================================================== */
export function normalizarSerieContra(labelsKey, series, kpi, agrupar) {
  const map = new Map();

  for (const punto of series || []) {
    const key = normalizarClaveSegunAgrupar(punto.fecha, agrupar);
    if (!key) continue;

    const valor = Number(punto[kpi]);
    map.set(
      key,
      (map.get(key) ?? 0) + (Number.isFinite(valor) ? valor : 0)
    );
  }

  return labelsKey.map(k => map.get(k) ?? 0);
}

/* ======================================================
   NORMALIZACIÓN DE CLAVES (INTERNA)
====================================================== */
function normalizarClaveSegunAgrupar(fecha, agrupar) {
  const iso = extraerFechaISO(fecha);
  if (!iso) return null;

  if (agrupar === 'Dia') return iso;

  if (agrupar === 'Mes') return iso.slice(0, 7);

  const d = keyDiaToDate(iso);
  return `${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2, '0')}`;
}

/* ======================================================
   HELPERS MÍNIMOS (LOCALES)
====================================================== */
function keyDiaToDate(k) {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}
