/**
 * Lógica pura de cálculo del Índice de Masa Corporal (IMC).
 * Sin dependencias del DOM; pensada para ser testeable con node:test.
 *
 * Fórmula: IMC = peso / (estatura²)
 */

/**
 * Calcula el IMC a partir del peso y la estatura.
 * @param {number} peso      Peso en kilogramos.
 * @param {number} estatura  Estatura en metros.
 * @returns {number} IMC sin redondear.
 */
export function calcularIMC(peso, estatura) {
  return peso / (estatura * estatura);
}

/**
 * Redondea un número a 2 decimales.
 * @param {number} valor
 * @returns {number}
 */
export function redondear2(valor) {
  return Math.round(valor * 100) / 100;
}
