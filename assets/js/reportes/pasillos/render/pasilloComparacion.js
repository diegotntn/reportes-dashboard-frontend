import { renderLineChart } from '../../../charts/engine.js';
import { crearCanvas } from '../ui/canvas.js';
import { normalizarSerieContra } from '../data/normalizer.js';
import { calendarioDesdeFiltro } from '../data/calendar.js';
import { COLORES, COLORES_BG } from '../config/colors.js';
import { PASILLOS_VALIDOS } from '../config/constants.js';

export function renderPasilloComparacion({
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

  const series = PASILLOS_VALIDOS
    .filter(p => dataPorPasillo[p])
    .map((p, i) => {
      const bloque = dataPorPasillo[p];
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

      return {
        label: p,
        color: COLORES[i],
        bg: COLORES_BG[i],
        fill: false,
        serie
      };
    });

  if (!series.length) return;

  const canvas = crearCanvas(container);

  renderLineChart(
    canvas,
    { periodo: agrupar.toLowerCase(), series },
    opcionesTime(kpiActual, `Comparación · ${kpiActual}`, unit)
  );
}
