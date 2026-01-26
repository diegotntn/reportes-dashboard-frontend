/* ======================================================
   GeneralView Renderer
   ====================
   RESPONSABILIDADES:
   - Validar datos de la vista General
   - Poblar selector de métricas
   - Preparar series
   - Dibujar gráfica
====================================================== */

import { renderLineChart } from '../../charts/engine.js';
import { viewState } from './viewState.js';
import {metricLabel, convertirKeyAFecha} from './utils.js';

// ─────────────────────────────
// Render principal
// ─────────────────────────────
export function renderGeneral(resultado) {

  const general = resultado?.general;

  // Validación (contrato actual)
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