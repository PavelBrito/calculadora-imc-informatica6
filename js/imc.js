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

/**
 * Clasifica el IMC en una categoría.
 *
 * Decisión de redondeo (documentada en el README): la clasificación se hace
 * sobre el valor redondeado a 2 decimales para evitar artefactos de coma
 * flotante. La tabla de interpretación usa cortes con un decimal (24.9 / 25.0);
 * el único valor de 2 decimales que queda entre ambos es 24.95 y, como es
 * mayor que 24.9, se clasifica como "Sobrepeso" (24.95 → Sobrepeso).
 *
 * @param {number} imc Valor de IMC.
 * @returns {string} 'Bajo peso' | 'Peso saludable' | 'Sobrepeso' | 'Obesidad'
 */
export function clasificarIMC(imc) {
  const imc2 = redondear2(imc);
  if (imc2 < 18.5) {
    return 'Bajo peso';
  } else if (imc2 <= 24.9) {
    return 'Peso saludable';
  } else if (imc2 <= 29.9) {
    return 'Sobrepeso';
  } else {
    return 'Obesidad';
  }
}
