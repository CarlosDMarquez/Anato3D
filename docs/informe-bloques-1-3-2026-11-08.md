# Informe: bloques 1 a 3 (8 de noviembre de 2026)

Carlos pidió: «empieza con los primeros tres bloques de golpe, puedes tardarte todo lo que necesites».
Trabajo de unas **4 horas** (de las 12:50 a las 17:05, aprox.), en 10 commits, del `de28669` al `af87149`.
Comprobado al final: `npm run check` correcto, **46 de 46 pruebas**, la app probada en el navegador sin errores.

## Cronología

| Hora (aprox.) | Commit | Qué se hizo |
|---|---|---|
| 12:50 – 13:06 | `de28669`, `730fbae` | Guardar en commits el trabajo del 7 nov (logo, AO de las piezas izquierdas) y la revisión externa. Primera copia de seguridad (`2026-11-08_1306`). `git gc`: 1,5 GB → 384 MB. |
| 13:06 – 13:15 | `898b4f1` | Herramientas de comprobación recuperadas del historial y unidas en una orden (`tools/check_all.sh`). La construcción exige la versión de Blender registrada. |
| 13:15 – 15:05 | `09d004d` | Modelos: color de las piezas izquierdas igualado (110 parejas), esfínter anal externo del hombre en su sitio, fallo de picos de hasta 47 mm corregido. Los 12 sistemas de los dos modelos reconstruidos (≈30 min de construcción) y comprobados: nada empeora. |
| 15:05 – 15:29 | `ae2c69e`, `92f1ccc`, `5db3ea4` | Fichas de huesos (69) y vísceras (93) contrastadas con citas literales; documentos de fuentes (623 citas, todas encontradas). Sinónimos del brazo con fuente. Recorrido de la web guardado. |
| 15:29 – 16:27 | `cb8dd22` | Vasos y nervios: 131 fichas revisadas (solo el 55 % de lo que decían estaba respaldado; 161 frases reescritas) y 108 fichas nuevas. 758 citas comprobadas. 308 textos traducidos. |
| 16:27 – 16:57 | `ad41694` | Módulo nuevo «El antebrazo: compartimento anterior»: 13 fichas, lección de 5 pasos, 11 preguntas, 189 citas. 163 textos traducidos. Probado en español y alemán. Dos fallos del repaso encontrados y corregidos. |
| 16:57 – 17:05 | `af87149` | Segunda copia de seguridad (`2026-11-08_1657`, 904 MB), `git gc` (429 MB). Cámara anterior del ojo: idéntica en dos construcciones. |
| 17:05 – | — | Registro en la bóveda de Obsidian y en la memoria de Claude Code. |

## Dónde se fue el tiempo

- **Contenido con fuentes (≈ 2 h):** lo más largo. Cada afirmación se contrastó con una cita literal de su página y un script comprobó que la cita existe.
- **Modelos (≈ 1 h 50 min):** sobre todo la reconstrucción de los 12 sistemas de los dos modelos y su comprobación.
- **Guardar y proteger (≈ 25 min).**
- **Cierre, copias y registro (≈ 15 min).**

## Lo que queda

- **Decisiones de Carlos:** copia fuera del Mac, útero (70°/15°), compartir los paquetes de revisión, borrar copias antiguas (13 GB).
- **Para más adelante:** erratas de nombres de Z-Anatomy (requieren reconstruir), fichas de estructuras menores, bloques 4 a 7 (estimación: 14–18 h).
- **Sin revisar:** el contenido por un especialista; las traducciones (hechas con IA) por hablantes nativos.
