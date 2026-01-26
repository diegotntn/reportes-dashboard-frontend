/* ======================================================
   GeneralView Utils
   =================
   Helpers PUROS de la vista General
   - Labels de métricas
   - Conversión de keys a Date
====================================================== */

// ─────────────────────────────
// Labels de métricas
// ─────────────────────────────
export function metricLabel(m) {
  if (m === 'importe') return 'Importe';
  if (m === 'devoluciones') return 'Devoluciones';
  if (m === 'piezas') return 'Piezas';
  return m;
}

// ─────────────────────────────
// Conversión de key → Date
// ─────────────────────────────
export function convertirKeyAFecha(key, periodo) {
  if (!key) return null;

  // dia / semana: YYYY-MM-DD
  if (periodo === 'dia' || periodo === 'semana') {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // mes: YYYY-MM
  if (periodo === 'mes') {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m - 1, 1);
  }

  // anio: YYYY
  if (periodo === 'anio') {
    return new Date(Number(key), 0, 1);
  }

  return null;
}

// ─────────────────────────────
// Helper ISO week (conservado)
// ─────────────────────────────
export function isoWeekToDate(y, w) {
  const s = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  const d = s.getUTCDay();
  s.setUTCDate(s.getUTCDate() - (d <= 4 ? d - 1 : d - 8));
  return new Date(s);
}