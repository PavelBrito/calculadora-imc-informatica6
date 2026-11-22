# Calculadora de IMC — Informática VI, Unidad 5 Actividad 2

- Alumno: Pavel Pérez Brito
- Asignatura: Informática VI (1656)
- Grupo: 9697

## Qué hace

Aplicación web local que calcula el Índice de Masa Corporal (IMC) a partir de la estatura
(en metros) y el peso (en kilogramos) ingresados por el usuario. El resultado se actualiza
automáticamente mientras se escribe. No hay botón "Calcular": el cálculo es automático
porque el plan de la asignatura pide que el resultado se actualice "cada que se ingresen
los datos".

Fórmula:

    IMC = peso / (estatura²)

El valor se muestra con 2 decimales y se acompaña de su interpretación (categoría) con un
color de fondo distintivo.

## Stack

HTML5 + CSS3 + JavaScript nativo (ES modules). Sin frameworks, sin build y sin dependencias
npm. Node.js solo se usa para ejecutar las pruebas.

## Cómo ejecutarlo

Opción 1 (recomendada) — servidor estático con Python:

    cd U5A2_IMC
    python3 -m http.server 8000

Abrir http://localhost:8000

Opción 2 — con npx serve:

    cd U5A2_IMC
    npx serve .

Abrir la URL que indique (por defecto http://localhost:3000).

Opción 3 — abrir index.html directamente:

Es posible abrir index.html en el navegador, PERO como la aplicación usa ES modules, el
navegador los bloquea cuando la página se sirve con el protocolo `file://` (política CORS de
origen opaco). Por eso se recomienda una de las dos opciones con servidor. Si aun así se
abre directo, usar Chromium con el flag `--allow-file-access-from-files`.

## Cómo correr las pruebas

    node --test tests/

## Tabla de interpretación del IMC

| IMC        | Interpretación   |
|------------|------------------|
| < 18.5     | Bajo peso        |
| 18.5 – 24.9| Peso saludable   |
| 25.0 – 29.9| Sobrepeso        |
| ≥ 30.0     | Obesidad         |

## Decisiones de redondeo y validación

Redondeo y clasificación:

- El IMC se muestra redondeado a 2 decimales.
- La clasificación se hace sobre el valor redondeado a 2 decimales, para evitar artefactos de
  coma flotante.
- Los cortes de la tabla se expresan con un decimal. El valor 24.95 queda entre 24.9 y 25.0;
  como es mayor que 24.9, se clasifica como **Sobrepeso** (24.95 → Sobrepeso). En código, el
  corte de Sobrepeso se implementa como `imc > 24.9` (y `≤ 29.9`). Los casos límite
  18.5, 24.9, 25.0, 29.9 y 30.0 se respetan exactamente.

Validación:

- Solo números: se rechazan letras y símbolos. Los campos usan `inputmode="decimal"`.
- Coma decimal: se acepta `70,5` y se convierte internamente a punto (`70.5`), lo natural en
  México.
- Rangos plausibles: estatura 0.50–2.50 m; peso 2–300 kg.
- Mensajes de error específicos por campo, visibles junto al campo (no `alert()`), con
  `aria-invalid="true"` y `aria-describedby` apuntando al mensaje.
- Mientras haya error o campos incompletos, el panel de resultado muestra "—" (no una cifra).

Accesibilidad:

- El panel de resultado usa `role="status"` y `aria-live="polite"`.
- Color de fondo distinto por categoría, siempre acompañado de texto explícito (no solo color).

## Manejo de entradas no válidas y de excepciones

Hay tres capas, de la más cercana al usuario a la más defensiva:

1. **Validación en la interfaz (`js/app.js`).** Antes de calcular, cada campo se valida con una
   expresión regular y un rango. Si el valor no es un número o está fuera de rango, se muestra
   el mensaje junto al campo, se marca `aria-invalid="true"` y el resultado queda en "—".
   Casos cubiertos y verificados en el navegador:

   | Entrada en el campo peso | Mensaje mostrado |
   |---|---|
   | `abc`, `@`, `70kg`, `-70`, `1e5`, `70.5.5` | "El peso debe ser un número (usa punto o coma decimal)." |
   | `0`, `500` | "El peso debe estar entre 2 y 300 kg." |
   | `""` (vacío) | sin mensaje; resultado en "—" (datos incompletos) |
   | ` 70 `, `70,5`, `70.5` | válido → 22.86 / 23.02 / 23.02 |

   En el campo estatura se comporta igual: `abc` y `..` dan "debe ser un número", `0` y `3` dan
   "debe estar entre 0.5 y 2.5 m", y `1,75` / `1.75` calculan correctamente.

2. **Respuesta a la división y a los tipos (`js/imc.js`).** `calcularIMC` rechaza valores que no
   son números finitos (`NaN`, `Infinity`, cadenas, `null`) con `TypeError`, y estatura o peso
   iguales o menores que cero con `RangeError`. `clasificarIMC` también rechaza `NaN`. Esto
   evita que un `NaN` o un `Infinity` lleguen a la vista; hay pruebas dedicadas para cada caso.

3. **Red de seguridad en la interfaz.** La llamada a `calcularIMC`/`clasificarIMC` está dentro de
   `try/catch`. Si algo inesperado llegara a fallar, se registra en la consola y el panel muestra
   "No fue posible calcular el IMC con esos datos" en lugar de una cifra rota.

## Publicar en GitHub y en GitLab

El repositorio se crea manualmente en la web (visibilidad pública). No se crean cuentas ni se
publica nada desde este proyecto.

GitHub (crear antes el repo en github.com → New repository, visibilidad Public, sin README inicial):

    git remote add origin https://github.com/TU_USUARIO/calculadora-imc.git
    git branch -M main
    git push -u origin main

GitLab (crear antes el proyecto en gitlab.com → New project, visibilidad Public, sin README inicial):

    git remote add origin https://gitlab.com/TU_USUARIO/calculadora-imc.git
    git branch -M main
    git push -u origin main

Nota: si ya se agregó un remote y se quiere usar el otro, quitarlo antes con
`git remote remove origin`.

## Cómo se probó

Comandos ejecutados y resultados reales:

1) Pruebas unitarias (`node --test tests/`) — 12 pruebas, 12 pasan, 0 fallan:

    ✔ calcularIMC usa la fórmula peso / estatura²
    ✔ calcularIMC redondeado a 2 decimales da 22.86 para 70 kg / 1.75 m
    ✔ clasificarIMC: bajo peso (< 18.5)
    ✔ clasificarIMC: límite bajo peso / saludable en 18.5
    ✔ clasificarIMC: límite saludable / sobrepeso en 24.9 y 25.0
    ✔ clasificarIMC: 24.95 se clasifica como Sobrepeso (decisión documentada)
    ✔ clasificarIMC: límite sobrepeso / obesidad en 29.9 y 30.0
    ✔ clasificarIMC: categorías intermedias
    ✔ calcularIMC lanza TypeError si recibe algo que no es número finito
    ✔ calcularIMC lanza RangeError si la estatura es cero o negativa
    ✔ calcularIMC lanza RangeError si el peso es cero o negativo
    ✔ clasificarIMC lanza TypeError con NaN o Infinity
    ℹ tests 12 · pass 12 · fail 0

2) Sintaxis y carga del módulo:

    node --check js/imc.js                     # sin errores
    node --check js/app.js                     # sin errores
    node --input-type=module -e "import('./js/imc.js')"   # import OK

3) Servidor:

    cd U5A2_IMC && python3 -m http.server 8000 &
    curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/   # 200

4) Capturas — 4 PNG con Chromium headless, servidas por HTTP (estado inicial, saludable 70/1.75,
   sobrepeso 85/1.70, error peso=abc):

    file capturas/*.png
    → PNG image data, 1280 x 900, 8-bit/color RGB, non-interlaced (los 4 archivos)

    Nota: como la app usa ES modules, las capturas se generaron sirviéndola por HTTP
    (http://localhost:8000/index.html?peso=...&estatura=...): por file:// los módulos no
    se cargan sin --allow-file-access-from-files.

5) Git: historial de 7 commits y etiqueta `v1.0` (ver `git log --oneline`).
