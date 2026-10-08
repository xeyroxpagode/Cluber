#!/usr/bin/env node
/**
 * Generador de Diagramas de Estados Draw.io para GEI
 * Genera 17 archivos .drawio XML válidos y editables
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('docs/uml/states/source');

// Configuración de estilo común
const STYLE = {
  state: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;fontSize=11;fontFamily=Helvetica;',
  initial: 'ellipse;whiteSpace=wrap;html=1;fillColor=#1A1A1A;strokeColor=#1A1A1A;fontSize=11;fontFamily=Helvetica;',
  final: 'ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;fontSize=11;fontFamily=Helvetica;strokeWidth=2;',
  edge: 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;fontSize=11;fontFamily=Helvetica;strokeColor=#1A1A1A;',
  edgeLabel: 'html=1;fontSize=11;fontFamily=Helvetica;align=center;verticalAlign=middle;resizable=0;points=[];',
  page: '1169x827', // A4 landscape
  grid: 20
};

// Utilidades
const newId = () => `mxCell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function createMxPoint(x, y) {
  return `<mxPoint x="${x}" y="${y}"/>`;
}

function createMxGeometry(x, y, width, height, relative = '0', as = 'geometry') {
  let geom = `<mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="${as}"`;
  if (relative === '1') geom += ` relative="1"`;
  geom += '>';
  geom += '</mxGeometry>';
  return geom;
}

function createStateCell(id, value, x, y, width, height, style = STYLE.state) {
  return `<mxCell id="${id}" value="${escapeXml(value)}" style="${style}" vertex="1" parent="1">
${createMxGeometry(x, y, width, height)}
</mxCell>`;
}

function createInitialCell(id, x, y) {
  const size = 24;
  return `<mxCell id="${id}" value="" style="${STYLE.initial}" vertex="1" parent="1">
${createMxGeometry(x, y, size, size)}
</mxCell>`;
}

function createFinalCell(id, x, y) {
  const size = 28;
  return `<mxCell id="${id}" value="" style="${STYLE.final}" vertex="1" parent="1">
${createMxGeometry(x, y, size, size)}
</mxCell>`;
}

function createEdgeCell(id, source, target, label = '', style = STYLE.edge, points = []) {
  let edge = `<mxCell id="${id}" value="${escapeXml(label)}" style="${style}" edge="1" parent="1" source="${source}" target="${target}">`;
  if (source === target) {
    // Self-loop: add waypoints for a proper loop
    edge += '<mxGeometry relative="1" as="geometry">';
    edge += '<Array as="points">';
    // Create a loop going up and around
    edge += `<mxPoint x="-60" y="-80"/>`;
    edge += `<mxPoint x="60" y="-80"/>`;
    edge += '</Array>';
    edge += '</mxGeometry>';
  } else if (points.length > 0) {
    edge += '<mxGeometry relative="1" as="geometry">';
    edge += '<Array as="points">';
    points.forEach(p => edge += createMxPoint(p.x, p.y));
    edge += '</Array>';
    edge += '</mxGeometry>';
  } else {
    edge += createMxGeometry(0, 0, 0, 0, '1');
  }
  edge += '</mxCell>';
  return edge;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

function createDrawioFile(name, cells, title) {
  const diagramXml = `<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="GEI State Diagram Generator" version="1.0" etag="state-diagram">
  <diagram name="${escapeXml(name)}" id="${newId()}">
    <mxGraphModel dx="0" dy="0" grid="1" gridSize="${STYLE.grid}" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join('\n        ')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  return diagramXml;
}

// ============================================================
// DEFINICIONES DE MÁQUINAS
// ============================================================

const MACHINES = {
  'SM-ACCOUNT-01': {
    name: 'SM-ACCOUNT-01__Account_Lifecycle',
    title: 'Account Lifecycle',
    states: [
      { id: 's1', name: 'PENDING', desc: 'Cuenta creada, esperando activación con código', x: 100, y: 300 },
      { id: 's2', name: 'ACTIVE', desc: 'Cuenta activada, credencial válida, sesiones permitidas', x: 400, y: 300 },
      { id: 's3', name: 'DISABLED', desc: 'Cuenta deshabilitada por Admin, sesiones revocadas', x: 700, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'crear cuenta (Admin)' },
      { from: 's1', to: 's2', label: 'activar con código\n[ código vigente ∧ ≤5 intentos ]\n/ cuenta ACTIVE, código consumido, auditado, sin sesión' },
      { from: 's3', to: 's2', label: 'reactivar con código nuevo\n[ código vigente ]\n/ cuenta ACTIVE, credencial versionada, auditado' },
      { from: 's2', to: 's3', label: 'deshabilitar (Admin)\n[ ADMIN ∧ ¬LAST_ADMIN_REQUIRED ]\n/ DISABLED, sesiones revocadas, auditado' },
      { from: 's2', to: 's1', label: 'restablecer acceso (Admin)\n[ ADMIN ∧ ¬LAST_ADMIN_REQUIRED ]\n/ SETUP_REQUIRED, versión++, sesiones revocadas, código nuevo' }
    ],
    prohibited: [
      'PENDING/DISABLED → sesión (inicio rechazado)',
      'ACTIVE → DISABLED si LAST_ADMIN_REQUIRED',
      'ACTIVE → PENDING (solo vía restablecer Admin)'
    ]
  },

  'SM-TEAM-01': {
    name: 'SM-TEAM-01__Team_Lifecycle',
    title: 'Team Lifecycle',
    states: [
      { id: 's1', name: 'DRAFT', desc: 'Equipo creado, combinación única validada, no disponible para afiliaciones/eventos', x: 100, y: 300 },
      { id: 's2', name: 'ACTIVE', desc: 'Equipo activado, disponible para afiliaciones, eventos, inscripciones', x: 400, y: 300 },
      { id: 's3', name: 'ARCHIVED', desc: 'Equipo archivado (terminal V1), historia conservada, eventos/inscripciones históricos', x: 700, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'registrar equipo (Admin)\n[ combinación única temporada+div+lín ]' },
      { from: 's1', to: 's2', label: 'activar (Admin)\n[ equipo DRAFT ]\n/ ACTIVE, disponible para afiliaciones/eventos' },
      { from: 's2', to: 's3', label: 'archivar (Admin)\n[ sin dependencia activa ]\n/ ARCHIVED, historia conservada' }
    ],
    prohibited: [
      'ARCHIVED → edición (rechazado)',
      'ARCHIVED → ACTIVE (restore no en V1, DEF-STR-001/002)',
      'ACTIVE → ARCHIVED con dependencia activa (rechazo nombra dependencia)',
      'Cambiar combinación temporada/div/lín (identidad inmutable)',
      'Subcomisión → cualquier gestión (denegado)'
    ]
  },

  'SM-DIVISION-01': {
    name: 'SM-DIVISION-01__Division_Lifecycle',
    title: 'Division Lifecycle',
    states: [
      { id: 's1', name: 'ACTIVE', desc: 'División creada, disponible para líneas y equipos', x: 300, y: 200 },
      { id: 's2', name: 'ARCHIVED', desc: 'División archivada (terminal V1), historia conservada', x: 300, y: 450 }
    ],
    initial: { id: 'init', target: 's1', x: 300, y: 100 },
    transitions: [
      { from: 'init', to: 's1', label: 'registrar división (Admin)' },
      { from: 's1', to: 's1', label: 'renombrar (Admin)\n[ sin equipos activos ]\n/ nombre actualizado, refs por identidad' },
      { from: 's1', to: 's2', label: 'archivar (Admin)\n[ sin dependencia activa ]\n/ ARCHIVED, historia conservada' }
    ],
    prohibited: [
      'ACTIVE → rename con equipos activos (rechazado)',
      'ACTIVE → ARCHIVED con dependencia activa (rechazo nombra dependencia)',
      'ARCHIVED → ACTIVE (restore no en V1, DEF-STR-001)',
      'Subcomisión → cualquier gestión (denegado)'
    ]
  },

  'SM-LINE-01': {
    name: 'SM-LINE-01__Line_Lifecycle',
    title: 'Line Lifecycle',
    states: [
      { id: 's1', name: 'ACTIVE', desc: 'Línea creada en división, disponible para equipos', x: 300, y: 200 },
      { id: 's2', name: 'ARCHIVED', desc: 'Línea archivada (terminal V1), historia conservada', x: 300, y: 450 }
    ],
    initial: { id: 'init', target: 's1', x: 300, y: 100 },
    transitions: [
      { from: 'init', to: 's1', label: 'registrar línea (Admin)\n[ división padre existe ]' },
      { from: 's1', to: 's1', label: 'renombrar (Admin)\n[ sin equipos activos ]\n/ nombre actualizado, refs por identidad' },
      { from: 's1', to: 's2', label: 'archivar (Admin)\n[ sin dependencia activa ]\n/ ARCHIVED, historia conservada' }
    ],
    prohibited: [
      'ACTIVE → rename con equipos activos (rechazado)',
      'ACTIVE → ARCHIVED con dependencia activa (rechazo nombra dependencia)',
      'ARCHIVED → ACTIVE (restore no en V1, DEF-STR-002)',
      'Subcomisión → cualquier gestión (denegado)'
    ]
  },

  'SM-VENUE-01': {
    name: 'SM-VENUE-01__Venue_Lifecycle',
    title: 'Venue Lifecycle',
    states: [
      { id: 's1', name: 'ACTIVE', desc: 'Sede creada, identidad estable por ID, disponible para eventos', x: 300, y: 200 },
      { id: 's2', name: 'ARCHIVED', desc: 'Sede archivada (terminal V1), eventos históricos conservados', x: 300, y: 450 }
    ],
    initial: { id: 'init', target: 's1', x: 300, y: 100 },
    transitions: [
      { from: 'init', to: 's1', label: 'registrar sede (Admin)' },
      { from: 's1', to: 's1', label: 'corregir datos identidad (Admin)\n[ Regla A: sin efectos coordinación ]\n/ dato corregido, sin reprogramar, sin notificar' },
      { from: 's1', to: 's2', label: 'archivar (Admin)\n[ sin dependencia activa ]\n/ ARCHIVED, eventos históricos conservados' }
    ],
    prohibited: [
      'Cambiar sede de evento (eso es UC-EVT-04 Regla B, cambio material)',
      'ACTIVE → ARCHIVED con dependencia activa (rechazo)',
      'ARCHIVED → ACTIVE (restore no en V1)',
      'Subcomisión → cualquier gestión (denegado)'
    ]
  },

  'SM-EVENT-01': {
    name: 'SM-EVENT-01__Event_Lifecycle',
    title: 'Event Lifecycle (incluye subtipo Match)',
    states: [
      { id: 's1', name: 'DRAFT', desc: 'Borrador transitorio (atómico a SCHEDULED)', x: 100, y: 150 },
      { id: 's2', name: 'SCHEDULED', desc: 'Programado con horario vigente, acepta disponibilidad/convocatoria/asistencia', x: 300, y: 300 },
      { id: 's3', name: 'POSTPONED', desc: 'Aplazado, sin horario, conserva respuestas, no acepta nuevas', x: 550, y: 150 },
      { id: 's4', name: 'CANCELLED', desc: 'Cancelado (terminal participación), composición propia, consecuencia explicada', x: 550, y: 450 },
      { id: 's5', name: 'IN_PROGRESS', desc: 'En curso (inicio operacional)', x: 300, y: 500 },
      { id: 's6', name: 'COMPLETED', desc: 'Finalizado (terminal absoluto), no se reabre, habilita resultado PLAYED/FORFEIT', x: 100, y: 450 },
      { id: 's7', name: 'ABANDONED', desc: 'Abandonado (solo Match, terminal), resultado ABANDONED, sin estadísticas reales', x: 750, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 50 },
    transitions: [
      { from: 'init', to: 's1', label: 'crear evento (Coach/Subcomisión)' },
      { from: 's1', to: 's2', label: 'programar (atómico)\n[ autoridad + destinatarios válidos + invariantes ]\n/ SCHEDULED sin borrador observable' },
      { from: 's2', to: 's3', label: 'posponer\n[ SCHEDULED ∧ autoridad ]\n/ POSTPONED sin horario, respuestas conservadas, no nuevas, coord_rev++, notifica' },
      { from: 's3', to: 's2', label: 'reanudar\n[ POSTPONED ∧ autoridad ∧ invariantes ]\n/ SCHEDULED con horario, disponibilidad reabierta, notifica' },
      { from: 's2', to: 's4', label: 'cancelar\n[ SCHEDULED ∧ autoridad ]\n/ CANCELLED terminal participación, notifica cancelación' },
      { from: 's3', to: 's4', label: 'cancelar\n[ POSTPONED ∧ autoridad ]\n/ CANCELLED terminal participación, notifica cancelación' },
      { from: 's4', to: 's2', label: 'restaurar\n[ CANCELLED ∧ autoridad ]\n/ SCHEDULED con horario, coord_rev++, notifica restauración' },
      { from: 's2', to: 's5', label: 'inicio operacional\n[ horario vigente alcanzado ]\n/ IN_PROGRESS' },
      { from: 's5', to: 's6', label: 'completar\n[ ciclo permite COMPLETED ∧ autoridad ]\n/ COMPLETED terminal, no se reabre, habilita PLAYED/FORFEIT' },
      { from: 's5', to: 's7', label: 'abandonar (solo Match)\n[ IN_PROGRESS ∧ Match ∧ autoridad ]\n/ ABANDONED terminal, resultado ABANDONED, sin stats reales' },
      { from: 's2', to: 's2', label: 'editar no material\n[ ≠COMPLETED ∧ campos no coordinativos ]\n/ corrección registrada, sin coord_rev++, sin notif' },
      { from: 's2', to: 's2', label: 'editar material\n[ ≠COMPLETED ∧ campo material ]\n/ coord_rev++ en afectadas, NEEDS_RECONFIRMATION, notifica unión audiencias' },
      { from: 's3', to: 's3', label: 'editar no material\n[ POSTPONED ∧ campos no coordinativos ]\n/ corrección sin efectos coordinación' },
      { from: 's4', to: 's4', label: 'editar no material\n[ CANCELLED ]\n/ corrección registrada' },
      { from: 'any', to: 'any', label: 'resolver conflicto concurrente\n[ STALE_VERSION ]\n/ reconciliar campo a campo, sin fusión automática' }
    ],
    prohibited: [
      'DRAFT → disponibilidad (rechazado, REQ-PRT-004)',
      'POSTPONED → nueva disponibilidad (conserva, no acepta)',
      'CANCELLED/COMPLETED/ABANDONED → disponibilidad/edición/convocatoria (terminal)',
      'COMPLETED → SCHEDULED (reabrir prohibido, PT §9)',
      'SCHEDULED Match → cambiar equipo (inmutable, REQ-EVT-006)',
      'Training/ClubEvent → ABANDONED (solo Match)'
    ]
  },

  'SM-EVENTSERIES-01': {
    name: 'SM-EVENTSERIES-01__EventSeries_Lifecycle',
    title: 'EventSeries Lifecycle',
    states: [
      { id: 's1', name: 'ACTIVE', desc: 'Serie vigente con ocurrencias programadas (máx 366)', x: 300, y: 200 },
      { id: 's2', name: 'ENDED', desc: 'Serie finalizada (terminal), ocurrencias conservadas', x: 300, y: 450 }
    ],
    initial: { id: 'init', target: 's1', x: 300, y: 100 },
    transitions: [
      { from: 'init', to: 's1', label: 'crear serie (Coach/Subcomisión)\n[ ≤366 ocurrencias ∧ destinatarios válidos ]' },
      { from: 's1', to: 's2', label: 'finalizar serie (Coach/Subcomisión)\n[ ACTIVE ]\n/ ENDED, ocurrencias conservadas, sin inversa' },
      { from: 's1', to: 's1', label: 'editar ocurrencias (Coach/Subcomisión)\n[ 3 alcances: solo esta / esta+y siguientes / toda ]\n/ impacto en conjunto real, coord_rev++ en afectadas' }
    ],
    prohibited: [
      'Crear serie >366 ocurrencias (RECURRENCE_TOO_LARGE)',
      'ENDED → ACTIVE (sin transición inversa)',
      'ENDED → editar (terminal)'
    ]
  },

'SM-AVAILABILITY-01': {
    name: 'SM-AVAILABILITY-01__Availability_State_Model',
    title: 'Availability State Model (Persistidos + Derivados)',
    states: [
      { id: 's1', name: 'YES', desc: 'Respuesta registrada SI con fecha, visible en conteo', x: 100, y: 200 },
      { id: 's2', name: 'MAYBE', desc: 'Respuesta registrada QUIZAS con fecha, visible en conteo', x: 300, y: 200 },
      { id: 's3', name: 'NO', desc: 'Respuesta registrada NO con fecha, visible en conteo', x: 500, y: 200 },
      { id: 'd1', name: 'NO_RESPONSE', desc: 'DERIVADO: ausencia de fila en availabilities', x: 100, y: 420 },
      { id: 'd2', name: 'NEEDS_RECONFIRMATION', desc: 'DERIVADO: respuesta previa + event.coord_rev > avail.coord_rev', x: 300, y: 420 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 100 },
    transitions: [
      { from: 'init', to: 's1', label: 'primera respuesta -> YES' },
      { from: 's1', to: 's2', label: 'responder QUIZAS\n[ SCHEDULED AND autoridad ]\n/ sustituye anterior' },
      { from: 's1', to: 's3', label: 'responder NO\n[ SCHEDULED AND autoridad ]\n/ sustituye anterior' },
      { from: 's2', to: 's1', label: 'responder SI\n[ SCHEDULED AND autoridad ]\n/ sustituye anterior' },
      { from: 's2', to: 's3', label: 'responder NO\n[ SCHEDULED AND autoridad ]\n/ sustituye anterior' },
      { from: 's3', to: 's1', label: 'responder SI\n[ SCHEDULED AND autoridad ]\n/ sustituye anterior' },
      { from: 's3', to: 's2', label: 'responder QUIZAS\n[ SCHEDULED AND autoridad ]\n/ sustituye anterior' },
      { from: 's1', to: 'd1', label: '(sin respuesta previa)\n/ estado derivado NO_RESPONSE' },
      { from: 'd1', to: 's1', label: 'responder SI\n[ SCHEDULED AND (PLAYER OR Guardian.can_respond) ]\n/ fila creada YES' },
      { from: 'd1', to: 's2', label: 'responder QUIZAS\n[ mismos guards ]\n/ fila creada MAYBE' },
      { from: 'd1', to: 's3', label: 'responder NO\n[ mismos guards ]\n/ fila creada NO' },
      { from: 's1', to: 'd2', label: 'cambio material previo\n/ deriva NEEDS_RECONFIRMATION' },
      { from: 'd2', to: 's1', label: 'reconfirmar SI\n[ SCHEDULED AND autoridad ]\n/ sustituye, deja NEEDS_RECONFIRMATION' },
      { from: 'd2', to: 's2', label: 'reconfirmar QUIZAS\n[ SCHEDULED AND autoridad ]\n/ sustituye, deja NEEDS_RECONFIRMATION' },
      { from: 'd2', to: 's3', label: 'reconfirmar NO\n[ SCHEDULED AND autoridad ]\n/ sustituye, deja NEEDS_RECONFIRMATION' }
    ],
    prohibited: [
      'Responder en DRAFT/CANCELLED/COMPLETED/ABANDONADO (solo SCHEDULED)',
      'POSTPONED -> nueva respuesta (conserva, no acepta)',
      'Actor sin PLAYER ni Guardian.can_respond -> denegado',
      'Evento no alcanza a menor -> rechazado',
      'NO_RESPONSE no es estado persistido (no hay fila -> YES/MAYBE/NO)',
      'NO_RESPONSE -> YES/MAYBE/NO no es transicion (es creacion de fila)'
    ]
  },

  'SM-SELECTIONREV-01': {
    name: 'SM-SELECTIONREV-01__SelectionRevision_Lifecycle',
    title: 'SelectionRevision Lifecycle',
    states: [
      { id: 's1', name: 'DRAFT', desc: 'Borrador editable con guardado automático (5 estados), refresco no pisa escrito', x: 200, y: 300 },
      { id: 's2', name: 'PUBLISHED', desc: 'Revisión inmutable publicada, no se reescribe, republicar = nueva revisión', x: 500, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 200, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'preparar convocatoria (Coach)\n[ SCHEDULED ∧ MATCH ∧ autoridad ]' },
      { from: 's1', to: 's2', label: 'publicar convocatoria (Coach)\n[ SCHEDULED ∧ borrador completo ]\n/ revisión inmutable, notifica +/- vs anterior, conflictos derivados visibles, publicación prospera' },
      { from: 's2', to: 's2', label: 'republicar (Coach)\n/ nueva revisión PUBLISHED distinta, anterior inmutable conservada' }
    ],
    prohibited: [
      'PUBLISHED → editar/borrar/modificar (inmutable)',
      'Publicar si evento ≠ SCHEDULED o ≠ MATCH',
      'Bloquear publicación por conflictos derivados (publica igual, REQ-PRT-006)'
    ]
  },

  'SM-ATTENDANCEENTRY-01': {
    name: 'SM-ATTENDANCEENTRY-01__AttendanceEntry_State_Model',
    title: 'AttendanceEntry State Model',
    states: [
      { id: 's1', name: 'PRESENT', desc: 'Valor persistido con timestamp', x: 100, y: 200 },
      { id: 's2', name: 'ABSENT', desc: 'Valor persistido con timestamp', x: 300, y: 200 },
      { id: 's3', name: 'JUSTIFIED', desc: 'Valor persistido con timestamp', x: 500, y: 200 },
      { id: 'd1', name: 'UNRECORDED', desc: 'DERIVADO: sin fila en attendance_entries para persona/evento', x: 300, y: 400 }
    ],
    initial: { id: 'init', target: 'd1', x: 300, y: 80 },
    transitions: [
      { from: 'init', to: 'd1', label: 'inicial (sin fila)' },
      { from: 'd1', to: 's1', label: 'registrar PRESENTE\n[ OPEN ∧ SCHEDULED/IN_PROGRESS ∧ TRAINING/MATCH ∧ Coach ]\n/ fila creada, persistencia inmediata' },
      { from: 'd1', to: 's2', label: 'registrar AUSENTE\n[ mismos guards ]\n/ fila creada' },
      { from: 'd1', to: 's3', label: 'registrar JUSTIFICADO\n[ mismos guards ]\n/ fila creada' },
      { from: 's1', to: 's1', label: 'corregir\n[ motivo obligatorio ∧ Coach ]\n/ anterior+nuevo+motivo+autor+fecha persistidos, antes/después visibles' },
      { from: 's2', to: 's2', label: 'corregir\n[ mismo guard ]\n/ auditoría completa' },
      { from: 's3', to: 's3', label: 'corregir\n[ mismo guard ]\n/ auditoría completa' }
    ],
    prohibited: [
      'Marcar en planilla CLOSED (requiere corrección UC-PRT-07)',
      'CLOSED → OPEN (reapertura no requisito, corrección la cubre)',
      'Evento tipo no admite asistencia (matriz REQ-PRT-019)'
    ]
  },

  'SM-MATCHRECORD-01': {
    name: 'SM-MATCHRECORD-01__MatchRecord_Lifecycle',
    title: 'MatchRecord Lifecycle',
    states: [
      { id: 's1', name: 'DRAFT', desc: 'Borrador de resultado, editable', x: 200, y: 300 },
      { id: 's2', name: 'FINAL', desc: 'Resultado final oficial (terminal vía normal), habilita stats PLAYED, partidos jugados derivados', x: 500, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 200, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'registrar resultado (Coach)\n[ MATCH ∧ ciclo compatible: PLAYED/FORFEIT⇒COMPLETED, ABANDONED⇒ABANDONED ]' },
      { from: 's1', to: 's2', label: 'finalizar resultado (Coach)\n[ DRAFT ∧ ciclo permite ∧ autoridad ]\n/ FINAL terminal, habilita stats PLAYED, partidos jugados derivados' },
      { from: 's2', to: 's2', label: 'corregir resultado (Coach)\n[ FINAL ∧ motivo obligatorio ]\n/ anterior+nuevo+motivo+autor+fecha, marcador visible con evidencia, NO transición inversa' }
    ],
    prohibited: [
      'FINAL → DRAFT (editar vía normal prohibido)',
      'Crear/finalizar si ciclo Event incompatible (MATCH_STATE_INCOMPATIBLE)',
      'Admin → registrar resultado (sin autoridad deportiva)',
      'Corregir sin motivo (operación no completa)'
    ]
  },

  'SM-ELIGIBILITY-01': {
    name: 'SM-ELIGIBILITY-01__EligibilityConstraint_State_Model',
    title: 'EligibilityConstraint State Model',
    states: [
      { id: 's1', name: 'PENDING', desc: 'Restricción registrada pendiente de resolución', x: 150, y: 300 },
      { id: 's2', name: 'BLOCKED', desc: 'Restricción activa que bloquea participación', x: 450, y: 300 },
      { id: 'd1', name: 'ELIGIBLE', desc: 'DERIVADO: sin restricción activa aplicable (now ∉ [validFrom,validUntil) con BLOCKED)', x: 300, y: 100 }
    ],
    initial: { id: 'init', target: 'd1', x: 300, y: 20 },
    transitions: [
      { from: 'init', to: 'd1', label: 'inicial (sin restricción activa)' },
      { from: 'd1', to: 's1', label: 'registrar restricción (Subcomisión/Admin)\n[ estado=PENDING ∧ alcance/origen/motivo/vigencia ]\n/ fila creada, mutación auditada' },
      { from: 'd1', to: 's2', label: 'registrar restricción (Subcomisión/Admin)\n[ estado=BLOCKED ∧ alcance/origen/motivo/vigencia ]\n/ fila creada, mutación auditada' },
      { from: 's1', to: 's2', label: 'cambiar estado a BLOCKED\n[ actualización por autoridad ]' },
      { from: 's2', to: 's1', label: 'cambiar estado a PENDING\n[ actualización por autoridad ]' },
      { from: 's1', to: 'd1', label: 'vigencia expirada (now > validUntil)\n/ ya no aplica, ELIGIBLE derivado' },
      { from: 's2', to: 'd1', label: 'vigencia expirada (now > validUntil)\n/ ya no aplica, ELIGIBLE derivado' }
    ],
    prohibited: [
      'Registrar por actor ≠ Subcomisión/Admin (denegado)',
      'Coach consulta motivo/origen (solo estado + alcance)'
    ]
  },

  'SM-ANNOUNCEMENT-01': {
    name: 'SM-ANNOUNCEMENT-01__Announcement_Lifecycle',
    title: 'Announcement Lifecycle',
    states: [
      { id: 's1', name: 'DRAFT', desc: 'Borrador con título, cuerpo, audiencia (conjunto real equipos/club)', x: 100, y: 300 },
      { id: 's2', name: 'PUBLISHED', desc: 'Publicado, audiencia snapshot inmutable, notifica alcanzados', x: 400, y: 300 },
      { id: 's3', name: 'ARCHIVED', desc: 'Archivado, deja de estar vigente, contenido e historia conservados', x: 700, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'redactar (Subcomisión)\n[ audiencia conjunto real equipos/club ]' },
      { from: 's1', to: 's2', label: 'publicar (Subcomisión)\n[ DRAFT ∧ audiencia válida ]\n/ PUBLISHED, audiencia snapshot inmutable, notifica tipo distinguible' },
      { from: 's2', to: 's2', label: 'corregir título/cuerpo (Subcomisión)\n[ PUBLISHED ∧ motivo ]\n/ título/cuerpo corregidos, audiencia NO cambia, texto anterior en historia' },
      { from: 's2', to: 's3', label: 'archivar (Subcomisión)\n[ PUBLISHED ]\n/ ARCHIVED, deja de estar vigente, historia conservada' }
    ],
    prohibited: [
      'PUBLISHED → cambiar audiencia (snapshot inmutable, REQ-COM-003)',
      'Corregir audiencia en PUBLISHED (corresponde comunicado nuevo, REQ-COM-004 AC3)',
      'Actor ≠ Subcomisión → publicar/corregir/archivar (denegado)',
      'No en audiencia → consultar (recurso no disponible, REQ-COM-005)',
      'ARCHIVED → PUBLISHED (no en V1)'
    ]
  },

  'SM-CONVERSATION-GROUP-01': {
    name: 'SM-CONVERSATION-GROUP-01__Conversation_GROUP_Lifecycle',
    title: 'Conversation (GROUP) Lifecycle',
    states: [
      { id: 's1', name: 'ACTIVE', desc: 'Grupo creado, ≥2 participantes, título, miembros con joined_at/left_at', x: 300, y: 200 },
      { id: 's2', name: 'ARCHIVED', desc: 'Archivado por participante, contenido y períodos conservados', x: 300, y: 450 }
    ],
    initial: { id: 'init', target: 's1', x: 300, y: 100 },
    transitions: [
      { from: 'init', to: 's1', label: 'crear grupo (derecho comunicacional)\n[ PLAYER/CAPTAIN/COACH ∧ ≥2 part. ∧ título ∧ candidatos legítimos ]' },
      { from: 's1', to: 's2', label: 'archivar grupo (participante)\n[ ACTIVE ∧ participa ∧ confirmación ]\n/ ARCHIVED, contenido y períodos conservados' }
    ],
    prohibited: [
      'Archivar si actor no participa (denegado)',
      'Archivar DIRECT/TEAM/EVENT (solo GROUP archivable, REQ-COM-007 AC4)',
      'Enviar/Editar/Eliminar en ARCHIVED (solo lectura histórico)'
    ]
  },

  'SM-MESSAGE-01': {
    name: 'SM-MESSAGE-01__Message_Lifecycle',
    title: 'Message Lifecycle',
    states: [
      { id: 's1', name: 'SENT', desc: 'Mensaje persistido visible para participantes autorizados', x: 100, y: 300 },
      { id: 's2', name: 'EDITED', desc: 'Mensaje corregido ≥1 vez, historia expuesta con fecha real y actor', x: 300, y: 300 },
      { id: 's3', name: 'DELETED', desc: 'Tombstone irreversible, contenido desaparece, hecho de existencia/borrado permanece', x: 500, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'enviar mensaje (participante)\n[ participa ∧ acceso vigente ]\n/ persistido visible' },
      { from: 's1', to: 's2', label: 'editar propio (autor)\n[ mensaje propio ∧ acceso vigente ]\n/ corrección aplicada, historia expuesta' },
      { from: 's2', to: 's2', label: 'editar propio (otra vez)\n[ mismo guard ]\n/ permanece EDITED, historia acumulada' },
      { from: 's1', to: 's3', label: 'eliminar propio (autor)\n[ confirmación + motivo ]\n/ TOMBSTONE irreversible, contenido desaparece' },
      { from: 's2', to: 's3', label: 'eliminar propio (autor)\n[ confirmación + motivo ]\n/ TOMBSTONE irreversible' }
    ],
    prohibited: [
      'Editar/Eliminar mensaje ajeno (solo propios)',
      'Eliminar sin confirmación+motivo (no ejecuta)',
      'DELETED → cualquier transición (tombstone irreversible)'
    ]
  },

  'SM-COMPETITION-01': {
    name: 'SM-COMPETITION-01__Competition_Lifecycle',
    title: 'Competition Lifecycle',
    states: [
      { id: 's1', name: 'DRAFT', desc: 'Competencia registrada, no admite inscripciones', x: 100, y: 300 },
      { id: 's2', name: 'ACTIVE', desc: 'Abierta para inscripciones de equipos/líneas', x: 400, y: 300 },
      { id: 's3', name: 'CLOSED', desc: 'Cerrada (terminal V1), histórico conservado', x: 700, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'registrar competencia (Subcomisión/Admin)' },
      { from: 's1', to: 's2', label: 'activar (Subcomisión/Admin)\n[ DRAFT ]\n/ ACTIVE, admite inscripciones' },
      { from: 's2', to: 's3', label: 'cerrar (Subcomisión/Admin)\n[ ACTIVE ∧ 0 inscripciones activas ]\n/ CLOSED, histórico conservado' }
    ],
    prohibited: [
      'Cerrar con inscripciones activas >0 (rechazo explicándolas, UC-CMP-03 alt 2.1)',
      'CLOSED → ACTIVE (no en V1)',
      'Actor ≠ Subcomisión/Admin → gestionar (denegado)'
    ]
  },

  'SM-COMPETITIONENTRY-01': {
    name: 'SM-COMPETITIONENTRY-01__CompetitionEntry_Lifecycle',
    title: 'CompetitionEntry Lifecycle (scopes TEAM/LINE son datos, no estados)',
    states: [
      { id: 's1', name: 'PENDING', desc: 'Inscripción registrada, pendiente activación. scope=TEAM (team_id) o scope=LINE (div+lín+temp)', x: 100, y: 300 },
      { id: 's2', name: 'ACTIVE', desc: 'Inscripción activa, usable por partidos de esa competencia', x: 400, y: 300 },
      { id: 's3', name: 'ENDED', desc: 'Finalizada, histórico conservado, consecuencia explicada', x: 700, y: 300 }
    ],
    initial: { id: 'init', target: 's1', x: 100, y: 200 },
    transitions: [
      { from: 'init', to: 's1', label: 'inscribir equipo (Subcomisión/Admin)\n[ ACTIVE ∧ equipo existe ]\n/ scope=TEAM PENDING por team_id' },
      { from: 'init', to: 's1', label: 'inscribir línea (Subcomisión/Admin)\n[ ACTIVE ∧ línea existe ∧ temporada válida ]\n/ scope=LINE PENDING por div+lín+temp' },
      { from: 's1', to: 's2', label: 'activar inscripción (Subcomisión/Admin)\n[ PENDING ∧ alcance compatible ]\n/ ACTIVE, usable por partidos' },
      { from: 's2', to: 's3', label: 'finalizar inscripción (Subcomisión/Admin)\n[ ACTIVE ∧ serialización si en uso ]\n/ ENDED, consecuencia explicada, histórico conservado' }
    ],
    prohibited: [
      'Usar en partido si PENDING (requiere ACTIVE)',
      'Cambiar scope TEAM↔LINE (incompatibles, COMPETITION_SCOPE_MISMATCH)',
      'ENDED → ACTIVE (no en V1)',
      'Finalizar sin serializar si en uso (REQ-SYS-018)'
    ]
  }
};

// ============================================================
// GENERACIÓN
// ============================================================

function generateMachine(machineDef) {
  const cells = [];
  const idMap = {};

  // Initial pseudostate
  cells.push(createInitialCell(machineDef.initial.id, machineDef.initial.x, machineDef.initial.y));

  // States
  machineDef.states.forEach(s => {
    idMap[s.id] = s.id;
    const isDerived = s.id.startsWith('d');
    const style = isDerived ? STYLE.state + 'dashed=1;fillColor=#F5F5F5;' : STYLE.state;
    const width = isDerived ? 220 : 180;
    const height = 80;
    cells.push(createStateCell(s.id, s.name + (s.desc ? '\n' + s.desc : ''), s.x, s.y, width, height, style));
  });

  // Final pseudostates for terminal states (only for machines with absolute terminals)
  const terminalStates = machineDef.states.filter(s => 
    s.desc && (s.desc.includes('terminal absoluto') || s.desc.includes('terminal V1') || s.desc.includes('terminal participación') || s.desc.includes('inmutable'))
  );
  
  // Transitions
  machineDef.transitions.forEach((t, i) => {
    const edgeId = `edge_${i}`;
    let sourceId = t.from;
    let targetId = t.to;
    
    // Handle 'any' source/target for concurrent conflict resolution
    if (t.from === 'any' && t.to === 'any') {
      // Self-loop on all non-terminal states
      machineDef.states.filter(s => !s.id.startsWith('d') && !s.desc?.includes('terminal')).forEach(s => {
        cells.push(createEdgeCell(`${edgeId}_${s.id}`, s.id, s.id, t.label, STYLE.edge + 'dashed=1;'));
      });
      return;
    }

    if (!idMap[sourceId] && sourceId !== machineDef.initial.id) return;
    if (!idMap[targetId]) return;

    const source = sourceId === machineDef.initial.id ? machineDef.initial.id : sourceId;
    const target = targetId;

    // Calculate waypoints for better routing
    const sourceState = machineDef.states.find(s => s.id === source) || { x: machineDef.initial.x, y: machineDef.initial.y };
    const targetState = machineDef.states.find(s => s.id === target);
    
    let points = [];
    if (sourceState && targetState && source !== target) {
      // Add a midpoint for cleaner orthogonal routing
      const midX = (sourceState.x + targetState.x) / 2;
      const midY = (sourceState.y + targetState.y) / 2;
      points = [
        { x: midX, y: sourceState.y },
        { x: midX, y: targetState.y }
      ];
    }

    cells.push(createEdgeCell(edgeId, source, target, t.label, STYLE.edge, points));
  });

  // Prohibited transitions note (as a text shape)
  if (machineDef.prohibited && machineDef.prohibited.length > 0) {
    const noteId = newId();
    const noteText = 'TRANSICIONES PROHIBIDAS (no dibujadas como flechas):\n• ' + machineDef.prohibited.join('\n• ');
    cells.push(`<mxCell id="${noteId}" value="${escapeXml(noteText)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#F57F17;fontSize=10;fontFamily=Helvetica;strokeWidth=1;dashed=1;" vertex="1" parent="1">
${createMxGeometry(800, 50, 350, 100)}
</mxCell>`);
  }

  // Title
  const titleId = newId();
  cells.push(`<mxCell id="${titleId}" value="${escapeXml(machineDef.title)}" style="html=1;fontSize=14;fontFamily=Helvetica;fontStyle=1;align=center;" vertex="1" parent="1">
${createMxGeometry(50, 20, 400, 30)}
</mxCell>`);

  return createDrawioFile(machineDef.name, cells, machineDef.title);
}

// Generar todos
Object.entries(MACHINES).forEach(([smId, def]) => {
  const xml = generateMachine(def);
  const filePath = path.join(OUTPUT_DIR, `${def.name}.drawio`);
  fs.writeFileSync(filePath, xml);
  console.log(`✓ Generado: ${def.name}.drawio`);
});

console.log('\n✅ Generación completada: 17 diagramas en docs/uml/states/source/');