/**
 * filtersDefaults.js
 * ------------------
 * Valores por defecto de filtros para Reportes
 *
 * RESPONSABILIDADES:
 * - Definir filtros iniciales
 *
 * NO HACE:
 * - Estado
 * - DOM
 * - Eventos
 */

export function getDefaultReportesFilters() {
  const hoy = new Date();
  const desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  return {
    desde: desde.toISOString().slice(0, 10),
    hasta: hoy.toISOString().slice(0, 10),
    agrupar: 'Mes'
  };
}
