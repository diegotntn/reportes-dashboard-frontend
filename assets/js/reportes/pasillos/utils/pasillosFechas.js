/* ======================================================
   utils/pasillosFechas.js
   Helpers de fechas / ISO week
====================================================== */

export function fmtDia(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function keyDiaToDate(k) {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function startOfISOMonday(d) {
  const r = new Date(d);
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
}

export function isoWeekYear(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return t.getUTCFullYear();
}

export function isoWeekNumber(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(
    (((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7
  );
}

export function isoWeekToDate(y, w) {
  const s = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  const d = s.getUTCDay();
  s.setUTCDate(s.getUTCDate() - (d <= 4 ? d - 1 : d - 8));
  return new Date(s);
}

export function extraerFechaISO(x) {
  if (!x) return null;
  if (typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)) return x;
  const d = new Date(x);
  return isNaN(d) ? null : fmtDia(d);
}

/* ======================================================
   utils/pasillosFechas.js
   Helpers de fechas y labels
====================================================== */

export function formatearLabel(key, agrupar) {
  if (agrupar === 'Dia') {
    const [y, m, d] = key.split('-');
    return `${d}/${m}/${y}`;
  }

  if (agrupar === 'Mes') {
    const [y, m] = key.split('-');
    return `${m}/${y}`;
  }

  if (agrupar === 'Semana') {
    const [y, w] = key.split('-W');
    return `Sem ${w} ${y}`;
  }

  return key;
}

export function opcionesTime(kpi, titulo, unit) {
  return {
    aspectRatio: 2.5,
    plugins: {
      title: {
        display: true,
        text: titulo,
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: { unit },
        title: { display: true, text: 'Fecha' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: kpi.toUpperCase() }
      }
    }
  };
}
