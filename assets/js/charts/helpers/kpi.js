/* ======================================================
   kpi.js
   Resolver central de KPI para gráficas
====================================================== */

export function resolveKpi(point, cfg, payload) {
  const kpi =
    cfg?.kpi ??
    payload?.kpi ??
    'importe';

  return Number(
    point?.kpis?.[kpi] ??
    point?.kpis?.importe ??
    0
  );
}
