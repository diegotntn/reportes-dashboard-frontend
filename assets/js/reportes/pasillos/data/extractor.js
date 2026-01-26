export function extraerDatosPasillos(res, PASILLOS_VALIDOS) {
  const o = {};
  Object.entries(res?.por_pasillo || {}).forEach(([k, v]) => {
    const p = normalizarPasillo(k, PASILLOS_VALIDOS);
    if (p && Array.isArray(v?.series)) {
      o[p] = {
        series: v.series.map(item => ({
          ...item,
          fecha: item.fecha || item.key || ''
        }))
      };
    }
  });
  return o;
}

export function normalizarPasillo(p, PASILLOS_VALIDOS) {
  const v = String(p).toUpperCase();
  if (PASILLOS_VALIDOS.includes(v)) return v;
  if (/^[1-4]$/.test(v)) return `P${v}`;
  return null;
}
