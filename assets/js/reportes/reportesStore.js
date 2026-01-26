/**
 * reportesStore.js
 * ----------------
 * Store del módulo Reportes
 *
 * RESPONSABILIDADES:
 * - Mantener el estado único del módulo
 * - Exponer getters y setters controlados
 *
 * NO HACE:
 * - Fetch
 * - DOM
 * - Eventos
 */

let resultadoActual = null;
let filtrosActuales = null;
let inicializado = false;

/* ============================
   FILTROS
============================ */

export function setFiltros(filtros) {
  filtrosActuales = filtros;
}

export function getFiltros() {
  return filtrosActuales;
}

/* ============================
   RESULTADO
============================ */

export function setResultado(resultado) {
  resultadoActual = resultado;
}

export function getResultado() {
  return resultadoActual;
}

/* ============================
   CICLO DE VIDA
============================ */

export function isInicializado() {
  return inicializado;
}

export function setInicializado(valor = true) {
  inicializado = valor;
}
