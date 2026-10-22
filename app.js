'use strict';

/**
 * Interruptor global de depuración. Si es false, el sistema no escribe nada en consola.
 * @type {boolean}
 */
const _DEBUGMODE = true;

/**
 * Dotaciones (ambulancias/camiones) disponibles al empezar el turno.
 * @type {number}
 */
const RECURSOS_INICIALES = 6;

/**
 * @typedef {object} Incidente
 * @property {number} id - Identificador único del incidente.
 * @property {string} descripcion - Descripción del suceso.
 * @property {number|string} gravedad - Gravedad de 1 (leve) a 5 (máxima); puede llegar como texto.
 * @property {boolean} resuelta - Indica si el incidente ya está resuelto.
 */

/**
 * Lote de incidentes del turno.
 * @type {Incidente[]}
 */
const loteIncidentes = [
    { id: 101, descripcion: "Gato atrapado en un árbol", gravedad: 1, resuelta: false },
    { id: 102, descripcion: "Falsa alarma de humo en local", gravedad: 2, resuelta: true },
    { id: 103, descripcion: "Incendio estructural en bloque de viviendas", gravedad: "5", resuelta: false },
    { id: 104, descripcion: "Contenedor ardiendo en la vía pública", gravedad: 3, resuelta: false },
    { id: 105, descripcion: "Inundación leve de un sótano", gravedad: 2, resuelta: true },
    { id: 106, descripcion: "Accidente de tráfico múltiple en la A-4", gravedad: 5, resuelta: false },
    { id: 107, descripcion: "Rescate en ascensor bloqueado", gravedad: 2, resuelta: false }
];

/**
 * Escribe un mensaje en consola solo si _DEBUGMODE está activo.
 * @param {string} mensaje - Texto ya formateado con template literals.
 * @param {'info'|'warn'|'error'} [nivel] - Nivel de consola (por defecto 'info').
 * @returns {void}
 */
function registrar(mensaje, nivel = 'info') {
    if (!_DEBUGMODE) {
        return;
    }
    switch (nivel) {
        case 'error':
            console.error(mensaje);
            break;
        case 'warn':
            console.warn(mensaje);
            break;
        default:
            console.log(mensaje);
    }
}

/**
 * Calcula cuántas dotaciones necesita un incidente según su gravedad.
 * @param {number} gravedad - Gravedad del incidente (1-5).
 * @returns {number} Dotaciones necesarias.
 */
function calcularRecursos(gravedad) {
    if (gravedad === 5) {
        return 3;
    } else if (gravedad >= 3) {
        return 2;
    }
    return 1;
}

/**
 * Evalúa un incidente, emite su parte por consola y calcula las dotaciones asignadas.
 * @param {Incidente} incidente - Incidente pendiente de atender.
 * @param {number} disponibles - Dotaciones libres en el parque.
 * @returns {number} Dotaciones asignadas.
 */
function procesarIncidente(incidente, disponibles) {
    const gravedad = incidente.gravedad; // BUG: no se convierte a número

    switch (gravedad) {
        case 5:
            registrar(`🚨 ALERTA MÁXIMA [#${incidente.id}] ${incidente.descripcion} (gravedad ${gravedad}/5)`, 'error');
            break;
        case 4:
        case 3:
            registrar(`🟠 [#${incidente.id}] ${incidente.descripcion} (gravedad ${gravedad}/5)`, 'warn');
            break;
        default:
            registrar(`🟢 [#${incidente.id}] ${incidente.descripcion} (gravedad ${gravedad}/5)`);
    }

    const asignados = Math.min(calcularRecursos(gravedad), disponibles);
    registrar(`   ↳ Dotaciones asignadas: ${asignados} (quedan ${disponibles - asignados})`);
    return asignados;
}

/**
 * Recorre el lote: omite los resueltos (continue) y detiene el sistema sin recursos (break).
 * @param {Incidente[]} lote - Incidentes a gestionar.
 * @param {number} recursosIniciales - Dotaciones al inicio del turno.
 * @returns {number} Dotaciones que quedan al terminar.
 */
function gestionarEmergencias(lote, recursosIniciales) {
    let recursos = recursosIniciales;
    registrar(`=== Inicio de turno: ${lote.length} incidentes, ${recursos} dotaciones ===`);

    for (let i = 0; i < lote.length; i++) {
        const incidente = lote[i];

        if (recursos === 0) {
            registrar(`⛔ Sin dotaciones. Sistema detenido antes del incidente #${incidente.id}`, 'error');
            break;
        }

        if (incidente.resuelta === true) {
            registrar(`✔️ [#${incidente.id}] Ya resuelta, se omite`);
            continue;
        }

        recursos -= procesarIncidente(incidente, recursos);
    }

    registrar(`=== Fin de turno: quedan ${recursos} dotaciones ===`);
    return recursos;
}

gestionarEmergencias(loteIncidentes, RECURSOS_INICIALES);