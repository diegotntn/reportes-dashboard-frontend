/**
 * reportesEvents.js
 * -----------------
 * Manejo de eventos globales del módulo Reportes
 *
 * RESPONSABILIDADES:
 * - Escuchar eventos externos
 * - Actualizar store
 * - Disparar callbacks de actualización
 *
 * NO HACE:
 * - Fetch
 * - DOM
 * - Render
 */

import { getFiltros, setFiltros } from './reportesStore.js';

export function initReportesEvents(onChange) {
  window.addEventListener('reportes:cambiar-agrupacion', e => {
    const agrupar = e.detail?.agrupar;
    const filtros = getFiltros();

    if (!agrupar || agrupar === filtros.agrupar) return;

    setFiltros({
      ...filtros,
      agrupar
    });

    onChange();
  });
}
