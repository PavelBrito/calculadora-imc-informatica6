/**
 * Capa DOM de la calculadora de IMC.
 * Lee los campos, valida, calcula y pinta el resultado.
 */
import { calcularIMC, clasificarIMC } from './imc.js';

const form = document.getElementById('form-imc');
const pesoInput = document.getElementById('peso');
const estaturaInput = document.getElementById('estatura');
const imcValor = document.getElementById('imc-valor');
const imcCategoria = document.getElementById('imc-categoria');
const resultado = document.getElementById('resultado');

const CAMPOS = {
  estatura: {
    input: estaturaInput,
    error: document.getElementById('estatura-error'),
    min: 0.5,
    max: 2.5,
    nombre: 'estatura',
    unidad: 'm',
  },
  peso: {
    input: pesoInput,
    error: document.getElementById('peso-error'),
    min: 2,
    max: 300,
    nombre: 'peso',
    unidad: 'kg',
  },
};

/** Convierte coma decimal en punto (costumbre en México: 70,5 → 70.5). */
function normalizar(texto) {
  return texto.trim().replace(',', '.');
}

/** Solo dígitos con, a lo sumo, un separador decimal (punto o coma). */
function esNumeroValido(texto) {
  return /^\d+([.,]\d+)?$/.test(texto.trim());
}

function setError(campo, mensaje) {
  campo.input.setAttribute('aria-invalid', 'true');
  campo.error.textContent = mensaje;
  campo.error.hidden = false;
}

function limpiarError(campo) {
  campo.input.setAttribute('aria-invalid', 'false');
  campo.error.textContent = '';
  campo.error.hidden = true;
}

function validarCampo(campo) {
  const valor = campo.input.value.trim();

  // Campo vacío: incompleto (sin mensaje de error; el resultado queda en "—").
  if (valor === '') {
    limpiarError(campo);
    return false;
  }

  if (!esNumeroValido(valor)) {
    setError(campo, `La ${campo.nombre} debe ser un número (usa punto o coma decimal).`);
    return false;
  }

  const numero = parseFloat(normalizar(valor));
  if (numero < campo.min || numero > campo.max) {
    setError(campo, `La ${campo.nombre} debe estar entre ${campo.min} y ${campo.max} ${campo.unidad}.`);
    return false;
  }

  limpiarError(campo);
  return true;
}

function mostrarVacio() {
  imcValor.textContent = '—';
  imcCategoria.textContent = '—';
  resultado.className = 'resultado';
}

function aplicarCategoria(categoria) {
  resultado.className = 'resultado';
  const clase = {
    'Bajo peso': 'bajo-peso',
    'Peso saludable': 'saludable',
    'Sobrepeso': 'sobrepeso',
    'Obesidad': 'obesidad',
  }[categoria];
  if (clase) {
    resultado.classList.add(clase);
  }
}

function actualizar() {
  const pesoOk = validarCampo(CAMPOS.peso);
  const estaturaOk = validarCampo(CAMPOS.estatura);

  if (!pesoOk || !estaturaOk) {
    mostrarVacio();
    return;
  }

  const peso = parseFloat(normalizar(pesoInput.value));
  const estatura = parseFloat(normalizar(estaturaInput.value));
  const imc = calcularIMC(peso, estatura);
  const categoria = clasificarIMC(imc);

  imcValor.textContent = imc.toFixed(2);
  imcCategoria.textContent = categoria;
  aplicarCategoria(categoria);
}

/** Precarga los campos desde la URL (?peso=70&estatura=1.75) para capturas. */
function precargarDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const peso = params.get('peso');
  const estatura = params.get('estatura');
  if (peso !== null) pesoInput.value = peso;
  if (estatura !== null) estaturaInput.value = estatura;
}

pesoInput.addEventListener('input', actualizar);
estaturaInput.addEventListener('input', actualizar);
form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  actualizar();
});

precargarDesdeURL();
actualizar();
