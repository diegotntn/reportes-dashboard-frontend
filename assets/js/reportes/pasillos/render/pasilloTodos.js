import { renderLineChart } from '../../../charts/engine.js';
import { crearCanvas } from '../ui/canvas.js';
import { normalizarSerieContra } from '../data/normalizer.js';
import { calendarioDesdeFiltro } from '../data/calendar.js';
import { COLORES, COLORES_BG } from '../config/colors.js';
import { PASILLOS_VALIDOS } from '../config/constants.js';

export function renderPasilloTodos({
  container,
  dataPorPasillo,
  kpiActual,
  ultimoResultado,
  formatearLabel,
  opcionesTime
}) {
  const { labelsKey, labelsDate, unit, agrupar } =
    calendarioDesdeFiltro(ultimoResultado);

  if (!labelsKey.length) return;

  const grid = document.createElement('div');
  grid.className = 'pasillos-grid';

  PASILLOS_VALIDOS.forEach((p, i) => {
    const bloque = dataPorPasillo[p];
    if (!bloque) return;

    const data = normalizarSerieContra(
      labelsKey,
      bloque.series,
      kpiActual,
      agrupar
    );

    const serie = labelsKey.map((key, idx) => ({
      key,
      label: formatearLabel(key, agrupar),
      fecha: labelsDate[idx],
      kpis: {
        importe: data[idx] || 0,
        piezas: 0,
        devoluciones: 0
      }
    }));

    const card = document.createElement('section');
    card.className = 'card';

    const h = document.createElement('h4');
    h.textContent = p;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '280px';

    card.append(h, canvas);
    grid.appendChild(card);

    renderLineChart(
      canvas,
      {
        periodo: agrupar.toLowerCase(),
        series: [{
          label: p,
          color: COLORES[i],
          bg: COLORES_BG[i],
          fill: false,
          serie
        }]
      },
      {
        ...opcionesTime(kpiActual, `Tendencia · ${p}`, unit),
        plugins: { legend: { display: false } }
      }
    );
  });

  container.appendChild(grid);
}
