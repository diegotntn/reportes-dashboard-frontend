import { renderPasilloIndividual } from './pasilloIndividual.js';
import { renderPasilloComparacion } from './pasilloComparacion.js';
import { renderPasilloTodos } from './pasilloTodos.js';

export function renderPorModo({
  modo,
  container,
  dataPorPasillo,
  pasilloActual,
  kpiActual,
  ultimoResultado,
  formatearLabel,
  opcionesTime
}) {
  container.innerHTML = '';

  if (modo === 'Individual') {
    renderPasilloIndividual({
      container,
      dataPorPasillo,
      pasilloActual,
      kpiActual,
      ultimoResultado,
      formatearLabel,
      opcionesTime
    });
  } else if (modo === 'Comparación') {
    renderPasilloComparacion({
      container,
      dataPorPasillo,
      kpiActual,
      ultimoResultado,
      formatearLabel,
      opcionesTime
    });
  } else {
    renderPasilloTodos({
      container,
      dataPorPasillo,
      kpiActual,
      ultimoResultado,
      formatearLabel,
      opcionesTime
    });
  }
}
