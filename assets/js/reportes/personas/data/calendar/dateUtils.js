/* ======================================================
   dateUtils
   ======================================================
   Helpers de fechas y semanas ISO
   - Conversión key → Date
   - Cálculo de semanas ISO
   - Formateo estándar YYYY-MM-DD
====================================================== */

/* ─────────────────────────────
   KEY → DATE
───────────────────────────── */

export function keyDiaToDate(key) {
  if (!key) return null;
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function keyMesToDate(key) {
  if (!key) return null;
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1);
}

export function keyAnioToDate(key) {
  if (!key) return null;
  return new Date(Number(key), 0, 1);
}

export function keySemanaToDate(key) {
  if (!key) return null;
  const [y, w] = key.split('-W').map(Number);
  return isoWeekToDate(y, w);
}

/* ─────────────────────────────
   ISO WEEK HELPERS
───────────────────────────── */

export function startOfISOMonday(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export function isoWeekYear(date) {
  const d = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));

  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return d.getUTCFullYear();
}

export function isoWeekNumber(date) {
  const d = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));

  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(
    (((d - yearStart) / 86400000) + 1) / 7
  );
}

export function isoWeekToDate(year, week) {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay();
  simple.setUTCDate(simple.getUTCDate() - (dow <= 4 ? dow - 1 : dow - 8));
  return new Date(simple);
}

/* ─────────────────────────────
   FORMATTERS
───────────────────────────── */

export function formatDia(date) {
  if (!(date instanceof Date)) return '';
  return `${date.getFullYear()}-${
    String(date.getMonth() + 1).padStart(2, '0')
  }-${
    String(date.getDate()).padStart(2, '0')
  }`;
}
