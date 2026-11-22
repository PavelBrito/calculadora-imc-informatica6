import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularIMC, clasificarIMC, redondear2 } from '../js/imc.js';

test('calcularIMC usa la fórmula peso / estatura²', () => {
  assert.strictEqual(calcularIMC(70, 1.75), 70 / (1.75 * 1.75));
  assert.strictEqual(calcularIMC(70, 1.7), 70 / (1.7 * 1.7));
});

test('calcularIMC redondeado a 2 decimales da 22.86 para 70 kg / 1.75 m', () => {
  assert.strictEqual(redondear2(calcularIMC(70, 1.75)), 22.86);
});

test('clasificarIMC: bajo peso (< 18.5)', () => {
  assert.strictEqual(clasificarIMC(18.49), 'Bajo peso');
});

test('clasificarIMC: límite bajo peso / saludable en 18.5', () => {
  assert.strictEqual(clasificarIMC(18.5), 'Peso saludable');
});

test('clasificarIMC: límite saludable / sobrepeso en 24.9 y 25.0', () => {
  assert.strictEqual(clasificarIMC(24.9), 'Peso saludable');
  assert.strictEqual(clasificarIMC(25.0), 'Sobrepeso');
});

test('clasificarIMC: 24.95 se clasifica como Sobrepeso (decisión documentada)', () => {
  assert.strictEqual(clasificarIMC(24.95), 'Sobrepeso');
});

test('clasificarIMC: límite sobrepeso / obesidad en 29.9 y 30.0', () => {
  assert.strictEqual(clasificarIMC(29.9), 'Sobrepeso');
  assert.strictEqual(clasificarIMC(30.0), 'Obesidad');
});

test('clasificarIMC: categorías intermedias', () => {
  assert.strictEqual(clasificarIMC(17.0), 'Bajo peso');
  assert.strictEqual(clasificarIMC(22.0), 'Peso saludable');
  assert.strictEqual(clasificarIMC(27.5), 'Sobrepeso');
  assert.strictEqual(clasificarIMC(35.0), 'Obesidad');
});
