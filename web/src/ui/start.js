// Pantalla de inicio: el nombre, el menú (Iniciar, Configuración, Créditos) y el crédito de NeuroFuture; a la derecha,
// el visor con el esqueleto (Viewer.setShowcase). La abre la clase `inicio` del <body>, presente desde la primera
// pintura; «Iniciar» la funde a negro, la quita y llama a `onIniciar`. Desde la app se vuelve con `abrir()`, y la
// primera opción pasa a ser «Continuar».
//
// Configuración muestra copias de los ajustes del panel «Ajustes» (idioma y casillas): los originales siguen mandando
// (un cambio aquí los cambia y les manda su evento, y sus manejadores hacen el trabajo). Créditos copia los de «Ayuda».
import { t } from '../i18n/idioma.js';

const SALIDA_MS = 250;   // la transición de opacidad de .start y #stage con body.saliendo (styles.css)

export function createStart({ root, ajustes, creditos, onIniciar }) {
  const menu = root.querySelector('.start-menu');
  const items = [...menu.querySelectorAll('.start-item')];
  const vistas = Object.fromEntries([...root.querySelectorAll('.start-view')].map((v) => [v.id.replace('start-', ''), v]));
  let abierta = document.body.classList.contains('inicio');
  let volviendo = false;                                 // la app se funde a negro camino de la pantalla
  let desde = null;                                      // opción del menú que abrió la vista actual

  const copias = [...ajustes.querySelectorAll('.switch, .setting-note')].map((el) => {
    const copia = el.cloneNode(true);
    const original = el.querySelector('input, select');
    const input = copia.querySelector('input, select');
    if (input) {
      const prop = input.tagName === 'SELECT' ? 'value' : 'checked';    // el idioma es una lista; el resto, casillas
      input.removeAttribute('id');
      input.addEventListener('change', () => {
        original[prop] = input[prop];
        original.dispatchEvent(new Event('change'));
      });
      copia.sincronizar = () => (input[prop] = original[prop]);
    }
    return copia;
  });
  vistas.configuracion.querySelector('.start-settings').append(...copias);
  vistas.creditos.querySelector('.start-credits').append(...[...creditos.children].map((el) => el.cloneNode(true)));

  // Una vista (Configuración, Créditos) o, con null, el menú; el foco va a su título o a la opción de la que se vino.
  function mostrar(nombre) {
    menu.hidden = Boolean(nombre);
    for (const [k, v] of Object.entries(vistas)) v.hidden = k !== nombre;
    root.classList.toggle('con-vista', Boolean(nombre));
    if (nombre === 'configuracion') for (const c of copias) c.sincronizar?.();
    if (nombre) vistas[nombre].querySelector('h2').focus();
    else (desde ?? items[0]).focus();
  }

  function iniciar() {
    if (!abierta) return;
    abierta = false;
    document.body.classList.add('saliendo');
    setTimeout(() => {
      document.body.classList.remove('inicio', 'saliendo');
      onIniciar();
    }, SALIDA_MS);
  }

  // Al revés que iniciar(): la app se funde a negro y la pantalla aparece desde negro. `alCubrir` se llama con todo en
  // negro, para cambiar lo que muestra el visor sin que se vea el salto.
  function abrir(alCubrir) {
    if (abierta || volviendo) return;
    volviendo = true;
    document.body.classList.add('saliendo');
    setTimeout(() => {
      volviendo = false;
      abierta = true;
      document.body.classList.add('inicio');
      items[0].dataset.t = 'inicio.continuar';
      items[0].textContent = t('inicio.continuar');
      desde = null;
      mostrar(null);
      alCubrir();
      // Dos fotogramas: el primero pinta la pantalla aún transparente; así la opacidad tiene desde dónde transicionar.
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('saliendo')));
    }, SALIDA_MS);
  }

  menu.addEventListener('click', (e) => {
    const b = e.target.closest('.start-item');
    if (!b) return;
    if (b.dataset.start === 'iniciar') return iniciar();
    desde = b;
    mostrar(b.dataset.start);
  });
  // Pasar el ratón por una opción la elige, como las flechas: solo una lleva la marca.
  menu.addEventListener('pointermove', (e) => {
    const b = e.target.closest('.start-item');
    if (b && document.activeElement !== b) b.focus({ preventScroll: true });
  });
  root.querySelectorAll('[data-volver]').forEach((b) => b.addEventListener('click', () => mostrar(null)));

  // Flechas arriba y abajo: recorren el menú; Escape: vuelve de Configuración o Créditos.
  window.addEventListener('keydown', (e) => {
    if (!abierta) return;
    if (e.key === 'Escape' && menu.hidden) {
      e.preventDefault();
      mostrar(null);
    } else if (!menu.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const i = items.indexOf(document.activeElement);
      const paso = e.key === 'ArrowDown' ? 1 : -1;
      items[i < 0 ? 0 : (i + paso + items.length) % items.length].focus();
    }
  });

  if (abierta) items[0].focus();
  return { abrir, get abierta() { return abierta; } };
}
