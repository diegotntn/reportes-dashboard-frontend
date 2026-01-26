/**
 * filtersController.js
 * --------------------
 * Controlador de filtros del módulo Reportes
 *
 * RESPONSABILIDADES:
 * - Orquestar el render de filtros
 * - Inicializar filtros por defecto si no existen
 * - Sincronizar filtros con el store
 * - Notificar cambios (callback)
 *
 * NO HACE:
 * - Fetch
 * - Eventos globales
 * - Render HTML directo
 */

import { getFiltros, setFiltros } from '../reportesStore.js';
import { renderReportesFilters } from './filtersRender.js';
import { getDefaultReportesFilters } from './filtersDefaults.js';

export function initReportesFilters(onChange) {
  const container = document.getElementById('filters-container');
  if (!container) return;

  // Inicializar filtros si aún no existen
  if (!getFiltros()) {
    setFiltros(getDefaultReportesFilters());
  }

  // Render puro (HTML)
  renderReportesFilters(container, getFiltros());

  const form = container.querySelector('#reportes-filters');
  if (!form) return;

  // Sincronizar select (seguridad)
  form.agrupar.value = getFiltros().agrupar;

  form.addEventListener('submit', e => {
    e.preventDefault();

    setFiltros({
      ...getFiltros(),
      ...Object.fromEntries(new FormData(form))
    });

    onChange();
  });
}
