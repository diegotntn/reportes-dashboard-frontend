import { resetPersonas, setPersonasData } from './statePersonas.js';

/* ======================================================
   Helpers
====================================================== */

function normalizarPeriodo(agrupar) {
  if (!agrupar) return 'mes';

  const a = agrupar.toLowerCase();
  if (a === 'dia') return 'dia';
  if (a === 'semana') return 'semana';
  if (a === 'mes') return 'mes';
  if (a === 'anio') return 'anio';

  return 'mes';
}

function toNumberSeguro(v) {
  if (v == null) return 0;
  if (typeof v === 'number') return v;

  const n = Number(String(v).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function normalizarKPIs(row) {
  return {
    importe: toNumberSeguro(
      row.importe ??
      row.importe_total ??
      row.total_importe
    ),

    piezas: toNumberSeguro(
      row.piezas ??
      row.piezas_total ??
      row.total_piezas
    ),

    devoluciones: toNumberSeguro(
      row.devoluciones ??
      row.devoluciones_total ??
      row.total_devoluciones
    )
  };
}

/* ======================================================
   Adapter principal
====================================================== */

export function adaptarDatosPersonas(resultado) {
  resetPersonas();

  const bruto = resultado?.por_persona ?? {};
  const mapaPersonas = resultado?.personas ?? {};

  const data = {};
  const personas = [];

  const periodo = normalizarPeriodo(resultado?.agrupar);

  Object.entries(bruto).forEach(([personaId, bloque]) => {
    if (!Array.isArray(bloque.tabla) || bloque.tabla.length === 0) {
      return;
    }

    const nombre = mapaPersonas[personaId] ?? personaId;
    personas.push(personaId);

    const serie = bloque.tabla.map(row => ({
      periodo: row.periodo ?? row.fecha ?? null,
      kpis: normalizarKPIs(row)
    }));

    data[personaId] = {
      id: personaId,
      nombre,
      periodo,
      serie,
      resumen: {
        ...bloque.resumen,
        nombre
      }
    };
  });

  setPersonasData({
    data,
    personas,
    mapaPersonas
  });
}
