/**
 * ═══════════════════════════════════════════════════════════════════
 *  NutriSaaS — Capa de Servicios API
 *  Centraliza todas las llamadas al backend REST.
 *  Cuando la API real esté disponible, solo cambia BASE_URL.
 * ═══════════════════════════════════════════════════════════════════
 */

export const BASE_URL = 'http://127.0.0.1:8000/api';

/** Construye los headers estándar de autenticación */
export const authHeaders = (token, empresaId) => ({
  'Authorization': `Bearer ${token}`,
  'X-Empresa-ID': empresaId,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

/**
 * Wrapper genérico de fetch con manejo de errores uniforme.
 * Retorna { data, error, status }.
 */
const apiFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('Content-Type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      return { data: null, error: data?.message || `Error ${res.status}`, status: res.status };
    }
    return { data, error: null, status: res.status };
  } catch (err) {
    // Error de red / servidor no disponible
    return { data: null, error: 'No se pudo conectar con el servidor.', status: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PACIENTES
// ─────────────────────────────────────────────────────────────────────────────

export const pacientesApi = {
  /** GET /api/tenant/pacientes */
  getAll: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/pacientes`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/pacientes */
  create: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/pacientes`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** PUT /api/tenant/pacientes/:id */
  update: (token, empresaId, id, payload) =>
    apiFetch(`${BASE_URL}/tenant/pacientes/${id}`, {
      method: 'PUT',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** DELETE /api/tenant/pacientes/:id */
  remove: (token, empresaId, id) =>
    apiFetch(`${BASE_URL}/tenant/pacientes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  CITAS / AGENDA
// ─────────────────────────────────────────────────────────────────────────────

export const citasApi = {
  /** GET /api/tenant/citas */
  getAll: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/citas`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/citas */
  create: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/citas`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** PUT /api/tenant/citas/:id */
  update: (token, empresaId, id, payload) =>
    apiFetch(`${BASE_URL}/tenant/citas/${id}`, {
      method: 'PUT',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** DELETE /api/tenant/citas/:id */
  remove: (token, empresaId, id) =>
    apiFetch(`${BASE_URL}/tenant/citas/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  NOTAS CLÍNICAS
// ─────────────────────────────────────────────────────────────────────────────

export const notasApi = {
  /** GET /api/tenant/notas */
  getAll: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/notas`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/notas */
  create: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/notas`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** PUT /api/tenant/notas/:id */
  update: (token, empresaId, id, payload) =>
    apiFetch(`${BASE_URL}/tenant/notas/${id}`, {
      method: 'PUT',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** DELETE /api/tenant/notas/:id */
  remove: (token, empresaId, id) =>
    apiFetch(`${BASE_URL}/tenant/notas/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  DIETAS / PLANES ALIMENTICIOS
// ─────────────────────────────────────────────────────────────────────────────

export const dietasApi = {
  /** GET /api/tenant/dietas */
  getAll: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/dietas`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/dietas/generar — Genera plan con IA */
  generate: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/dietas/generar`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** POST /api/tenant/dietas — Guarda plan generado */
  save: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/dietas`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** DELETE /api/tenant/dietas/:id */
  remove: (token, empresaId, id) =>
    apiFetch(`${BASE_URL}/tenant/dietas/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  RUTINAS / WORKOUT PLANS
// ─────────────────────────────────────────────────────────────────────────────

export const rutinasApi = {
  /** GET /api/tenant/rutinas */
  getAll: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/rutinas`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/rutinas/generar — Genera rutina con IA */
  generate: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/rutinas/generar`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** POST /api/tenant/rutinas — Guarda rutina */
  save: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/rutinas`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  EQUIPO / TEAM
// ─────────────────────────────────────────────────────────────────────────────

export const equipoApi = {
  /** GET /api/tenant/equipo */
  getAll: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/equipo`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/equipo/invitar */
  invite: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/equipo/invitar`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** PUT /api/tenant/equipo/:id — Actualizar rol */
  updateRole: (token, empresaId, id, payload) =>
    apiFetch(`${BASE_URL}/tenant/equipo/${id}`, {
      method: 'PUT',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** DELETE /api/tenant/equipo/:id */
  remove: (token, empresaId, id) =>
    apiFetch(`${BASE_URL}/tenant/equipo/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  ANALÍTICAS
// ─────────────────────────────────────────────────────────────────────────────

export const analyticsApi = {
  /**
   * GET /api/tenant/analytics?range=month
   * Retorna: { totalPacientes, planesGenerados, citasRealizadas, tasaRetencion,
   *            pacientesPorMes[], actividadSemanal[], topPacientes[] }
   */
  getSummary: (token, empresaId, range = 'month') =>
    apiFetch(`${BASE_URL}/tenant/analytics?range=${range}`, {
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  SUSCRIPCIÓN
// ─────────────────────────────────────────────────────────────────────────────

export const suscripcionApi = {
  /** GET /api/tenant/suscripcion */
  get: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/suscripcion`, {
      headers: authHeaders(token, empresaId),
    }),

  /** GET /api/tenant/suscripcion/uso — Uso actual del plan */
  getUsage: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/suscripcion/uso`, {
      headers: authHeaders(token, empresaId),
    }),

  /** POST /api/tenant/suscripcion/cambiar — Cambiar plan */
  changePlan: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/suscripcion/cambiar`, {
      method: 'POST',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),

  /** DELETE /api/tenant/suscripcion — Cancelar */
  cancel: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/suscripcion`, {
      method: 'DELETE',
      headers: authHeaders(token, empresaId),
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN / PERFIL
// ─────────────────────────────────────────────────────────────────────────────

export const configApi = {
  /** GET /api/tenant/perfil */
  getPerfil: (token, empresaId) =>
    apiFetch(`${BASE_URL}/tenant/perfil`, {
      headers: authHeaders(token, empresaId),
    }),

  /** PUT /api/tenant/perfil */
  updatePerfil: (token, empresaId, payload) =>
    apiFetch(`${BASE_URL}/tenant/perfil`, {
      method: 'PUT',
      headers: authHeaders(token, empresaId),
      body: JSON.stringify(payload),
    }),
};
