/* ======================================================
   controllerPasillos.js
   Eventos + orquestación de Pasillos
====================================================== */

import { label, select } from './ui/controls.js';
import { mostrarEstadoEspera, estadoVacio } from './ui/empty.js';
import { extraerDatosPasillos } from './data/extractor.js';
import { renderPorModo } from './render/pasilloMain.js';

import {
  MODOS,
  PASILLOS_VALIDOS,
  KPIS
} from './config/constants.js';

import {
  subscribe,
  getState,
  setResultado,
  setModo,
  setPasillo,
  setKpi,
  setDataPorPasilloSilent,
  setDefaultsSilent
} from './statePasillos.js';

import {
  formatearLabel,
  opcionesTime
} from './utils/pasillosFechas.js';

/* ======================================================
   EVENTOS GLOBALES
====================================================== */
window.addEventListener('reportes:actualizados', e => {
  setResultado(e.detail); // 🔑 ÚNICO notify fuerte
});

window.addEventListener('reportes:vista-montada', e => {
  if (e.detail?.tab !== 'pasillos') return;
  const { ultimoResultado } = getState();
  ultimoResultado ? renderSeguro() : mostrarEstadoEspera();
});

/* ======================================================
   SUBSCRIPCIÓN AL ESTADO
====================================================== */
subscribe(() => {
  const tab = document.getElementById('tab-pasillos');
  if (tab?.classList.contains('active')) {
    renderSeguro();
  }
});

/* ======================================================
   RENDER SEGURO
====================================================== */
function renderSeguro() {
  const { ultimoResultado } = getState();
  if (!ultimoResultado) return mostrarEstadoEspera();

  const tab = document.getElementById('tab-pasillos');
  if (!tab) return;

  const controls = tab.querySelector('.pasillos-controls');
  const container = tab.querySelector('#pasillos-container');
  if (!controls || !container) return;

  renderPasillos(ultimoResultado, controls, container);
}

/* ======================================================
   RENDER PRINCIPAL
====================================================== */
function renderPasillos(resultado, controls, container) {
  const data = extraerDatosPasillos(resultado, PASILLOS_VALIDOS);
  setDataPorPasilloSilent(data); // ❗ NO notify

  const pasillos = PASILLOS_VALIDOS.filter(p => data[p]);

  controls.innerHTML = '';
  container.innerHTML = '';

  if (!pasillos.length) {
    container.innerHTML = estadoVacio();
    return;
  }

  const state = getState();

  const pasilloActual =
    state.pasilloActual && pasillos.includes(state.pasilloActual)
      ? state.pasilloActual
      : pasillos[0];

  const kpisDisponibles = KPIS.filter(k =>
    data[pasilloActual].series.some(pt => Number.isFinite(pt[k]))
  );

  const kpiActual =
    kpisDisponibles.includes(state.kpiActual)
      ? state.kpiActual
      : kpisDisponibles[0];

  setDefaultsSilent({
    modo: state.modoActual ?? MODOS[0],
    pasillo: pasilloActual,
    kpi: kpiActual
  });

  controls.append(
    label('Modo:'),
    select(MODOS, state.modoActual ?? MODOS[0], v => setModo(v)),
    label('Pasillo:'),
    select(pasillos, pasilloActual, v => setPasillo(v)),
    label('KPI:'),
    select(kpisDisponibles, kpiActual, v => setKpi(v))
  );

  renderActual(container);
}

/* ======================================================
   DELEGACIÓN A RENDER POR MODO
====================================================== */
function renderActual(container) {
  const state = getState();

  renderPorModo({
    modo: state.modoActual,
    container,
    dataPorPasillo: state.dataPorPasillo,
    pasilloActual: state.pasilloActual,
    kpiActual: state.kpiActual,
    ultimoResultado: state.ultimoResultado,
    formatearLabel,
    opcionesTime
  });
}
