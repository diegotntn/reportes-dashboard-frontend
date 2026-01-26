import { renderLineChart } from '../../../../charts/engine.js';
import * as state from '../../statePersonas.js';
import { crearCanvas } from '../../ui.js';
import { estadoVacio } from '../../emptyPersonas.js';

import { buildCalendar } from '../../data/calendar/buildCalendar.js';
import { normalizeSeries } from '../../data/series/normalizeSeries.js';

/* ======================================================
   Render Comparación (Personas)
   - Varias personas
   - Una sola gráfica
   - Una serie por persona
====================================================== */

export function renderizarComparacion(container) {

  const personas = state.getPersonasDisponibles();
  const dataPorPersona = state.getDataPorPersona();
  const resultado = state.getUltimoResultado();
  const kpi = state.getKpiActual();

  container.innerHTML = '';

  if (!personas.length || !resultado) {
    container.innerHTML = estadoVacio('No hay datos para comparar');
    return;
  }

  /* ======================================================
     1️⃣ CALENDARIO MAESTRO
  ====================================================== */

  const calendario = buildCalendar(resultado.rango);
  if (!calendario) {
    container.innerHTML = estadoVacio('Rango inválido');
    return;
  }

  const { unit } = calendario;

  /* ======================================================
     2️⃣ SERIES POR PERSONA
  ====================================================== */

  const series = personas.map((personaId, index) => {
    const data = dataPorPersona[personaId];
    if (!data || !Array.isArray(data.serie)) return null;

    const serie = normalizeSeries({
      data,
      calendario,
      kpi
    });

    // Si toda la serie es cero, no se incluye
    if (!serie.some(p => p.kpis[kpi] !== 0)) return null;

    return {
      label: data.nombre ?? personaId,
      color: state.COLORES[index % state.COLORES.length],
      bg: state.COLORES_BG[index % state.COLORES_BG.length],
      kpi,
      serie
    };
  }).filter(Boolean);

  if (!series.length) {
    container.innerHTML = estadoVacio('No hay datos válidos para comparar');
    return;
  }

  /* ======================================================
     3️⃣ RENDER
  ====================================================== */

  const canvas = crearCanvas(container);

  renderLineChart(
    canvas,
    {
      periodo: calendario.periodo,
      series
    },
    {
      scales: {
        x: {
          type: 'time',
          time: { unit }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: kpi.toUpperCase()
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  );
}
