/* ======================================================
   GeneralView Controller
   ======================
   RESPONSABILIDADES:
   - Escuchar actualización de reportes
   - Esperar a que la vista esté montada
   - Orquestar render de la vista General

   CONTRATO:
   resultado.general = {
     periodo: 'dia' | 'semana' | 'mes' | 'anio',
     serie: [ { key, label, kpis, personas } ]
   }
====================================================== */

import { viewState } from './viewState.js';
import { renderGeneral } from './renderer.js';


// ─────────────────────────────
// Eventos globales
// ─────────────────────────────

// Resultado nuevo desde backend
window.addEventListener('reportes:actualizados', e => {
  viewState.ultimoResultado = e.detail;
  intentarRender();
});

// Activación de tab
window.addEventListener('reportes:tab-activada', e => {
  if (e.detail?.tab === 'general') {
    viewState.vistaMontada = true;
    intentarRender();
  }
});

// ─────────────────────────────
// Render seguro (no se pierde)
// ─────────────────────────────
function intentarRender() {
  if (!viewState.ultimoResultado) return;
  if (!viewState.vistaMontada) return;

  const container = document.getElementById('tab-general');
  const select = document.getElementById('metric-select');
  const canvas = document.getElementById('general-chart');

  if (!container || !select || !canvas) {
    console.warn('[GeneralView] DOM aún no disponible');
    return;
  }

  renderGeneral(viewState.ultimoResultado);
}
