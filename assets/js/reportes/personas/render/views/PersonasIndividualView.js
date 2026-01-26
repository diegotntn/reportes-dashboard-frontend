import { renderLineChart } from '../../../../charts/engine.js';
import * as state from '../../statePersonas.js';
import { crearCanvas } from '../../ui.js';
import { estadoVacio } from '../../emptyPersonas.js';

import { buildCalendar } from '../../data/calendar/buildCalendar.js';
import { normalizeSeries } from '../../data/series/normalizeSeries.js';

/* ======================================================
   Render Individual (Persona seleccionada)
====================================================== */

export function renderizarIndividual(container) {

  const personaId = state.getPersonaActual();
  const data = state.getDataPorPersona()[personaId];
  const resultado = state.getUltimoResultado();

  if (!personaId || !data || !resultado) {
    container.innerHTML = estadoVacio('No hay datos para la persona seleccionada');
    return;
  }

  const kpi = state.getKpiActual();

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
     2️⃣ NORMALIZAR SERIE
  ====================================================== */

  const serie = normalizeSeries({
    data,
    calendario,
    kpi
  });

  /* ======================================================
     3️⃣ RENDER
  ====================================================== */

  const canvas = crearCanvas(container);

  renderLineChart(
    canvas,
    {
      periodo: calendario.periodo,
      series: [{
        label: data.nombre ?? personaId,
        color: state.COLORES[0],
        bg: state.COLORES_BG[0],
        kpi,
        serie
      }]
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
      }
    }
  );
}
