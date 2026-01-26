/**
 * filtersRender.js
 * ----------------
 * Render del formulario de filtros de Reportes
 *
 * RESPONSABILIDADES:
 * - Generar el HTML de filtros
 *
 * NO HACE:
 * - Manejo de estado
 * - Eventos
 * - Fetch
 */

export function renderReportesFilters(container, filtros) {
  if (!container) return;

  container.innerHTML = `
    <form id="reportes-filters" class="filters-form">

      <label>
        Desde
        <input type="date" name="desde" value="${filtros.desde}">
      </label>

      <label>
        Hasta
        <input type="date" name="hasta" value="${filtros.hasta}">
      </label>

      <label>
        Agrupar por
        <select name="agrupar">
          <option value="Dia">Día</option>
          <option value="Semana">Semana</option>
          <option value="Mes">Mes</option>
          <option value="Anio">Año</option>
        </select>
      </label>

      <button type="submit">Generar</button>
    </form>
  `;
}
