/* ======================================================
   density.js
   Helper para adaptar densidad de puntos en gráficas
====================================================== */

export function adaptDensity(count) {
  if (count > 180) return { maxTicksLimit: 8, pointRadius: 0 };
  if (count > 60)  return { maxTicksLimit: 10, pointRadius: 2 };
  if (count > 20)  return { maxTicksLimit: 12, pointRadius: 3 };
  return { maxTicksLimit: count, pointRadius: 4 };
}
