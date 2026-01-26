/**
 * api.js
 * -------------------------------------------------
 * Capa de comunicación con el backend
 *
 * RESPONSABILIDAD:
 * - Comunicación HTTP (fetch)
 * - Normalización mínima del payload de respuesta
 *
 * NO HACE:
 * - Manejo de DOM
 * - Lógica de UI
 * - Render
 */

/* ─────────────────────────
   🔁 BANDERA DE ENTORNO
───────────────────────── */

const MODE = 0; // 0 = LOCALHOST | 1 = RENDER


/* ─────────────────────────
   CONFIGURACIÓN BASE
───────────────────────── */

const BASE_URL =
  MODE === 0
    ? 'http://localhost:8000/api'
    : 'https://reportes-dashboard-backend.onrender.com/api';

const API_CONFIG = {
  BASE_URL
};


/* ─────────────────────────
   Fetch base
───────────────────────── */

async function fetchBase(url, options = {}) {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} · ${text}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    return await response.json();

  } catch (error) {
    throw error;
  }
}


/* ─────────────────────────
   API genérica
───────────────────────── */

export async function apiGet(path, params = {}) {
  const url = new URL(API_CONFIG.BASE_URL + path);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return fetchBase(url.toString(), { method: 'GET' });
}

export async function apiPost(path, data = {}) {
  return fetchBase(API_CONFIG.BASE_URL + path, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}


/* ─────────────────────────
   Endpoints específicos
───────────────────────── */

/**
 * Generar reporte principal
 */
export async function generarReporte(filtros = {}) {
  const payload = {
    desde: filtros.desde,
    hasta: filtros.hasta,
    agrupar: filtros.agrupar
  };

  const resultado = await apiPost('/reportes', payload);

  if (resultado && filtros?.desde && filtros?.hasta) {
    resultado.rango = {
      inicio: filtros.desde,
      fin: filtros.hasta,
      agrupar: filtros.agrupar
    };
  }

  return resultado;
}


/* ─────────────────────────
   Otros endpoints
───────────────────────── */

export async function obtenerProductos() {
  return apiGet('/productos');
}

export async function obtenerPersonal() {
  return apiGet('/personal');
}

export async function obtenerDevoluciones(filtros = {}) {
  return apiGet('/devoluciones', filtros);
}


/* ─────────────────────────
   Helper opcional
───────────────────────── */

export function normalizarError(error) {
  return {
    mensaje: error?.message || 'Error desconocido',
    timestamp: new Date().toISOString()
  };
}
