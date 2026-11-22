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
const marcador = document.getElementById('escala-marcador');
const mascota = document.getElementById('mascota');
const boca = document.getElementById('boca');

/** Expresión de la mascota según la categoría (trazos SVG de la boca). */
const BOCAS = {
  'Bajo peso': 'M72 116 a7 8 0 1 0 16 0 a7 8 0 1 0 -16 0',   // boca pequeña, sorpresa
  'Peso saludable': 'M64 116 q16 13 32 0',                     // sonrisa amplia
  'Sobrepeso': 'M68 120 h24',                                  // línea neutra
  'Obesidad': 'M64 124 q16 -12 32 0',                          // ceño / preocupación
};

const CAMPOS = {
  estatura: {
    input: estaturaInput,
    wrapper: estaturaInput.closest('.campo-entrada'),
    error: document.getElementById('estatura-error'),
    min: 0.5,
    max: 2.5,
    nombre: 'estatura',
    articulo: 'La',
    unidad: 'm',
  },
  peso: {
    input: pesoInput,
    wrapper: pesoInput.closest('.campo-entrada'),
    error: document.getElementById('peso-error'),
    min: 2,
    max: 300,
    nombre: 'peso',
    articulo: 'El',
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
  if (campo.wrapper) campo.wrapper.dataset.estado = 'error';
  campo.error.textContent = mensaje;
  campo.error.hidden = false;
}

function limpiarError(campo) {
  campo.input.setAttribute('aria-invalid', 'false');
  if (campo.wrapper) delete campo.wrapper.dataset.estado;
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
    setError(campo, `${campo.articulo} ${campo.nombre} debe ser un número (usa punto o coma decimal).`);
    return false;
  }

  const numero = parseFloat(normalizar(valor));
  if (numero < campo.min || numero > campo.max) {
    setError(campo, `${campo.articulo} ${campo.nombre} debe estar entre ${campo.min} y ${campo.max} ${campo.unidad}.`);
    return false;
  }

  limpiarError(campo);
  return true;
}

/** Cambia la cara de la mascota y la hace saltar cuando el resultado cambia. */
function animarMascota(categoria) {
  if (!mascota || !boca) return;
  boca.setAttribute('d', BOCAS[categoria] || 'M66 120 q14 10 28 0');
  mascota.classList.remove('salta');
  void mascota.offsetWidth; // fuerza reinicio de la animación CSS
  mascota.classList.add('salta');
}

function mostrarVacio() {
  imcValor.textContent = '—';
  imcCategoria.textContent = 'Ingresa estatura y peso para ver tu IMC';
  resultado.className = 'resultado';
  marcador.classList.remove('visible');
  if (boca) boca.setAttribute('d', 'M66 120 q14 10 28 0');
}

/** Coloca el marcador de la escala: rango visible 15 – 40 de IMC. */
function moverMarcador(imc) {
  const MIN = 15;
  const MAX = 40;
  const pct = Math.min(100, Math.max(0, ((imc - MIN) / (MAX - MIN)) * 100));
  marcador.style.left = `${pct}%`;
  marcador.classList.add('visible');
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

  try {
    const imc = calcularIMC(peso, estatura);
    const categoria = clasificarIMC(imc);

    imcValor.textContent = imc.toFixed(2);
    imcCategoria.textContent = categoria;
    aplicarCategoria(categoria);
    moverMarcador(imc);
    animarMascota(categoria);
  } catch (error) {
    // Red de seguridad: la validación previa ya filtra estos casos, pero si algo
    // inesperado llega aquí, no se muestra "NaN" al usuario.
    console.error('No se pudo calcular el IMC:', error);
    imcValor.textContent = '—';
    imcCategoria.textContent = 'No fue posible calcular el IMC con esos datos';
    resultado.className = 'resultado';
    marcador.classList.remove('visible');
  }
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
// No hay botón "Calcular": el cálculo es automático. El handler de submit solo evita
// que pulsar Enter recargue la página (envío implícito del formulario).
form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  actualizar();
});

precargarDesdeURL();
actualizar();
