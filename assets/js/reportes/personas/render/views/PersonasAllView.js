import { renderLineChart } from '../../../../charts/engine.js';
import * as state from '../../statePersonas.js';
import { estadoVacio } from '../../emptyPersonas.js';

import { buildCalendar } from '../../data/calendar/buildCalendar.js';
import { normalizeSeries } from '../../data/series/normalizeSeries.js';

/* ======================================================
   Render Todos separados
   - Una gráfica por persona
   - Todas en la misma pantalla
====================================================== */

export function renderizarTodos(container) {

  const personas = state.getPersonasDisponibles();
  const dataPorPersona = state.getDataPorPersona();
  const resultado = state.getUltimoResultado();
  const kpi = state.getKpiActual();

  container.innerHTML = '';

  if (!personas.length || !resultado) {
    container.innerHTML = estadoVacio('No hay datos para mostrar');
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
     2️⃣ GRID DE TARJETAS
  ====================================================== */

  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    margin-top: 20px;
  `;

  let tieneDatos = false;

  /* ======================================================
     3️⃣ UNA GRÁFICA POR PERSONA
  ====================================================== */

  personas.forEach((personaId, index) => {
    const data = dataPorPersona[personaId];
    if (!data || !Array.isArray(data.serie)) return;

    const serie = normalizeSeries({
      data,
      calendario,
      kpi
    });

    // No renderizar gráficas totalmente en cero
    if (!serie.some(p => p.kpis[kpi] !== 0)) return;

    tieneDatos = true;

    /* ───────── Card ───────── */
    const card = document.createElement('div');
    card.style.cssText = `
      background: #fff;
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,.08);
      border: 1px solid #e2e8f0;
    `;

    const title = document.createElement('h4');
    title.textContent = data.nombre ?? personaId;
    title.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 15px;
      color: #334155;
      font-weight: 600;
    `;

    const canvasWrapper = document.createElement('div');
    canvasWrapper.style.cssText = `
      position: relative;
      width: 100%;
      height: 240px;
    `;

    const canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);

    card.append(title, canvasWrapper);
    grid.appendChild(card);

    /* ───────── Render ───────── */
    renderLineChart(
      canvas,
      {
        periodo: calendario.periodo,
        series: [{
          label: data.nombre ?? personaId,
          color: state.COLORES[index % state.COLORES.length],
          bg: state.COLORES_BG[index % state.COLORES_BG.length],
          kpi,
          serie
        }]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
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
  });

  if (!tieneDatos) {
    container.innerHTML = estadoVacio('No hay datos válidos para mostrar');
    return;
  }

  container.appendChild(grid);
}
