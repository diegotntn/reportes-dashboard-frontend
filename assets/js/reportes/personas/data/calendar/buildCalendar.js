/* ======================================================
   buildCalendar
   ======================================================
   - Construye calendario maestro (día / semana / mes / año)
   - Devuelve:
     {
       agrupar,
       periodo,
       labelsKey,
       labelsDate,
       unit
     }
====================================================== */

import {
  keyDiaToDate,
  keyMesToDate,
  keyAnioToDate,
  keySemanaToDate,
  startOfISOMonday,
  isoWeekYear,
  isoWeekNumber,
  formatDia
} from './dateUtils.js';

/* ─────────────────────────────
   API PRINCIPAL
───────────────────────────── */

export function buildCalendar(rango) {
  const inicio = rango?.inicio;
  const fin = rango?.fin;
  const agruparRaw = String(rango?.agrupar ?? 'Dia').toLowerCase();

  if (!inicio || !fin) return null;

  const agrupar =
    agruparRaw.startsWith('anio') ? 'Anio' :
    agruparRaw.startsWith('mes')  ? 'Mes'  :
    agruparRaw.startsWith('sem')  ? 'Semana' :
    'Dia';

  let labelsKey = [];
  let labelsDate = [];
  let unit = 'day';

  switch (agrupar) {
    case 'Anio':
      labelsKey = rangoAnualKey(inicio, fin);
      labelsDate = labelsKey.map(keyAnioToDate);
      unit = 'year';
      break;

    case 'Mes':
      labelsKey = rangoMensualKey(inicio, fin);
      labelsDate = labelsKey.map(keyMesToDate);
      unit = 'month';
      break;

    case 'Semana':
      labelsKey = rangoSemanalKey(inicio, fin);
      labelsDate = labelsKey.map(keySemanaToDate);
      unit = 'week';
      break;

    default:
      labelsKey = rangoDiarioKey(inicio, fin);
      labelsDate = labelsKey.map(keyDiaToDate);
      unit = 'day';
  }

  if (!labelsKey.length) return null;

  return {
    agrupar,
    periodo: agrupar.toLowerCase(),
    labelsKey,
    labelsDate,
    unit
  };
}

/* ======================================================
   NORMALIZACIÓN DE CLAVES
====================================================== */

export function normalizarClave(key, agrupar) {
  if (!key) return null;

  if (agrupar === 'Dia') return key.slice(0, 10);
  if (agrupar === 'Mes') return key.slice(0, 7);
  if (agrupar === 'Anio') return key.slice(0, 4);

  const d = keyDiaToDate(key);
  return `${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2, '0')}`;
}

/* ======================================================
   RANGOS
====================================================== */

function rangoDiarioKey(inicio, fin) {
  let d = keyDiaToDate(inicio);
  const end = keyDiaToDate(fin);
  const res = [];

  while (d <= end) {
    res.push(formatDia(d));
    d.setDate(d.getDate() + 1);
  }
  return res;
}

function rangoMensualKey(inicio, fin) {
  const [yi, mi] = inicio.split('-').map(Number);
  const [yf, mf] = fin.split('-').map(Number);

  let y = yi;
  let m = mi;
  const res = [];

  while (y < yf || (y === yf && m <= mf)) {
    res.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return res;
}

function rangoSemanalKey(inicio, fin) {
  let d = startOfISOMonday(keyDiaToDate(inicio));
  const end = keyDiaToDate(fin);
  const res = [];

  while (d <= end) {
    res.push(`${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2, '0')}`);
    d.setDate(d.getDate() + 7);
  }
  return res;
}

function rangoAnualKey(inicio, fin) {
  const yi = Number(inicio.slice(0, 4));
  const yf = Number(fin.slice(0, 4));
  const res = [];

  for (let y = yi; y <= yf; y++) {
    res.push(String(y));
  }
  return res;
}
