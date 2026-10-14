# Plan de pruebas - Parte pública de UNIOR Learn

## Application Overview

Plan de pruebas de la parte pública de https://learn-unior.web.app (Plataforma de posgrado de la Universidad Privada de Oruro, Angular Material + Firebase Auth). Cubre catálogo /programas, ficha /programa/:slug, formulario /iniciar-sesion (solo validaciones) y acceso anónimo a /admin/portal. Todos los escenarios parten de sesión limpia (contexto de navegador nuevo, sin cookies ni almacenamiento). Observaciones reales: el catálogo no tiene buscador ni filtros; la raíz / redirige a /programas; la ficha muestra un indicador "Cargando el programa…" antes del contenido; el formulario usa validación nativa del navegador (sin mat-error).

## Test Scenarios

### 1. Catálogo y fichas de programas

**Seed:** `tests/seed.spec.ts`

#### 1.1. Carga del catálogo y listado de los 6 programas

**File:** `tests/catalogo/listado-programas.spec.ts`

**Steps:**
  1. Abrir https://learn-unior.web.app/programas con sesión limpia.
    - expect: El título de la pestaña es 'Programas de posgrado · UNIOR'.
    - expect: Se muestra el heading nivel 1 'Programas de posgrado' y el texto 'Oferta 2026'.
    - expect: El párrafo introductorio dice 'Diplomados abiertos a profesionales con grado de licenciatura. Cada programa indica su modalidad, su carga horaria y la inversión total.'
  2. Revisar las tarjetas del listado (heading nivel 2 en cada una).
    - expect: Hay exactamente 6 tarjetas, cada una con un enlace 'Ver programa'.
    - expect: Ciencia de Datos e Inteligencia Artificial: Tecnología, '400 horas académicas · Modalidad Híbrida', Bs 6.500, enlace a /programa/ciencia-de-datos-e-inteligencia-artificial.
    - expect: Educación Superior y Docencia Universitaria: Educación, '320 horas académicas · Modalidad Virtual', Bs 4.900, enlace a /programa/educacion-superior-y-docencia-universitaria.
    - expect: Full Stack Development & Advanced QA Automation: Tecnología, '480 horas académicas · Modalidad Virtual', Bs 7.000, enlace a /programa/full-stack-development-qa-automation.
    - expect: Gerencia y Gestión de Proyectos: Gestión, '360 horas académicas · Modalidad Presencial', Bs 5.800, enlace a /programa/gestion-de-proyectos.
    - expect: Marketing Digital y Comercio Electrónico: Gestión, '280 horas académicas · Modalidad Virtual', Bs 4.500, enlace a /programa/marketing-digital-y-comercio-electronico.
    - expect: Salud Pública y Epidemiología: Salud, '380 horas académicas · Modalidad Híbrida', Bs 6.200, enlace a /programa/salud-publica-y-epidemiologia.
  3. Buscar controles de búsqueda o filtros (textbox, combobox, chips) en la página.
    - expect: No existe ningún buscador ni filtro (comportamiento actual documentado; si se agregan, actualizar el plan).
  4. Revisar cabecera y pie.
    - expect: Cabecera: enlace 'Inicio · UNIOR' (/inicio), navegación 'Principal' con enlaces 'Inicio' (/inicio) y 'Programas' (/programas), y enlace 'Iniciar sesión' (/iniciar-sesion).
    - expect: Pie (contentinfo): 'Universidad Privada de Oruro · Dirección de Posgrado' y 'Oruro, Bolivia'.

#### 1.2. Navegación del catálogo a la ficha y regreso

**File:** `tests/catalogo/navegacion-ficha.spec.ts`

**Steps:**
  1. Abrir /programas y hacer clic en 'Ver programa' de la tarjeta 'Ciencia de Datos e Inteligencia Artificial'.
    - expect: La URL pasa a https://learn-unior.web.app/programa/ciencia-de-datos-e-inteligencia-artificial.
    - expect: Al inicio aparece una barra de progreso (role progressbar) con el texto 'Cargando el programa…'.
  2. Esperar a que desaparezca 'Cargando el programa…'.
    - expect: El título de la pestaña cambia a 'Ciencia de Datos e Inteligencia Artificial · UNIOR'.
    - expect: Se muestra el enlace 'Todos los programas' (/programas) en la parte superior.
  3. Hacer clic en 'Todos los programas'.
    - expect: Regresa a /programas y se ven nuevamente las 6 tarjetas.
  4. Repetir con la navegación 'Programas' de la cabecera y con el botón Atrás del navegador desde la ficha.
    - expect: Ambos caminos llevan a /programas con el listado completo.

#### 1.3. Contenido de la ficha del programa

**File:** `tests/programa/contenido-ficha.spec.ts`

**Steps:**
  1. Abrir directamente /programa/ciencia-de-datos-e-inteligencia-artificial y esperar a que termine la carga.
    - expect: Heading nivel 1 'Ciencia de Datos e Inteligencia Artificial' y etiqueta de área 'Tecnología'.
    - expect: Texto: 'Dirigido a profesionales con grado de licenciatura que buscan una especialización con respaldo universitario y horario compatible con el trabajo.'
  2. Revisar la sección 'Qué se lleva al terminar' (heading nivel 2).
    - expect: Lista con 3 ítems: certificación con carga horaria reconocida por la Universidad Privada de Oruro; material y grabación de cada sesión disponibles durante el programa y tres meses después; acompañamiento docente para el trabajo final.
  3. Revisar el panel lateral (complementary).
    - expect: Área: Tecnología; Carga horaria: 400 horas; Modalidad: Híbrida; Inversión: Bs 6.500 (coinciden con la tarjeta del catálogo).
    - expect: Enlace 'Postular al programa' visible.
    - expect: Nota: 'La postulación se completa desde la plataforma. Necesita su cédula de identidad y el título en provisión nacional escaneados.'
  4. Repetir la verificación de datos del panel con 'Educación Superior y Docencia Universitaria' (320 horas, Virtual, Bs 4.900).
    - expect: Los datos de la ficha coinciden con los de la tarjeta del catálogo.

#### 1.4. Usuario anónimo: CTA 'Postular al programa' y slug inexistente

**File:** `tests/programa/cta-anonimo-y-slug-invalido.spec.ts`

**Steps:**
  1. Abrir la ficha /programa/ciencia-de-datos-e-inteligencia-artificial y hacer clic en 'Postular al programa'.
    - expect: La URL pasa a https://learn-unior.web.app/iniciar-sesion y el título es 'Iniciar sesión · Plataforma UNIOR'.
    - expect: Se muestra el heading 'Iniciar sesión'. No se crea postulación ni se muestra error.
  2. Abrir directamente https://learn-unior.web.app/programa/no-existe-qa y esperar unos segundos.
    - expect: El título de la pestaña pasa a 'Programa no disponible · UNIOR'.
    - expect: Mensaje 'Este programa ya no está disponible' y texto 'El enlace puede estar vencido o el programa dejó de ofertarse. En el catálogo está todo lo que sigue abierto.'
    - expect: Enlaces 'Todos los programas' y 'Ver los programas' que llevan a /programas.
  3. Abrir https://learn-unior.web.app/ (raíz).
    - expect: Redirige a https://learn-unior.web.app/programas.

### 2. Inicio de sesión (solo validaciones)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Estructura del formulario de inicio de sesión

**File:** `tests/login/estructura-formulario.spec.ts`

**Steps:**
  1. Abrir /iniciar-sesion con sesión limpia.
    - expect: Título de pestaña 'Iniciar sesión · Plataforma UNIOR'; heading nivel 1 'Iniciar sesión'; texto 'Ingrese con la cuenta que registró en Postgrado.'
    - expect: Panel lateral con heading 'La plataforma de posgrado de la Universidad Privada de Oruro' y texto 'Sus programas, su avance y sus certificados, en un solo lugar.'
  2. Inspeccionar los controles.
    - expect: Textbox 'Correo electrónico' (type=email, required, autocomplete=email) y textbox 'Contraseña' (type=password, required, autocomplete=current-password), ambos con indicador '*'.
    - expect: Botones 'Ingresar' y 'Continuar con Google' (no hacer clic en este último); separador 'o'.
    - expect: Texto '¿Todavía no tiene cuenta?' con enlace 'Vea los programas' (/programas) y 'y postule al que le interese.'
  3. Hacer clic en 'Vea los programas'.
    - expect: Navega a /programas.

#### 2.2. Validaciones: campos vacíos, email sin formato y credenciales inexistentes

**File:** `tests/login/validaciones-formulario.spec.ts`

**Steps:**
  1. En /iniciar-sesion, con ambos campos vacíos, hacer clic en 'Ingresar'.
    - expect: No se envía el formulario: la URL sigue siendo /iniciar-sesion.
    - expect: El foco pasa al campo 'Correo electrónico' y el navegador muestra su validationMessage nativo ('Completa este campo' en Chromium en español).
    - expect: No aparecen mat-error ni mensajes propios de la aplicación (validación nativa del navegador).
  2. Escribir 'correo-invalido' en Correo electrónico y 'x' en Contraseña; hacer clic en 'Ingresar'.
    - expect: No se envía: el email muestra el mensaje nativo de tipo email (Chromium: 'Incluye un signo "@" en la dirección de correo electrónico...').
    - expect: La URL no cambia y no se realiza ninguna petición de autenticación.
  3. Con email válido y contraseña vacía, hacer clic en 'Ingresar'.
    - expect: El foco va a Contraseña con el mensaje nativo 'Completa este campo'; no se envía.
  4. Una sola vez: escribir qa.inexistente@example.com y la contraseña ficticia ClaveFalsa123 y hacer clic en 'Ingresar'. No usar credenciales reales.
    - expect: Permanece en /iniciar-sesion y aparece, entre el campo Contraseña y el botón, el mensaje con icono error_outline: 'El correo o la contraseña no coinciden.'
    - expect: Los campos conservan lo escrito.
    - expect: Consola: un error de red 400 de identitytoolkit.googleapis.com/v1/accounts:signInWithPassword (esperado, proviene de Firebase Auth).

### 3. Acceso protegido sin sesión

**Seed:** `tests/seed.spec.ts`

#### 3.1. Acceso directo a /admin/portal sin sesión redirige a inicio de sesión

**File:** `tests/seguridad/admin-portal-anonimo.spec.ts`

**Steps:**
  1. Con contexto limpio (sin sesión), navegar directamente a https://learn-unior.web.app/admin/portal.
    - expect: Al cargar, el título inicial es genérico 'Posgrado UNIOR · Universidad Privada de Oruro' (momento de arranque de la app).
  2. Esperar unos 3 segundos y observar URL y contenido.
    - expect: La URL final es https://learn-unior.web.app/iniciar-sesion (sin parámetros de query como returnUrl).
    - expect: El título es 'Iniciar sesión · Plataforma UNIOR' y se muestra el formulario de inicio de sesión estándar.
    - expect: No se muestra ningún contenido de administración ni mensaje de 'acceso denegado' o 'no autorizado'.
  3. Pulsar Atrás en el navegador.
    - expect: No se vuelve a mostrar contenido de /admin/portal; la app no expone contenido administrativo en ningún momento.
