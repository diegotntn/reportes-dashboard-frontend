/**
 * service.js
 * ----------
 * Capa de servicio para reportes
 *
 * RESPONSABILIDADES:
 * - Encapsular llamada al backend
 * - Manejar concurrencia
 *
 * NO HACE:
 * - Manejo de DOM
 * - Manejo de eventos
 * - Estado de vistas
 */

import { generarReporte } from '../api.js';

// Candado interno de concurrencia (local al servicio)
let cargando = false;

export async function fetchReportes(filtros) {
  if (cargando) return null;

  cargando = true;

  try {
    return await generarReporte(filtros);
  } finally {
    cargando = false;
  }
}
