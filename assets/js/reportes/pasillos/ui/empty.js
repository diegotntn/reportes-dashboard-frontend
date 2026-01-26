/* ======================================================
   Pasillos UI – Empty States
====================================================== */

export function mostrarEstadoEspera() {
  const container = document.getElementById('pasillos-container');
  if (container) {
    container.innerHTML = estadoVacio('Esperando datos…');
  }
}

export function estadoVacio(
  t = 'No hay datos por pasillo.'
) {
  return `
    <section class="card empty-state">
      <h4>Reporte por pasillos</h4>
      <p>${t}</p>
    </section>
  `;
}
