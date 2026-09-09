# 📘 Manual Integral de Playwright: ProyectoPlaywright

Este manual consolida todas las consultas, conceptos de arquitectura, comandos, configuraciones y resoluciones de errores abordados a lo largo de las sesiones de trabajo del proyecto. Está estructurado como una guía de referencia rápida y profunda.

---

## 📑 Índice Temático

1. [Instalación, Arquitectura y Entorno](#1-instalación-arquitectura-y-entorno)
   - [1.1 Proyecto nuevo vs. Proyecto clonado de GitHub](#11-proyecto-nuevo-vs-proyecto-clonado-de-github)
   - [1.2 Arquitectura en dos capas: Librería local vs. Caché global de navegadores](#12-arquitectura-en-dos-capas-librería-local-vs-caché-global-de-navegadores)
   - [1.3 Instalación selectiva de navegadores](#13-instalación-selectiva-de-navegadores)
   - [1.4 Actualización de Playwright en proyectos existentes](#14-actualización-de-playwright-en-proyectos-existentes)
   - [1.5 TypeScript y directivas: `/// <reference types="node" />` y `@types/node`](#15-typescript-y-directivas--reference-typesnode--y-typesnode)
2. [Ejecución, Proyectos y Flujo de Trabajo en VS Code](#2-ejecución-proyectos-y-flujo-de-trabajo-en-vs-code)
   - [2.1 Botón de Play vs. Ejecución por Terminal](#21-botón-de-play-vs-ejecución-por-terminal)
   - [2.2 Función real de los Checkboxes de la lista `PROJECTS`](#22-función-real-de-los-checkboxes-de-la-lista-projects)
   - [2.3 Cómo ejecutar pruebas desde la Terminal (Archivos y Proyectos)](#23-cómo-ejecutar-pruebas-desde-la-terminal-archivos-y-proyectos)
   - [2.4 Ubicación del botón "Run All Tests" en VS Code](#24-ubicación-del-botón-run-all-tests-en-vs-code)
   - [2.5 Terminal integrada de VS Code](#25-terminal-integrada-de-vs-code)
   - [2.6 Evitar que el navegador se cierre al terminar un test](#26-evitar-que-el-navegador-se-cierre-al-terminar-un-test)
3. [Herramientas Interactivas de VS Code e Inspección](#3-herramientas-interactivas-de-vs-code-e-inspección)
   - [3.1 Uso de Pick Locator](#31-uso-de-pick-locator)
   - [3.2 Cómo interactuar y navegar sin cerrar el selector](#32-cómo-interactuar-y-navegar-sin-cerrar-el-selector)
   - [3.3 Grabación continua de código con "Record at cursor"](#33-grabación-continua-de-código-con-record-at-cursor)
4. [Reportes, Trazas (Trace Viewer) y Grabación de Video](#4-reportes-trazas-trace-viewer-y-grabación-de-video)
   - [4.1 Por qué el botón Play no genera video ni traces en el reporte HTML](#41-por-qué-el-botón-play-no-genera-video-ni-traces-en-el-reporte-html)
   - [4.2 Visualización de logs por consola: Reporter `'list'` vs `'html'`](#42-visualización-de-logs-por-consola-reporter-list-vs-html)
   - [4.3 Servidor de reporte activo en segundo plano (F5 / recargar)](#43-servidor-de-reporte-activo-en-segundo-plano-f5--recargar)
   - [4.4 ¿Qué es y cómo funciona el Trace Viewer?](#44-qué-es-y-cómo-funciona-el-trace-viewer)
   - [4.5 Guardar reportes históricos por Fecha y Hora](#45-guardar-reportes-históricos-por-fecha-y-hora)
   - [4.6 Alternar entre reporte histórico y reporte único estándar](#46-alternar-entre-reporte-histórico-y-reporte-único-estándar)
5. [Estrategias de Espera y Buenas Prácticas de UI](#5-estrategias-de-espera-y-buenas-prácticas-de-ui)
   - [5.1 Alternativas para colocar una espera antes de un `expect`](#51-alternativas-para-colocar-una-espera-antes-de-un-expect)
   - [5.2 Por qué evitar `waitForTimeout` y preferir Web-First Assertions](#52-por-qué-evitar-waitfortimeout-y-preferir-web-first-assertions)
   - [5.3 Actualización de selectores ante cambios del DOM (uso de `data-testid`)](#53-actualización-de-selectores-ante-cambios-del-dom-uso-de-data-testid)
6. [Pruebas de API y Pruebas Híbridas (API + E2E)](#6-pruebas-de-api-y-pruebas-híbridas-api--e2e)
   - [6.1 Error `Invalid URL`: Causa y solución de aislamiento de proyectos](#61-error-invalid-url-causa-y-solución-de-aislamiento-de-proyectos)
   - [6.2 Error `404 Not Found` en GitHub API: Scopes de Tokens personales](#62-error-404-not-found-en-github-api-scopes-de-tokens-personales)
   - [6.3 Consistencia eventual de APIs y uso de `expect.poll`](#63-consistencia-eventual-de-apis-y-uso-de-expectpoll)
   - [6.4 Error de TypeScript `ts(7034)`: Tipado con `APIRequestContext`](#64-error-de-typescript-ts7034-tipado-con-apirequestcontext)
   - [6.5 Problema de CSS bloqueado en tests híbridos (CORS / `net::ERR_FAILED`)](#65-problema-de-css-bloqueado-en-tests-híbridos-cors--neterr_failed)
   - [6.6 Advertencia de seguridad sobre el bloque `afterAll`](#66-advertencia-de-seguridad-sobre-el-bloque-afterall)

---

## 1. Instalación, Arquitectura y Entorno

### 1.1 Proyecto nuevo vs. Proyecto clonado de GitHub

| Escenario | Comando a ejecutar | Explicación |
| :--- | :--- | :--- |
| **Proyecto clonado** (existente) | `npm install`<br>`npx playwright install` | **NO** usar `npm init playwright@latest` porque sobreescribiría la configuración. `npm install` descarga librerías a `node_modules` y `npx playwright install` descarga los binarios de los navegadores. |
| **Proyecto nuevo** (desde cero) | `npm init playwright@latest` | Asistente interactivo que genera la estructura de carpetas (`tests/`), `playwright.config.ts`, flujos de CI de GitHub y dependencias. |

### 1.2 Arquitectura en dos capas: Librería local vs. Caché global de navegadores

```text
Tu Equipo (Sistema Operativo)
 ├── 📁 Caché Global de Navegadores (~/AppData/Local/ms-playwright en Windows)
 │    ├── Chromium v...
 │    ├── Firefox v...
 │    └── WebKit v...
 │
 └── 📁 Proyectos
      ├── 📁 Proyecto-A/ (node_modules/ con @playwright/test -> apunta a caché global)
      └── 📁 Proyecto-B/ (node_modules/ con @playwright/test -> apunta a caché global)
```

- **`node_modules/` (Local por proyecto):** Aloja el paquete `@playwright/test`. Cada proyecto puede tener su propia versión sin interferir con otros.
- **`ms-playwright/` (Global del usuario):** Los ejecutables de Chromium, Firefox y WebKit son pesados y se guardan en la caché del sistema. Si varios proyectos usan la misma versión de Playwright, comparten los mismos binarios sin descargarlos dos veces.

### 1.3 Instalación selectiva de navegadores
Para ahorrar ancho de banda y espacio en disco cuando solo se prueba en un navegador:
```bash
npx playwright install chromium
```

### 1.4 Actualización de Playwright en proyectos existentes
```bash
npm install @playwright/test@latest
npx playwright install
```

### 1.5 TypeScript y directivas: `/// <reference types="node" />` y `@types/node`
- **¿Qué significa?**: Es una directiva de TypeScript (*Triple-Slash Directive*) que instruye al compilador a cargar las definiciones de tipo de Node.js solo para ese archivo puntual.
- **¿Para qué sirve?**: Permite que el archivo reconozca variables globales de Node como `process.env`, `__dirname`, `Buffer`, y módulos nativos como `path` o `fs`, sin tener que habilitar los tipos de Node globalmente en todo el proyecto.
- **Cómo verificar que `@types/node` está instalado**:
  1. En `package.json` dentro de `"devDependencies"`: `"@types/node": "^... "`.
  2. Por terminal: `npm list @types/node`.
  3. Verificando la presencia de la carpeta `node_modules/@types/node/`.

---

## 2. Ejecución, Proyectos y Flujo de Trabajo en VS Code

### 2.1 Botón de Play vs. Ejecución por Terminal

| Aspecto | Botón Play en VS Code | Terminal (`npx playwright test`) |
| :--- | :--- | :--- |
| **Objetivo** | Feedback visual rápido en el editor durante desarrollo. | Ejecución formal, reportes completos, CI/CD. |
| **Grabación de Video** | Desactivada por diseño para no degradar rendimiento. | Habilitada si está configurada (`video: 'on'`). |
| **Trace Viewer** | Solo abre si está marcado el checkbox `Show trace viewer`. | Se empaqueta en el reporte si está configurado. |
| **Filtro de Proyectos** | Determinado por los checkboxes marcados en `PROJECTS`. | Determinado por flags (ej. `--project="Computadora"`). |

### 2.2 Función real de los Checkboxes de la lista `PROJECTS`
Los checkboxes en el panel lateral de Playwright en VS Code no son solo para un test individual, sino que actúan como el panel de control de VS Code:
1. **Filtrar ejecuciones masivas:** Al ejecutar una carpeta o suite desde VS Code, solo corre en los perfiles tildados.
2. **Depuración (Debug):** Al hacer *Debug Test*, solo frena en el proyecto activo, evitando múltiples pausas repetidas para móvil y escritorio.
3. **Herramientas (Pick locator, Record at cursor):** Lanzan el navegador con la resolución y User-Agent del proyecto tildado.
4. **Árbol de pruebas limpio:** Oculta repeticiones innecesarias de tests en el explorador.

### 2.3 Cómo ejecutar pruebas desde la Terminal (Archivos y Proyectos)

```bash
# Correr un archivo específico en un proyecto puntual
npx playwright test tests/AutomationSandbox.spec.ts --project="Computadora"

# Correr en un dispositivo móvil configurado
npx playwright test tests/AutomationSandbox.spec.ts --project="Iphone"

# Correr en múltiples proyectos a la vez
npx playwright test tests/AutomationSandbox.spec.ts --project="Computadora" --project="Iphone"

# Correr un archivo en TODOS los proyectos configurados
npx playwright test tests/AutomationSandbox.spec.ts

# Correr todos los tests de un proyecto completo
npx playwright test --project="Computadora"

# Correr toda la suite (todos los proyectos y archivos)
npx playwright test

# Correr tests de API
npx playwright test tests/APITests/APITests.spec.ts --project="API Tests"
```

### 2.4 Ubicación del botón "Run All Tests" en VS Code
1. **Al pasar el cursor sobre la carpeta `tests`:** Aparece el ícono de ▶ a la derecha.
2. **En la línea `1/1` del Test Explorer:** El triángulo de ▶ ejecuta los tests del perfil activo.
3. **Barra de título del panel Testing:** En la esquina superior derecha aparecen los íconos de ▶ (*Run All*), ▶🪲 (*Debug All*) y 🔄 (*Refresh*).
4. **Paleta de Comandos (`Ctrl + Shift + P`):** Escribir `Test: Run All Tests`.

### 2.5 Terminal integrada de VS Code
- En Windows la terminal predeterminada suele ser **PowerShell (`pwsh`)**.
- Atajo de apertura: ``Ctrl + ` ``.
- Para cambiar la terminal por defecto: Menú desplegable junto al `+` en la terminal $\rightarrow$ **Select Default Profile** (PowerShell, Command Prompt, Git Bash).

### 2.6 Evitar que el navegador se cierre al terminar un test
Por diseño, Playwright cierra automáticamente el contexto y el navegador al terminar la función del test para aislar las pruebas. No existe un hook propio en el código que lo cierre a menos que se agregue manualmente.

**Métodos para mantenerlo abierto:**
1. **`await page.pause()` (Recomendado):** Detiene la ejecución y abre el Playwright Inspector. El navegador queda abierto hasta presionar *Resume* o cerrar la ventana.
2. **Modo Debug:** `npx playwright test --debug`
3. **Modo UI:** `npx playwright test --ui`
4. **Esperar cierre manual de ventana:** `await page.waitForEvent('close');`

---

## 3. Herramientas Interactivas de VS Code e Inspección

### 3.1 Uso de Pick Locator
1. En el panel **Testing** $\rightarrow$ sección **TOOLS**, hacer clic en **`Pick locator`**.
2. Se abrirá una ventana de Chromium y una barra de entrada en la parte superior de VS Code.
3. Al pasar el cursor sobre la página web, los elementos se resaltan.
4. Al hacer clic sobre un elemento, Playwright genera el selector optimizado (priorizando `getByRole`, `getByTestId`, etc.).
5. Presionar **`Enter`** para copiarlo al portapapeles y pegarlo en el código con `Ctrl + V`.

### 3.2 Cómo interactuar y navegar sin cerrar el selector
Cuando `Pick locator` está activo, hacer clic selecciona el elemento pero **no navega ni escribe**:
- Para hacer clics de navegación reales, desactiva temporalmente el ícono de la mira/diana (Target) en la barra de herramientas del inspector. Navega hasta la página deseada y vuelve a activar la diana.
- Si la barra se cerró porque ya seleccionaste un elemento, vuelve a presionar `Pick locator` en VS Code para continuar inspeccionando.

### 3.3 Grabación continua de código con "Record at cursor"
Si deseas navegar, hacer clics y rellenar formularios de forma continua:
1. Posiciona el cursor de texto en el archivo `.spec.ts` donde quieres insertar el código.
2. En **Testing $\rightarrow$ TOOLS**, haz clic en **`Record at cursor`**.
3. Cada clic (`.click()`) y cada texto ingresado (`.fill()`) en el navegador se escribirá automáticamente en tu archivo de código en tiempo real.

---

## 4. Reportes, Trazas (Trace Viewer) y Grabación de Video

### 4.1 Por qué el botón Play no genera video ni traces en el reporte HTML
- La extensión gráfica está diseñada para ejecución ligera en vivo. Para no ralentizar el IDE, omite empaquetar video y trace en el HTML.
- Además, los tests puramente de API (`{ request }`) no tienen ventana de navegador, por lo que nunca tendrán video.
- Para generar el reporte con Video y Traces completos, debe ejecutarse por **Terminal**:
  ```bash
  npx playwright test
  npx playwright show-report
  ```

### 4.2 Visualización de logs por consola: Reporter `'list'` vs `'html'`
Por defecto, con `reporter: 'html'`, los `console.log()` dentro de las pruebas no se imprimen en la salida estándar. Para verlos:
```typescript
// En playwright.config.ts:
reporter: [
  ['html'],
  ['list'] // Imprime salida de logs y estados en la consola
],
```

### 4.3 Servidor de reporte activo en segundo plano (F5 / recargar)
Flujo optimizado para no ejecutar `show-report` constantemente:
1. Abre una terminal y ejecuta una sola vez:
   ```bash
   npx playwright show-report
   ```
2. Mantén esa terminal abierta (**no presiones `Ctrl + C`**). El servidor web correrá en `http://localhost:9323`.
3. Ejecuta tus tests tantas veces como quieras (por consola o botón Play).
4. Ve al navegador y presiona **`F5`** (o `Ctrl + R`) para refrescar con los últimos resultados.

### 4.4 ¿Qué es y cómo funciona el Trace Viewer?
El **Trace Viewer** es una herramienta de inspección forense ("caja negra" / "máquina del tiempo"):
- **Filmstrip:** Línea de tiempo fotograma a fotograma.
- **DOM Snapshots:** Estado del árbol HTML antes y después de cada acción (`before`/`after`), permitiendo inspeccionar selectores con DevTools sobre la pantalla congelada.
- **Network Tab:** Registro detallado de cada petición HTTP/API (status, headers, payload, tiempos).
- **Console:** Registro de errores y advertencias de JavaScript del navegador.
- **Sincronización de código:** Muestra la línea exacta de TypeScript/JavaScript que ejecutó cada acción.

Para activarlo en VS Code al usar Play: Marcar casilla **`[x] Show trace viewer`** en el panel de Playwright.

### 4.5 Guardar reportes históricos por Fecha y Hora
La estructura nativa del reporte HTML no es un archivo único, sino un `index.html` acompañado de una subcarpeta `data/` con recursos. Por ende, para no sobreescribir ejecuciones anteriores, cada reporte debe alojarse en su propia subcarpeta con marca temporal.

Configuración implementada en `playwright.config.ts`:
```typescript
const ahora = new Date();
const fechaHora = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}_${String(ahora.getHours()).padStart(2, '0')}-${String(ahora.getMinutes()).padStart(2, '0')}-${String(ahora.getSeconds()).padStart(2, '0')}`;

export default defineConfig({
  reporter: [
    ['html', { 
      outputFolder: `reportes/${fechaHora}`,
      open: 'always' 
    }]
  ],
  // ...
});
```

Estructura generada:
```text
📁 reportes/
   ├── 📁 2026-09-09_17-15-30/
   │   ├── 📄 index.html
   │   └── 📁 data/
   └── 📁 2026-09-09_17-20-45/
       ├── 📄 index.html
       └── 📁 data/
```
*(Se incluyó `/reportes/` en `.gitignore` para no versionar reportes pesados).*

### 4.6 Alternar entre reporte histórico y reporte único estándar
En `playwright.config.ts` se dejaron preparadas las dos opciones para alternar comentando y descomentando:
```typescript
  // 👉 OPCIÓN 1: Guardar reportes históricos por fecha y hora en /reportes/
  reporter: [
    ['html', { 
      outputFolder: `reportes/${fechaHora}`,
      open: 'always' 
    }]
  ],

  // 👉 OPCIÓN 2: Reporte único estándar (se sobreescribe siempre en /playwright-report/)
  // reporter: [['html', { open: 'always' }]],
```

---

## 5. Estrategias de Espera y Buenas Prácticas de UI

### 5.1 Alternativas para colocar una espera antes de un `expect`

```typescript
// 1. Espera fija (No recomendada para suites finales)
await page.waitForTimeout(3000);

// 2. Esperar visibilidad de un elemento explícito
await page.locator("//ol[contains(@class, 'ui-search-layout')]").waitFor({ state: 'visible' });

// 3. Esperar que la red esté inactiva tras una acción
await page.waitForLoadState('networkidle');

// 4. Aumentar el timeout del propio expect (Recomendado)
await expect(page.locator("//ol[contains(@class, 'ui-search-layout')]")).toBeVisible({ timeout: 10000 });
```

### 5.2 Por qué evitar `waitForTimeout` y preferir Web-First Assertions
- `waitForTimeout(10000)` **siempre detiene la prueba 10 segundos**, ralentizando drásticamente la suite.
- Las aserciones dinámicas como `expect(locator).toBeVisible({ timeout: 10000 })` son **asincrónicas e inteligentes**:
  - Si el elemento aparece a los **200 ms**, la prueba avanza en 200 ms.
  - Los 10 segundos representan solo el límite máximo tolerable antes de fallar.

### 5.3 Actualización de selectores ante cambios del DOM (uso de `data-testid`)
Los sitios web externos (como GitHub o MercadoLibre) actualizan continuamente su maquetación. Atributos como `a[data-hovercard-type='issue']` quedaron obsoletos y provocan el error `element(s) not found`.
- **Selector obsoleto:** `page.locator("a[data-hovercard-type='issue']")`
- **Selector moderno y robusto:**
  ```typescript
  const firstIssue = page.getByTestId('issue-pr-title-link').first();
  await expect(firstIssue).toHaveText('[Feature] Que el framework me planche la ropa');
  ```

---

## 6. Pruebas de API y Pruebas Híbridas (API + E2E)

### 6.1 Error `Invalid URL`: Causa y solución de aislamiento de proyectos
- **Causa:** Llamadas con rutas relativas (`request.post('/repos/...')`) ejecutadas bajo un proyecto que carece de `baseURL`. Al correr desde VS Code o sin flags, los proyectos de navegador tomaban los tests de API sin tener configurada la URL base.
- **Solución en `playwright.config.ts`:**
  1. Aislar los proyectos de navegador con `testIgnore: '**/APITests/**'`.
  2. Asignar el `baseURL` exclusivamente al proyecto de API:
     ```typescript
     {
       name: 'API Tests',
       testMatch: '**/APITests/**',
       use: {
         baseURL: 'https://api.github.com',
         extraHTTPHeaders: {
           'Accept': 'application/vnd.github.v3+json',
           'Authorization': `token TU_TOKEN_GITHUB`,
         },
       },
     }
     ```

### 6.2 Error `404 Not Found` en GitHub API: Scopes de Tokens personales
- **Causa:** Si un token personal clásico (PAT) no posee el permiso **`repo`** (o `public_repo`), GitHub responde **`404 Not Found`** en lugar de `403 Forbidden`. Esto es una política de seguridad deliberada de GitHub para no confirmar la existencia de repositorios privados o recursos restringidos a tokens no autorizados.
- **Solución:** En GitHub $\rightarrow$ **Settings $\rightarrow$ Developer Settings $\rightarrow$ Personal access tokens (classic)**, editar o generar el token marcando la casilla principal **`☑ repo`**.

### 6.3 Consistencia eventual de APIs y uso de `expect.poll`
- **Problema:** Un `POST` crea un recurso exitosamente (`201 Created`), pero un `GET` ejecutado milisegundos después devuelve una lista vacía `[]` o sin el nuevo ítem. Esto ocurre por la consistencia eventual y cachés de CDN en servicios distribuidos como GitHub.
- **Solución recomendada:** Utilizar **`expect.poll`** para reintentar la llamada `GET` hasta que el elemento esté indexado:
  ```typescript
  await expect.poll(async () => {
      const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
      return await issues.json();
  }, {
      message: 'Esperando a que el issue se indexe en la lista',
      timeout: 10_000,
  }).toContainEqual(expect.objectContaining({
      title: '[Feature] Quiero que haga helados',
  }));
  ```

### 6.4 Error de TypeScript `ts(7034)`: Tipado con `APIRequestContext`
- **Error:** `Variable 'apiContext' implicitly has an 'any' type`.
- **Causa:** Declarar `let apiContext;` sin tipo en un proyecto con TypeScript estricto.
- **Solución:**
  ```typescript
  import { test, expect, APIRequestContext } from '@playwright/test';

  let apiContext: APIRequestContext;
  ```

### 6.5 Problema de CSS bloqueado en tests híbridos (CORS / `net::ERR_FAILED`)
- **Problema:** En tests híbridos donde se usa la API para preparar datos y luego `page.goto('https://github.com/...')` para verificar la UI, la página web se carga en texto plano sin hojas de estilo ni diseño visual.
- **Causa:** Las `extraHTTPHeaders` configuradas con el token de `Authorization` se heredan en el objeto `page`. Cuando el navegador solicita archivos CSS/JS a los servidores CDN estáticos de GitHub (`githubassets.com`), enviar cabeceras de autorización ajenas viola la política de CORS y el navegador bloquea las descargas (`net::ERR_FAILED`).
- **Solución:** Limpiar las cabeceras del navegador agregando al inicio del archivo de pruebas híbrido:
  ```typescript
  test.use({
      extraHTTPHeaders: {},
  });
  ```
  Y manejar el contexto de la API de forma independiente con `playwright.request.newContext(...)` dentro del `beforeAll`.

### 6.6 Advertencia de seguridad sobre el bloque `afterAll`
- **Peligro identificado:**
  ```typescript
  test.afterAll(async ({ request }) => {
      await request.delete(`/repos/${USER}/${REPO}`);
  });
  ```
- Si el repositorio de pruebas no fue creado dinámicamente como desechable en el `beforeAll`, este método **eliminará de forma permanente el repositorio principal de GitHub**. Mantener siempre comentado o utilizar repositorios temporales aislados.

---

*Manual generado automáticamente como compendio del ProyectoPlaywright.*
