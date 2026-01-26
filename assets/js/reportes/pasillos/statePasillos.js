/* ======================================================
   statePasillos.js
   Estado reactivo simple (sin lógica de render)
====================================================== */

const state = {
  dataPorPasillo: {},
  modoActual: null,
  pasilloActual: null,
  kpiActual: null,
  ultimoResultado: null
};

const listeners = new Set();

/* ======================================================
   SUBSCRIPCIÓN
====================================================== */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => fn(state));
}

/* ======================================================
   GETTERS
====================================================== */
export function getState() {
  return { ...state };
}

/* ======================================================
   SETTERS (CON NOTIFY)
====================================================== */
export function setResultado(resultado) {
  state.ultimoResultado = resultado;
  notify();
}

export function setModo(modo) {
  state.modoActual = modo;
  notify();
}

export function setPasillo(pasillo) {
  state.pasilloActual = pasillo;
  notify();
}

export function setKpi(kpi) {
  state.kpiActual = kpi;
  notify();
}

/* ======================================================
   SETTERS SILENCIOSOS (⚠️ NO notify)
   Se usan SOLO dentro de render
====================================================== */
export function setDataPorPasilloSilent(data) {
  state.dataPorPasillo = data;
}

export function setDefaultsSilent({ modo, pasillo, kpi }) {
  if (modo !== undefined) state.modoActual = modo;
  if (pasillo !== undefined) state.pasilloActual = pasillo;
  if (kpi !== undefined) state.kpiActual = kpi;
}

