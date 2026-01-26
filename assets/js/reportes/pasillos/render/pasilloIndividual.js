import { renderLineChart } from '../../../charts/engine.js';
import { crearCanvas } from '../ui/canvas.js';
import { normalizarSerieContra } from '../data/normalizer.js';
import { calendarioDesdeFiltro } from '../data/calendar.js';
import { COLORES, COLORES_BG } from '../config/colors.js';

export function renderPasilloIndividual({
  container,
  dataPorPasillo,
  pasilloActual,
  kpiActual,
  ultimoResultado,
  formatearLabel,
  opcionesTime
}) {
  const bloque = dataPorPasillo[pasilloActual];
  if (!bloque) return;

  const { labelsKey, labelsDate, unit, agrupar } =
    calendarioDesdeFiltro(ultimoResultado);

  if (!labelsKey.length) return;

  const data = normalizarSerieContra(
    labelsKey,
    bloque.series,
    kpiActual,
    agrupar
  );

  const serie = labelsKey.map((key, i) => ({
    key,
    label: formatearLabel(key, agrupar),
    fecha: labelsDate[i],
    kpis: {
      importe: data[i] || 0,
      piezas: 0,
      devoluciones: 0
    }
  }));

  const canvas = crearCanvas(container);

  renderLineChart(
    canvas,
    {
      periodo: agrupar.toLowerCase(),
      series: [{
        label: pasilloActual,
        color: COLORES[0],
        bg: COLORES_BG[0],
        serie
      }]
    },
    opcionesTime(
      kpiActual,
      `Tendencia · ${pasilloActual}`,
      unit
    )
  );
}
