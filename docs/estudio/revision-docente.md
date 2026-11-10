---
title: Paquete de revisión docente de «Estudiar» y Neuri
fecha: 2026-11-09
estado: preparado-sin-revisiones
---

# Paquete de revisión docente de «Estudiar» y Neuri

Materiales para que docentes de anatomía revisen el contenido de la biblioteca y las lecciones que crea Neuri (especificación, secciones 23 y 28).

**Estado a 9 de noviembre de 2026:**
- **Nadie ha revisado todavía ningún contenido.** Las 71 lecciones están en «borrador»; las redactó una IA a partir de fuentes citadas.
- Este paquete no atribuye a nadie revisiones que no ha hecho. Un nombre solo aparece en una lección cuando esa persona la ha revisado y ha aceptado figurar.

## Qué se revisa y en qué orden

| Prioridad | Qué | Hoja de revisión | Por qué |
| ---: | --- | --- | --- |
| 1 | Módulo «El brazo: compartimentos anterior y posterior» | `docs/revision/brazo-2026-11-09.md` (201 veredictos) | Contenido del piloto |
| 2 | Módulo «El antebrazo: compartimento anterior» | `docs/revision/antebrazo-2026-11-09.md` (168 veredictos) | Contenido del piloto |
| 3 | La lección personalizada que se use en el piloto | `npm run hoja-revision -- --archivo <exportada.json>` | El piloto la usa |
| 4 | Lecciones de la biblioteca, empezando por las más usadas en el piloto y las del miembro superior | `npm run hoja-revision -- <id>` | El resto del contenido principal |
| 5 | Muestra periódica de lecciones creadas por Neuri | Igual que la 3 | Medir la calidad de las generaciones |

**Las hojas de versiones anteriores** (`brazo-2026-11-03.md` y `antebrazo-2026-11-08.md`) se conservan como histórico. Las de la versión actual son las de arriba. Si el contenido cambia, se genera una hoja nueva (`node scripts/paquete-revision.mjs brazo`) y no se reutilizan veredictos de otra versión.

**Ejemplo de hoja de una lección de la biblioteca:** `docs/revision/lecciones/cab-nariz-v1.md` («La nariz y la cavidad nasal», 101 veredictos).

## Cómo es una hoja

Cada hoja sale de la propia lección, así que lo que se revisa es exactamente lo que muestra la app. Tiene:

1. **Cómo revisar:** veredicto Correcto, Corregir (con la corrección) o Dudoso (con la duda) en cada fila.
2. **Objetivos** (O1, O2…).
3. **Estructuras del modelo 3D** (E): nombre, tipo, si se evalúa (núcleo) o solo orienta (contexto) y qué pieza del modelo es.
4. **Pasos** (P3.2 = paso 3, frase 2; P3.D1 = «Saber más»; P3.A = actividad). Cada frase va con la **cita literal** que la respalda y el enlace a la versión de la página que se leyó. La app comprobó que la cita está en la página, pero **no** que la frase sea una buena interpretación: eso es lo que se pide revisar.
5. **Preguntas** (Q): tipo, objetivo, enunciado, respuesta correcta, distractores, explicación y cita.
6. **Inspección en 3D** (V): que la pieza resaltada sea la que dice el nombre y se vea bien.
7. **Decisiones pendientes** (D): nivel, lo que falta o sobra, preguntas con más de una respuesta posible.
8. **Firma de la revisión:** nombre, formación, fecha, alcance y conclusión.
9. **Fuentes**, con licencia y fecha de lectura.

Los códigos son estables: quien revisa y quien corrige hablan de lo mismo.

## Cómo generar las hojas

Desde `web/`:

```bash
npm run hoja-revision -- cab-nariz ms-codo
```

```bash
npm run hoja-revision -- --archivo ~/Descargas/mis-lecciones-anato3d-2026-11-09.json
```

```bash
node scripts/paquete-revision.mjs antebrazo
```

- **El primero** hace una hoja por lección de la biblioteca. Las deja en `docs/revision/lecciones/<id>-v<versión>.md`.
- **El segundo** hace una hoja por lección de un archivo exportado con «Mis lecciones → Exportar todas». También acepta `build/neuri-prueba.json`, la lección que crea `npm run pet:prueba -- --crear`.
- **El tercero** hace la hoja de un módulo antiguo (brazo o antebrazo).

## Qué pasa con lo revisado

1. **Las correcciones** se aplican en la lección (`web/src/biblioteca/lecciones/<id>.js` o `web/src/content/` para los módulos), con su cita, y se sube `version`. Si cambia una pregunta, cambia su huella y los fallos anteriores de los estudiantes dejan de contar.
2. **Solo con la hoja firmada y las correcciones aplicadas** se marca la lección como revisada: `revision: { estado: 'revisado', revisor, fecha, notas }`. El revisor de formato no acepta «revisado» sin revisor y fecha.
3. **Revisar una parte no valida el resto:** una sección revisada no hace revisada la lección, y el español revisado no hace revisadas las traducciones. Si se revisó solo una parte, la lección sigue en borrador y la hoja dice qué se revisó.
4. **Las lecciones de Neuri no se marcan como revisadas:** la app no lo permite, ni importándolas. Su revisión sirve para medir la calidad y mejorar las instrucciones del autor de lecciones (anexos B y C de la especificación, `web/server/neuri/instrucciones.mjs`), cuya versión queda en cada lección creada (`origen.instrucciones`).

## Reportes de los estudiantes

Los reportes que envían los estudiantes desde la app («Reportar un problema») llegan a una cola que se revisa en la máquina, con quien decide registrado. Los comandos están en la guía operativa, apartado 5.

```bash
npm run reportes
```

```bash
npm run reportes -- decidir <id> --resultado corregido --revisor "Nombre" --nota "…"
```

```bash
npm run reportes -- retirar <leccion | leccion/pregunta> --reporte <id> --revisor "Nombre"
```

- **Qué traen:** cada reporte lleva la lección, su versión, el paso o la pregunta, la estructura, el idioma, el modelo, la categoría y un comentario opcional.
- **Qué se decide:** sobre lo reportado, no sobre la lección entera.
- **Retirar:** si un error es material, se retira la lección o la pregunta mientras se corrige. Desaparece de la app y de Neuri, y sus fallos dejan de contar contra los estudiantes. Después se publica la corrección y se repone.

## Evaluación periódica de las generaciones

Propuesta para cuando Neuri use la IA real (aún no ha creado ninguna lección real):

1. **Cada mes**, o cada vez que cambien las instrucciones, revisar una muestra de lecciones creadas. Para empezar: las de `npm run pet:prueba -- --crear` y las que los participantes del piloto exporten voluntariamente.
2. **Revisar cada una con su hoja**, anotando los problemas por categoría:
   - error anatómico;
   - cita que no respalda;
   - pregunta ambigua;
   - estructura o vista equivocada en el modelo;
   - nivel inadecuado.
3. **Registrar** cuántas frases y preguntas se revisaron y cuántas necesitaron corrección. Comparar entre versiones de las instrucciones sin sacar conclusiones de muestras pequeñas.
4. **Si aparece un error grave repetido**, corregir las instrucciones o la comprobación del servidor, subir `VERSION_INSTRUCCIONES` y volver a medir.

## Lo que no se ha hecho

- No se ha contactado a ningún docente: hacerlo depende de Carlos.
- No hay resultados de revisión ni aprobaciones.
- La cola de reportes es local (la del servidor de desarrollo). Para usarla con la web publicada hace falta un almacenamiento con permisos (guía operativa, apartado 8).
