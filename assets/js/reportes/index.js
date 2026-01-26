/**
 * ReportesScreen
 * --------------
 * Orquestador del dashboard de reportes
 *
 * RESPONSABILIDADES:
 * - Renderizar estructura base del dashboard
 * - Inicializar filtros
 * - Pedir datos al backend
 * - Distribuir resultados a las vistas
 *
 * NO HACE:
 * - Render de gráficas
 * - Lógica interna de cada vista
 */

// ─────────────────────────────
// IMPORTS DE VISTAS
// ─────────────────────────────

// Vistas legacy / nuevas (event-driven)
import './general/controller.js';
import './pasillos.js';
import './zonas.js';
import './detalle.js';

// Personas (arquitectura nueva)
import { cargarResultadoPersonas } from './personas/index.js';

// Infraestructura
import { iniciarTabsReportes } from '../router.js';
import { fetchReportes } from './service.js';

// Store
import {
  getFiltros,
  setResultado,
  getResultado,
  isInicializado,
  setInicializado
} from './reportesStore.js';

// Events
import { initReportesEvents } from './reportesEvents.js';

// Filters
import { initReportesFilters } from './filters/filtersController.js';

/* ======================================================
   ENTRY POINT
====================================================== */
export function renderReportesScreen(container) {
  // HTML base (se monta una sola vez)
  container.innerHTML = `
    <section class="card reportes-screen">

      <header class="screen-header">
        <h2>Reportes</h2>
      </header>

      <section id="filters-container"></section>

      <nav class="tabs">
        <button data-tab="general" class="active">General</button>
        <button data-tab="pasillos">Pasillos</button>
        <button data-tab="personas">Personas</button>
        <button data-tab="zonas">Zonas</button>
        <button data-tab="detalle">Detalle</button>
      </nav>

      <section id="tab-general" class="tab-panel"></section>
      <section id="tab-pasillos" class="tab-panel" style="display:none"></section>
      <section id="tab-personas" class="tab-panel" style="display:none"></section>
      <section id="tab-zonas" class="tab-panel" style="display:none"></section>
      <section id="tab-detalle" class="tab-panel" style="display:none"></section>

    </section>
  `;

  initReportesFilters(actualizarReportes);
  initReportesEvents(actualizarReportes);

  iniciarTabsReportes('general');

  if (!isInicializado()) {
    setInicializado(true);
    actualizarReportes();
  }
}

/* ======================================================
   API (fetch + distribución)
====================================================== */
async function actualizarReportes() {
  const resultado = await fetchReportes(getFiltros());
  if (!resultado) return;

  setResultado(resultado);

  window.dispatchEvent(
    new CustomEvent('reportes:actualizados', {
      detail: getResultado()
    })
  );

  cargarResultadoPersonas(getResultado());
}

/* ======================================================
   ACCESO SOLO LECTURA AL ESTADO
====================================================== */
export function getResultadoActual() {
  return getResultado();
}
