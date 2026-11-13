// El tope de gasto de Neuri, para Carlos (server/neuri/presupuesto.mjs). Sin gastar nada y sin enseñar claves.
//
// Uso (desde web/):
//   npm run presupuesto                          lo gastado hoy y este mes, los topes, las reservas abiertas y lo último
//   npm run presupuesto -- apagar                apaga la IA al momento (crea el interruptor IA-APAGADA; sin reiniciar)
//   npm run presupuesto -- encender              la vuelve a encender (quita el interruptor)
//   npm run presupuesto -- resolver <id> <US$>   cierra una reserva «incierta» con lo que costó según la consola de
//                                                Anthropic (console.anthropic.com → Usage); <id>: sus primeros 8 caracteres
//   npm run presupuesto -- confirmar <id|todas>  la cierra como gastada entera (lo reservado), si no encuentras la cifra
//
// Los topes se cambian en web/.env.local (ANATO3D_TOPE_DIARIO_USD y ANATO3D_TOPE_MENSUAL_USD; en el servidor, sus
// variables): el servidor de desarrollo los vuelve a leer en la siguiente petición. Resolver o confirmar necesita el
// presupuesto para sí: con el servidor abierto, ciérralo antes (si no, los dos tendrían su propia cuenta).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { crearPresupuesto, usdANano, nanoAUsd, periodos, procesoVivo, FECHA_TARIFAS } from '../server/neuri/presupuesto.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...loadEnv('development', raiz, ''), ...process.env };
const dir = env.ANATO3D_DATOS?.trim() || path.join(raiz, '../build/servidor');
const archivo = path.join(dir, 'presupuesto.json');
const interruptor = path.join(dir, 'IA-APAGADA');
const topeDia = usdANano(env.ANATO3D_TOPE_DIARIO_USD);
const topeMes = usdANano(env.ANATO3D_TOPE_MENSUAL_USD);
const zona = env.ANATO3D_PRESUPUESTO_ZONA?.trim() || 'America/Tijuana';
const [orden = 'ver', ...args] = process.argv.slice(2);
const usd = (n) => `${nanoAUsd(n)} US$`;

function leer() {
  try { return JSON.parse(fs.readFileSync(archivo, 'utf8')); } catch (err) {
    if (err.code === 'ENOENT') return null;
    console.error(`✖ No se puede leer ${archivo}: está dañado o sin permiso. La IA no gasta hasta arreglarlo (restaura la copia o revísalo a mano).`);
    process.exit(1);
  }
}
function dueño() {
  try {
    const pid = Number(fs.readFileSync(`${archivo}.lock`, 'utf8').trim());
    return { pid, vivo: procesoVivo(pid) };
  } catch { return null; }
}
/** El presupuesto para cambiarlo (con el cerrojo). Sale si otro proceso lo tiene. */
function abrir() {
  const p = crearPresupuesto({ archivo, topeDia, topeMes, zona, registro: { info() {}, error() {} } });
  if (p.motivo === 'otro-proceso') {
    console.error(`✖ El presupuesto lo tiene abierto otro proceso (PID ${dueño()?.pid}): el servidor de Neuri. Ciérralo antes de resolver o confirmar.`);
    process.exit(1);
  }
  if (p.motivo === 'almacen') {
    console.error(`✖ No se puede abrir ${archivo} (dañado o sin permiso).`);
    process.exit(1);
  }
  return p;
}
const buscar = (reservas, id) => Object.values(reservas).filter((r) => r.id === id || (id.length >= 6 && r.id.startsWith(id)));

if (orden === 'apagar') {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(interruptor, `IA apagada a mano el ${new Date().toISOString()}. Para encenderla: npm run presupuesto -- encender\n`);
  console.log(`✔ IA apagada: ${interruptor}. Neuri responde con el buscador desde la siguiente pregunta (sin reiniciar).`);
} else if (orden === 'encender') {
  try { fs.unlinkSync(interruptor); console.log('✔ Interruptor quitado: la IA vuelve a gastar dentro de los topes.'); } catch { console.log('La IA no estaba apagada con el interruptor.'); }
  if (!(topeDia > 0) || !(topeMes > 0)) console.log('  Ojo: sin topes (ANATO3D_TOPE_DIARIO_USD y ANATO3D_TOPE_MENSUAL_USD), sigue sin llamar a la IA.');
} else if (orden === 'resolver' || orden === 'confirmar') {
  const [id, cifra] = args;
  if (!id || (orden === 'resolver' && usdANano(cifra) === null)) {
    console.error(orden === 'resolver' ? 'Uso: npm run presupuesto -- resolver <id> <US$>   (p. ej. resolver 3f2a9c1b 0.0042)' : 'Uso: npm run presupuesto -- confirmar <id|todas>');
    process.exit(1);
  }
  const p = abrir();
  const abiertas = p.resumen().abiertas.filter((r) => r.estado === 'incierta');
  const elegidas = id === 'todas' && orden === 'confirmar' ? abiertas : buscar(Object.fromEntries(abiertas.map((r) => [r.id, r])), id);
  if (!elegidas.length || (id !== 'todas' && elegidas.length > 1)) {
    console.error(elegidas.length ? `✖ «${id}» coincide con ${elegidas.length} reservas: escribe más caracteres.` : `✖ No hay ninguna reserva incierta «${id}» (npm run presupuesto las lista).`);
    p.cerrar();
    process.exit(1);
  }
  for (const r of elegidas) {
    const real = orden === 'resolver' ? usdANano(cifra) : r.n;
    p.resolver(r.id, real);
    console.log(`✔ ${r.id.slice(0, 8)} (${r.etiqueta || 'sin etiqueta'}, ${r.dia}): reservado ${usd(r.n)} → ${orden === 'resolver' ? 'costó' : 'se da por gastado'} ${usd(real)}.`);
  }
  p.cerrar();
} else if (orden === 'ver') {
  const d = leer();
  const { dia, mes } = periodos(Date.now(), zona);
  const apagada = fs.existsSync(interruptor);
  const quien = dueño();
  console.log(`Tope de gasto de Neuri (${archivo}; zona ${zona}; tarifas del ${FECHA_TARIFAS})`);
  console.log(`  Topes: ${topeDia > 0 ? usd(topeDia) : 'sin poner'} al día · ${topeMes > 0 ? usd(topeMes) : 'sin poner'} al mes${!(topeDia > 0) || !(topeMes > 0) ? '  → sin topes, Neuri no llama a la IA' : ''}`);
  console.log(`  Interruptor: ${apagada ? 'IA APAGADA (npm run presupuesto -- encender)' : 'encendida'}`);
  console.log(`  Servidor: ${quien ? `PID ${quien.pid} ${quien.vivo ? '(abierto)' : '(cerrado: el cerrojo se recupera al arrancar)'}` : 'ninguno con el presupuesto abierto'}`);
  if (!d) { console.log('  Aún no se ha gastado nada (no hay archivo).'); process.exit(0); }
  const enCurso = (campo, clave) => Object.values(d.reservas).filter((r) => r.estado === 'en-curso' && r[campo] === clave).reduce((t, r) => t + r.n, 0);
  console.log(`  Hoy (${dia}): gastado ${usd(d.dias[dia] ?? 0)}${enCurso('dia', dia) ? ` + reservado ${usd(enCurso('dia', dia))}` : ''}${topeDia > 0 ? ` de ${usd(topeDia)}` : ''}`);
  console.log(`  Este mes (${mes}): gastado ${usd(d.meses[mes] ?? 0)}${enCurso('mes', mes) ? ` + reservado ${usd(enCurso('mes', mes))}` : ''}${topeMes > 0 ? ` de ${usd(topeMes)}` : ''}`);
  const abiertas = Object.values(d.reservas);
  console.log(`\nReservas abiertas: ${abiertas.length || 'ninguna'}`);
  for (const r of abiertas) console.log(`  ${r.id.slice(0, 8)}  ${r.estado.padEnd(9)} ${usd(r.n).padStart(14)}  ${r.dia}  ${r.etiqueta}${r.trabajo ? ` · trabajo ${r.trabajo.slice(0, 8)}` : ''}  (${r.modelo})`);
  if (abiertas.some((r) => r.estado === 'incierta')) console.log('  «incierta»: un corte después de enviar; cuenta entera. Busca lo que costó en la consola de Anthropic (Usage, a esa hora) y: npm run presupuesto -- resolver <id> <US$>');
  const ultimas = d.historial.slice(-15);
  if (ultimas.length) {
    console.log('\nÚltimas llamadas:');
    for (const h of ultimas) console.log(`  ${h.fecha.slice(0, 16).replace('T', ' ')} UTC  ${h.estado.padEnd(9)} ${h.real === null ? '        —     ' : usd(h.real).padStart(14)}  (reservado ${usd(h.reservado)})  ${h.etiqueta}`);
  }
} else {
  console.error(`Orden desconocida «${orden}». Usa: ver, apagar, encender, resolver <id> <US$> o confirmar <id|todas>.`);
  process.exit(1);
}
