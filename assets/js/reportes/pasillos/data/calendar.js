/* ======================================================
   data/calendar.js
====================================================== */

import {
  fmtDia,
  keyDiaToDate,
  startOfISOMonday,
  isoWeekYear,
  isoWeekNumber,
  isoWeekToDate
} from '../utils/pasillosFechas.js';

export function getAgrupar(ultimoResultado) {
  const raw = String(ultimoResultado?.rango?.agrupar ?? 'Dia').toLowerCase();
  if (raw.startsWith('mes')) return 'Mes';
  if (raw.startsWith('sem')) return 'Semana';
  return 'Dia';
}

export function calendarioDesdeFiltro(ultimoResultado) {
  const inicio = ultimoResultado?.rango?.inicio;
  const fin = ultimoResultado?.rango?.fin;
  const agrupar = getAgrupar(ultimoResultado);

  if (!inicio || !fin) {
    return { labelsKey: [], labelsDate: [], unit: 'day', agrupar };
  }

  if (agrupar === 'Mes') {
    const labelsKey = rangoMensualKey(inicio, fin);
    return {
      labelsKey,
      labelsDate: labelsKey.map(keyMesToDate),
      unit: 'month',
      agrupar
    };
  }

  if (agrupar === 'Semana') {
    const labelsKey = rangoSemanalKey(inicio, fin);
    return {
      labelsKey,
      labelsDate: labelsKey.map(keySemanaToDate),
      unit: 'week',
      agrupar
    };
  }

  const labelsKey = rangoDiarioKey(inicio, fin);
  return {
    labelsKey,
    labelsDate: labelsKey.map(keyDiaToDate),
    unit: 'day',
    agrupar
  };
}

export function rangoDiarioKey(i, f) {
  let d = keyDiaToDate(i);
  const end = keyDiaToDate(f);
  const res = [];
  while (d <= end) {
    res.push(fmtDia(d));
    d.setDate(d.getDate() + 1);
  }
  return res;
}

export function rangoMensualKey(i, f) {
  const [yi, mi] = i.split('-').map(Number);
  const [yf, mf] = f.split('-').map(Number);
  let y = yi, m = mi;
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

export function rangoSemanalKey(i, f) {
  let d = startOfISOMonday(keyDiaToDate(i));
  const end = keyDiaToDate(f);
  const res = [];

  while (d <= end) {
    res.push(`${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2, '0')}`);
    d.setDate(d.getDate() + 7);
  }
  return res;
}

export function keyMesToDate(k) {
  const [y, m] = k.split('-').map(Number);
  return new Date(y, m - 1, 1);
}

export function keySemanaToDate(k) {
  const [y, w] = k.split('-W').map(Number);
  return isoWeekToDate(y, w);
}
