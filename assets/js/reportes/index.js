/**
 * ReportesScreen
 * --------------
 * Orquestador del dashboard de reportes
 *
 * RESPONSABILIDADES:
 * - Renderizar la estructura base del dashboard
 * - Inicializar filtros y eventos globales
 * - Solicitar datos al backend
 * - Distribuir resultados a las distintas vistas
 *
 * NO HACE:
 * - Render de gráficas
 * - Lógica interna de cada vista
 */

// ─────────────────────────────
// IMPORTS DE VISTAS
// ─────────────────────────────

// General (legacy / event-driven)
import './general/controller.js';

// Pasillos (side-effect, NO exporta nada)
import './pasillos/indexPasillos.js';

// Otras vistas legacy
import './zonas/zonas.js';
import './detalle/detalle.js';

// Personas (arquitectura nueva)
import { cargarResultadoPersonas } from './personas/indexPersonas.js';

// ─────────────────────────────
// INFRAESTRUCTURA
// ─────────────────────────────
import { iniciarTabsReportes } from '../router.js';
import { fetchReportes } from './service.js';

// ─────────────────────────────
// STORE
// ─────────────────────────────
import {
  getFiltros,
  setResultado,
  getResultado,
  isInicializado,
  setInicializado
} from './reportesStore.js';

// ─────────────────────────────
// EVENTS & FILTERS
// ─────────────────────────────
import { initReportesEvents } from './reportesEvents.js';
import { initReportesFilters } from './filters/filtersController.js';

/* ======================================================
   ENTRY POINT
====================================================== */
export function renderReportesScreen(container) {
  // Render base del dashboard (una sola vez)
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

  // Inicialización de filtros y eventos globales
  initReportesFilters(actualizarReportes);
  initReportesEvents(actualizarReportes);

  // Tabs
  iniciarTabsReportes('general');

  // Primera carga
  if (!isInicializado()) {
    setInicializado(true);
    actualizarReportes();
  }
}

/* ======================================================
   FETCH + DISTRIBUCIÓN DE RESULTADOS
====================================================== */
async function actualizarReportes() {
  const resultado = await fetchReportes(getFiltros());
  if (!resultado) return;

  setResultado(resultado);

  // Evento global para vistas event-driven
  window.dispatchEvent(
    new CustomEvent('reportes:actualizados', {
      detail: getResultado()
    })
  );

  // Personas usa contrato directo (arquitectura nueva)
  cargarResultadoPersonas(getResultado());
}

/* ======================================================
   ACCESO SOLO LECTURA AL ESTADO
====================================================== */
export function getResultadoActual() {
  return getResultado();
}
