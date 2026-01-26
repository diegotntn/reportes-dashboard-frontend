/* ======================================================
   GeneralView Controller
   ======================
   RESPONSABILIDADES:
   - Escuchar actualización de reportes
   - Esperar a que la vista esté montada
   - Poblar selector de métricas
   - Dibujar la gráfica general
   - Reaccionar a cambios de métrica

   CONTRATO:
   resultado.general = {
     periodo: 'dia' | 'semana' | 'mes' | 'anio',
     serie: [ { key, label, kpis, personas } ]
   }
====================================================== */

import { renderLineChart } from '../../charts/engine.js';
import { viewState } from './viewState.js';


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

// ─────────────────────────────
// Render principal
// ─────────────────────────────
function renderGeneral(resultado) {

  const general = resultado?.general;

  // Validación NUEVA (contrato actual)
  if (!general || !Array.isArray(general.serie) || general.serie.length === 0) {
    mostrarEstadoVacio();
    return;
  }

  // Métricas disponibles desde el primer punto
  const metricas = Object.keys(general.serie[0]?.kpis || {});
  if (!metricas.length) {
    mostrarEstadoVacio();
    return;
  }

  // Métrica por defecto
  if (!viewState.currentMetric || !metricas.includes(viewState.currentMetric)) {
    viewState.currentMetric = metricas[0];
  }

  const select = document.getElementById('metric-select');
  const canvas = document.getElementById('general-chart');

  // ───────── Poblar selector
  select.innerHTML = metricas.map(m => `
    <option value="${m}" ${m === viewState.currentMetric ? 'selected' : ''}>
      ${metricLabel(m)}
    </option>
  `).join('');

  const draw = () => {
    // Serie filtrada por métrica (SIN perder personas)
    const serieFiltrada = general.serie.map(p => ({
      ...p,
      fecha: convertirKeyAFecha(p.key, general.periodo),
      kpis: {
        importe: Number(p.kpis[viewState.currentMetric] ?? 0)
      }
    }));

    renderLineChart(
      canvas,
      {
        periodo: general.periodo,
        series: [
          {
            label: metricLabel(viewState.currentMetric),
            color: '#2563eb',
            bg: 'rgba(37,99,235,.15)',
            serie: serieFiltrada
          }
        ]
      },
      {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => Number(v).toLocaleString('es-MX')
            },
            title: {
              display: true,
              text: metricLabel(viewState.currentMetric)
            }
          },
          x: {
            type: 'time',
            time: {
              unit:
                general.periodo === 'dia' ? 'day' :
                general.periodo === 'semana' ? 'week' :
                general.periodo === 'mes' ? 'month' :
                'year'
            }
          }
        }
      }
    );
  };

  select.onchange = e => {
    viewState.currentMetric = e.target.value;
    draw();
  };

  draw();
}

// ─────────────────────────────
// Estado vacío
// ─────────────────────────────
function mostrarEstadoVacio() {
  const container = document.getElementById('tab-general');
  if (!container) return;

  container.innerHTML = `
    <section class="card">
      <h3>Resumen general</h3>
      <p class="text-muted">
        No hay datos disponibles para el rango seleccionado.
      </p>
    </section>
  `;
}

// ─────────────────────────────
// Utilidades visuales
// ─────────────────────────────
function metricLabel(m) {
  if (m === 'importe') return 'Importe';
  if (m === 'devoluciones') return 'Devoluciones';
  if (m === 'piezas') return 'Piezas';
  return m;
}

function convertirKeyAFecha(key, periodo) {
  if (!key) return null;

  if (periodo === 'dia' || periodo === 'semana') {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  if (periodo === 'mes') {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m - 1, 1);
  }

  if (periodo === 'anio') {
    return new Date(Number(key), 0, 1);
  }

  return null;
}

// helper ISO (se conserva intacto)
function isoWeekToDate(y, w) {
  const s = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  const d = s.getUTCDay();
  s.setUTCDate(s.getUTCDate() - (d <= 4 ? d - 1 : d - 8));
  return new Date(s);
}
