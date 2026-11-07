# Hito 8 — Vasos ováricos y uterinos del modelo femenino

Fecha: 2026-11-07. Base: commit `c754096`. Encargo de Carlos (2026-11-06, noche): «Vasos ováricos y uterinos del modelo
femenino (no existen). Quiero que arregles eso.» Era la incidencia A1 de `docs/estado-2026-11-02.md`.

## 1. Diagnóstico

- Z-Anatomy es un cuerpo masculino: tiene arterias y venas testiculares y ninguna ovárica, uterina ni vaginal.
- En la mujer, `male_only` (`tools/anato3d_fit.py`) quita las testiculares y no quedaba nada en su lugar.
- Modelo femenino publicado: 430 arterias y 226 venas. El masculino tiene 436 y 230; las 6 de más son testiculares.
- La pelvis de Z-Anatomy apenas tiene ramas viscerales (ni vesicales, ni rectales medias, ni vaginales), tampoco en el
  hombre.

## 2. Qué se hizo

- **`tools/female_vessels.py`** (nuevo), llamado desde `build_vascular.py` solo en la mujer. 16 piezas con los nombres de
  la TA2 (`sources/z-anatomy/TA2.csv`):

  | Pieza | TA2 | Trayecto |
  |---|---|---|
  | Arteria ovárica (2) | 4285 | Tramo abdominal de la testicular de Z-Anatomy (mismo ajuste). Desde 1,8 cm por encima del origen de la ilíaca externa: por delante de los vasos ilíacos externos, por dentro y por detrás de la vena, bajo la trompa, al hilio |
  | Arteria uterina (2) | 4330 | División anterior de la ilíaca interna (al 70 % de su largo) → por encima del uréter → istmo; sube tortuosa (2 mm cada 7 mm) por el borde del útero |
  | Ramas vaginales (2) | 4332 | Del istmo, por el cuello supravaginal y la pared lateral de la vagina |
  | Rama tubárica (2) | 4335 | Bajo la trompa, hasta antes de su arco sobre el ovario |
  | Rama ovárica (2) | 4334 | Sobre el ligamento propio del ovario, hasta el hilio: se une a la arteria ovárica |
  | Vena ovárica izquierda y derecha | 5014, 5017 | Tramo abdominal de las testiculares (a la renal izquierda y a la cava); en la pelvis, paralela a la arteria; tres venas finas en el hilio |
  | Plexo venoso uterino (2) | 5047 | Dos cordones a 5,5 mm por delante y por detrás del borde del útero y por la pared de la vagina, cuatro venas oblicuas por fuera de la arteria y una comunicación con las venas del ovario |
  | Venas uterinas (2) | 5046 | Dos por lado, del plexo a la ilíaca interna, a 3,4 mm de la arteria |

- Calibres (diámetro): ovárica 1,5–1,6 mm; uterina 2,2 mm en su origen; vena ovárica 2,6 mm al desembocar; venas
  uterinas 2,4 mm.
- **Holguras:** cada eje se aparta de los órganos (útero, vejiga, vagina, ovarios, trompas, ligamentos, uréteres, sigma,
  recto, apéndice), de los vasos de Z-Anatomy de la pelvis, de los huesos y de los vasos ya trazados, y se suaviza.
- **Formas de los órganos:** `female_organs.pelvic_organs` deja en sus referencias los ejes y radios del útero, la
  vagina, las trompas y los ligamentos propios del ovario. `build_visceral.py` los guarda en
  `build/female_pelvic_organs.npz`, y `build_all.sh` construye ahora el visceral antes que el vascular.
- **Web:** fichas de los 9 tipos de vaso (`web/src/data/vasos.js`), glosario latino (ovarica, uterina, tuba, tubarius,
  vaginales…), regiones (`tools/vessel_regions.py`, que ahora añade a la tabla de la app los vasos que solo tiene la
  mujer), nombres en francés e italiano de la TA2 (corregida su errata «de l 'artère») y 27 textos traducidos (lote 032).

## 3. Errores encontrados al probarlo

- Decidir dentro o fuera de un órgano con la normal de la cara más cercana falla con el uréter de Z-Anatomy, que tiene
  las caras hacia dentro: los vasos acababan metidos en él y arrastrados por su trayecto (hasta 3 cm). Ahora se decide
  por paridad de rayos.
- Para pasar la uterina 2 mm por encima del uréter se tomaba lo más alto del uréter cercano en planta, y el uréter sube
  hasta el riñón: la arteria subía hasta L1 y medía 46 cm. Ahora solo cuenta el uréter a ±2 cm de altura.
- La porción vaginal del cuello está dentro de la vagina: el plexo y las ramas vaginales que la seguían quedaban dentro
  de ella (saltos de 12 mm al apartarlos). Ahora van por el cuello supravaginal y por fuera de la pared de la vagina.

## 4. Comprobación

- **Construcción** (`A3D_MODEL=female zsh tools/build_all.sh visceral vascular`, primero publicando en una copia):
  - arterial 430 → 440 piezas, venoso 226 → 232, índice +16;
  - las 656 piezas que ya existían, idénticas (nombres, datos, vértices, índices y límites);
  - los sistemas viscerales salieron idénticos byte a byte a los publicados;
  - `validate_models` y `check-cards` correctos; +0,1 MB en total.
- **Choques que quedan** (registro de `build_vascular.py`): hasta 7 puntos por pieza, de 0,2 a 1,6 mm, entre venas finas
  del plexo o con la pared de la vagina o la vejiga.
- **Auditoría** (`A3D_MODEL=female`, sistemas arterial y venoso): las 16 piezas, 0 vértices fuera de la piel, 0 dentro del
  hueso (a 1,8 mm o más), ninguna cara de área nula y todas con nombre en español.
- **Web:** `npm test` 42 de 42; `npm run check` correcto (2698 textos, ninguno sin traducir). En el navegador, el buscador
  encuentra las piezas; ficha de la arteria ovárica en español y de la vena ovárica izquierda en inglés, con región,
  etimología, puntos clave y la línea «Modelo 3D».
- Imágenes de Blender de la pelvis (frente, arriba, detrás, lado, hilio del ovario y cuello): en el vault, nota
  «Anato3D - Vasos ováricos y uterinos (2026-11-07)».

## 5. Simplificaciones y pendiente

- En este modelo el ovario queda justo detrás de la arteria ilíaca externa (a 1–6 mm), no por debajo de ella como en
  los atlas. Los vasos ováricos tienen que rodear la vena por dentro para llegar al hilio. Recolocar el ovario sería
  otra tarea (cambia el visceral).
- Faltan la arteria vaginal, las ramas helicinas, las arterias arcuatas y el plexo venoso vaginal propiamente dicho; el
  plexo uterino es un esquema de dos cordones.
- Sin revisar por un anatomista (como el resto del modelo femenino).
