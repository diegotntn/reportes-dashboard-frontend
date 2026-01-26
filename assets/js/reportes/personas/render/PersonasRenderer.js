/**
 * PersonasRenderer
 * =================
 * Router de render para la vista Personas
 */

import { getModoActual } from '../statePersonas.js';

import { renderizarIndividual } from './views/PersonasIndividualView.js';
import { renderizarComparacion } from './views/PersonasComparisonView.js';
import { renderizarTodos } from './views/PersonasAllView.js';

export function renderizarSegunModo(container) {
  switch (getModoActual()) {
    case 'Individual':
      return renderizarIndividual(container);

    case 'Comparación':
      return renderizarComparacion(container);

    case 'Todos separados':
      return renderizarTodos(container);

    default:
      return null;
  }
}
