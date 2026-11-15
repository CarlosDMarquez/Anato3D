"""Logo de Anato3D: el cráneo del modelo masculino, de frente, con luz frontal y sin sombras, sobre negro (2026-11-07).

Encargo de Carlos: «el logo de Anato3D sea el cráneo del modelo masculino algo similar a esto pero sin sombras»; de las
variantes eligió la detallada, «sin fondo, que sea todo negro».

Dos pasos (el primero en Blender, el segundo en Python con numpy, scipy y Pillow):

    /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend \\
        --python tools/logo_anato3d.py
    python3 tools/logo_anato3d.py

1. Blender (en la GPU si hay; la primera vez compila unos minutos). No guarda el .blend.
   - Las 56 piezas del cráneo (material MAT_Bone_Skull, mandíbula y dientes, sin el hioides) con subdivisión de nivel 2:
     sin ella el contorno salía en facetas.
   - Cámara ortográfica de frente, centrada en la línea media.
   - Color: difuso mate con el mapa normal del modelo (relieve de suturas, poros y forámenes). El color es un 40 % la
     textura y un 60 % marfil liso: la textura sola tiene manchas, líneas oscuras y un mentón sucio.
   - Luz: un sol desde la cámara (cada pieza tapa su propia sombra) y un entorno blanco uniforme. Tono Khronos PBR
     Neutral, como la app.
   - Pasadas de 2048 px en build/logo/: color (craneo_luz.png, RGBA de 8 bits con tramado: Pillow lee los PNG RGBA de
     16 bits como de 8, y aquí todo oscurece, nada amplía escalones) y distancia a la cámara (craneo_profundidad.png,
     gris de 16 bits, sin suavizado de bordes).
2. Python (un minuto la primera vez; el cierre queda en build/logo/hundimiento.npy):
   - Los huecos (órbitas, nariz, boca) se oscurecen según cuánto se hunden respecto a su borde: cierre morfológico de la
     profundidad con un disco de 14 mm, a 1024 px. Son agujeros, no sombras: sin ellos el cráneo se lee como una mancha
     en pequeño, y la luz frontal ilumina también su fondo.
   - Dos retoques de defectos del modelo: la ranura negra de la sien (pterión) y el escalón del vértice (bregma), que
     dejaba una muesca en el contorno (ver fill() y vertex()).
   - Simetría: la mitad derecha del modelo (izquierda de la imagen) se refleja sobre la otra. Las texturas de color de
     las piezas izquierdas son más oscuras (cigomático 0,62 frente a 0,71) y una sutura está marcada solo en ese lado.
     El mentón se toma al revés: en la derecha del modelo asoma por la mandíbula la raíz de un diente inferior.
   - Color algo menos saturado, más cerca del hueso blanco de la app.
   Lo que se deja porque es anatomía: los forámenes, las fisuras de las órbitas, las aberturas entre la rama de la
   mandíbula y el maxilar y la separación de ~0,5 mm entre los incisivos centrales (del modelo, centrada).
   Salidas:
   - docs/marca/anato3d-craneo.png: el logo sin fondo (2048 px, transparente);
   - docs/marca/anato3d-craneo-negro.png: cuadrado, sobre negro (2048 px);
   - web/public: icon-512.png, icon-192.png, icon-180.png (iPhone), icon-maskable-512.png (Android), favicon-32.png y
     favicon-16.png, sobre negro.
"""
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TMP = os.path.join(ROOT, 'build/logo')
SIZE = 2048                  # lado de los renders y del logo
SUN, FILL = 2.8, 0.5         # sol desde la cámara y entorno blanco uniforme
ALBEDO = 0.4                 # parte de la textura de color; el resto, marfil liso
IVORY = (0.80, 0.76, 0.66)   # lineal
HOLE = (0.003, 0.016, 0.93)  # los huecos empiezan a oscurecer a 3 mm de hondo; a 16 mm, el 93 %
CHIN = 874 / 1024            # fila (fracción del alto) justo bajo los incisivos inferiores: de ahí abajo, la otra mitad
SATURATION = 0.75

try:
    import bpy
except ImportError:
    bpy = None


def render():
    from mathutils import Vector
    os.makedirs(TMP, exist_ok=True)
    sc = bpy.context.scene
    skull = []
    for o in bpy.data.objects:
        if o.type == 'LIGHT': o.hide_render = True
        if o.type != 'MESH': continue
        mat = o.data.materials[0].name if o.data.materials else ''
        keep = (mat == 'MAT_Bone_Skull' or o.name.startswith('Tooth_') or o.name == 'Mandible') and o.name != 'Hyoid_Bone'
        o.hide_render = not keep
        if keep: skull.append(o)
    lo, hi = Vector((1e9,) * 3), Vector((-1e9,) * 3)
    for o in skull:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            lo, hi = Vector(map(min, lo, w)), Vector(map(max, hi, w))
    size = hi - lo
    target = Vector((0.0, (lo.y + hi.y) / 2, (lo.z + hi.z) / 2))     # x = 0: la línea media en el centro de la imagen
    cd = bpy.data.cameras.new('logo'); cd.type = 'ORTHO'; cd.ortho_scale = max(size.x, size.z) * 1.10
    cam = bpy.data.objects.new('logo', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = target + Vector((0, -1.0, 0))
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
    for o in skull:
        m = o.modifiers.new('logo_subsurf', 'SUBSURF'); m.levels = m.render_levels = 2
        m.uv_smooth = 'PRESERVE_BOUNDARIES'

    sc.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for kind in ('METAL', 'OPTIX', 'CUDA', 'HIP', 'ONEAPI'):
        try:
            prefs.compute_device_type = kind
        except TypeError:
            continue
        prefs.refresh_devices()
        gpus = [d for d in prefs.devices if d.type == kind]
        if gpus:
            for d in prefs.devices: d.use = d.type == kind
            sc.cycles.device = 'GPU'
            break
    else:
        sc.cycles.device = 'CPU'
    print('logo: Cycles en', sc.cycles.device)
    sc.render.film_transparent = True
    sc.render.resolution_x = sc.render.resolution_y = SIZE
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.view_settings.look = 'None'; sc.view_settings.exposure = 0.0; sc.view_settings.gamma = 1.0

    def new_mat(name):
        m = bpy.data.materials.new(name); nt = m.node_tree; nt.nodes.clear()
        return m, nt, nt.nodes.new('ShaderNodeOutputMaterial')

    def image(nt, src, suffix):
        n = nt.nodes.new('ShaderNodeTexImage')
        n.image = next(x.image for x in src.node_tree.nodes if x.type == 'TEX_IMAGE' and x.image and x.image.name.endswith(suffix))
        return n

    # 1. Color: difuso mate, 40 % textura y 60 % marfil, con el mapa normal.
    lit = {}
    for o in skull:
        src = o.data.materials[0]
        if src.name not in lit:
            m, nt, out = new_mat('logo_luz_' + src.name)
            bsdf, mix, nmap = nt.nodes.new('ShaderNodeBsdfDiffuse'), nt.nodes.new('ShaderNodeMix'), nt.nodes.new('ShaderNodeNormalMap')
            mix.data_type = 'RGBA'; mix.inputs['Factor'].default_value = ALBEDO; mix.inputs['A'].default_value = (*IVORY, 1)
            nt.links.new(image(nt, src, '_albedo').outputs['Color'], mix.inputs['B'])
            normal = image(nt, src, '_normal'); normal.image.colorspace_settings.name = 'Non-Color'
            nt.links.new(normal.outputs['Color'], nmap.inputs['Color'])
            nt.links.new(mix.outputs['Result'], bsdf.inputs['Color']); nt.links.new(nmap.outputs['Normal'], bsdf.inputs['Normal'])
            nt.links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
            lit[src.name] = m
        o.data.materials[0] = lit[src.name]
    world = bpy.data.worlds.new('logo'); sc.world = world
    wnt = world.node_tree; wnt.nodes.clear()
    bg, wout = wnt.nodes.new('ShaderNodeBackground'), wnt.nodes.new('ShaderNodeOutputWorld')
    bg.inputs['Color'].default_value = (1, 1, 1, 1); bg.inputs['Strength'].default_value = FILL
    wnt.links.new(bg.outputs['Background'], wout.inputs['Surface'])
    sun = bpy.data.lights.new('logo_sol', 'SUN'); sun.energy = SUN; sun.angle = 0.21          # 12°: sol algo blando
    so = bpy.data.objects.new('logo_sol', sun); sc.collection.objects.link(so)
    so.rotation_euler = cam.rotation_euler                                                    # la luz va con la cámara
    sc.view_settings.view_transform = 'Khronos PBR Neutral'
    sc.cycles.samples = 256; sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 3
    sc.render.image_settings.color_mode = 'RGBA'; sc.render.image_settings.color_depth = '8'; sc.render.dither_intensity = 1.0
    sc.render.filepath = os.path.join(TMP, 'craneo_luz.png'); bpy.ops.render.render(write_still=True)

    # 2. Distancia a la cámara (0,85–1,15 m), en gris de 16 bits, sin suavizado de bordes ni curva de color.
    m, nt, out = new_mat('logo_profundidad')
    cam_data, rng, em = nt.nodes.new('ShaderNodeCameraData'), nt.nodes.new('ShaderNodeMapRange'), nt.nodes.new('ShaderNodeEmission')
    rng.inputs['From Min'].default_value, rng.inputs['From Max'].default_value = 0.85, 1.15
    nt.links.new(cam_data.outputs['View Z Depth'], rng.inputs['Value']); nt.links.new(rng.outputs['Result'], em.inputs['Color'])
    nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
    for o in skull: o.data.materials[0] = m
    so.hide_render = True; bg.inputs['Strength'].default_value = 0
    sc.view_settings.view_transform = 'Raw'
    sc.cycles.samples = 1; sc.cycles.use_denoising = False; sc.cycles.filter_width = 0.01
    sc.render.image_settings.color_mode = 'BW'; sc.render.image_settings.color_depth = '16'
    sc.render.filepath = os.path.join(TMP, 'craneo_profundidad.png'); bpy.ops.render.render(write_still=True)
    print('logo: pasadas en', TMP)


def fill(rgb, valid, mask, ndimage):
    """Los píxeles de mask toman el color de su entorno válido: convolución normalizada, de cerca a lejos."""
    import numpy as np
    ys, xs = np.nonzero(mask)
    if not len(ys): return rgb
    m = 48
    sl = slice(max(ys.min() - m, 0), ys.max() + m + 1), slice(max(xs.min() - m, 0), xs.max() + m + 1)
    sub, src, todo = rgb[sl].copy(), valid[sl] & ~mask[sl], mask[sl].copy()
    for sigma in (1.5, 3, 6, 12):
        w = ndimage.gaussian_filter(src.astype(float), sigma)
        est = np.dstack([ndimage.gaussian_filter(sub[..., c] * src, sigma) for c in range(3)]) / np.maximum(w, 1e-9)[..., None]
        done = todo & (w > 0.2)
        sub[done] = est[done]
        todo &= ~done
    out = rgb.copy(); out[sl] = sub
    return out


def vertex(rgb, alpha, np):
    """Escalón del bregma (a 2048 px, columnas 991–1056 y filas 94–145). Las columnas [c − P, c) toman las [c − 2P, c − P)
    en espejo, desplazadas en vertical lo que sube el contorno (parábola ajustada a su izquierda); de la fila y1 a la y2 se
    funden con lo que había. Con el color premultiplicado, para no oscurecer el borde."""
    c, P = SIZE // 2, round(SIZE * 40 / 2048)
    y0, y1, y2 = (round(SIZE * v / 2048) for v in (70, 150, 175))

    def top(x):                                            # fila (con fracción) en que el alfa pasa de 0,5
        a = alpha[:y2, x]; y = int(np.argmax(a >= 0.5))
        return y - 1 + (0.5 - a[y - 1]) / max(a[y] - a[y - 1], 1e-6)
    fx = np.arange(c - 3 * P, c - P)
    coef = np.linalg.lstsq(np.stack([np.ones(len(fx)), (fx + 0.5 - c) ** 2], 1), [top(x) for x in fx], rcond=None)[0]
    fit = lambda x: coef[0] + coef[1] * (x + 0.5 - c) ** 2
    pre = np.dstack([rgb * alpha[..., None], alpha])
    out = pre.copy()
    ys = np.arange(y0, y2)
    wv = np.clip((y2 - ys) / (y2 - y1), 0, 1)[:, None]
    for x in range(c - P, c):
        xs = 2 * (c - P) - 1 - x
        sy = ys - (fit(x) - fit(xs))
        i = np.floor(sy).astype(int); fr = (sy - i)[:, None]
        new = pre[i, xs] * (1 - fr) + pre[i + 1, xs] * fr
        out[y0:y2, x] = new * wv + pre[y0:y2, x] * (1 - wv)
    a = out[..., 3]
    return np.where(a[..., None] > 1e-6, out[..., :3] / np.maximum(a, 1e-6)[..., None], rgb), a


def compose():
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage

    def disk(r):
        yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
        return xx ** 2 + yy ** 2 <= r * r

    def box(r0, r1, c0, c1):                               # región en fracciones del lado
        return slice(round(r0 * SIZE), round(r1 * SIZE)), slice(round(c0 * SIZE), round(c1 * SIZE))

    col = np.asarray(Image.open(os.path.join(TMP, 'craneo_luz.png')).convert('RGBA')).astype(float) / 255
    raw = np.asarray(Image.open(os.path.join(TMP, 'craneo_profundidad.png'))).astype(float)
    rgb, alpha = col[..., :3].copy(), col[..., 3].copy()
    inside = alpha > 0.5

    # Profundidad (m). La pasada de color suaviza los bordes y la de profundidad no: en el borde de la silueta y en alguna
    # grieta quedan píxeles con color en los que el rayo no tocó el cráneo (0). Toman la profundidad del píxel tocado más
    # cercano. Leídos como 0,85 m (lo más cercano), eran postes que el cierre unía en manchas oscuras con la forma del
    # elemento estructurante (cuadrados en las sienes, la bóveda y la mandíbula).
    d = 0.85 + 0.30 * raw / 65535
    _, (iy, ix) = ndimage.distance_transform_edt(raw == 0, return_indices=True)
    d = d[iy, ix]

    # Cuánto se hunde cada punto respecto a su borde (m): cierre morfológico de la «altura» (−profundidad) con un disco
    # de 60 px a 1024 px (14 mm). A 2048 px costaría 16 veces más; se amplía después. Fuera de la silueta vale 0 antes de
    # suavizar y ampliar: el cierre rellena las muescas del contorno y, al interpolar, manchaba el borde.
    # El cierre tarda un minuto: se guarda en build/logo/hundimiento.npy mientras la profundidad no cambie.
    f = SIZE // 1024
    h = np.where(inside, -d, -d[inside].max() - 0.05)
    cache, src = os.path.join(TMP, 'hundimiento.npy'), os.path.join(TMP, 'craneo_profundidad.png')
    if os.path.exists(cache) and os.path.getmtime(cache) > os.path.getmtime(src):
        cs = np.load(cache)
    else:
        hs = h.reshape(1024, f, 1024, f).max(axis=(1, 3))
        ins = inside.reshape(1024, f, 1024, f).any(axis=(1, 3))
        cs = (ndimage.grey_closing(hs, footprint=disk(60)) - hs) * ins
        cs = ndimage.gaussian_filter(cs, 1.2)               # el borde de los huecos sin dientes de sierra
        np.save(cache, cs)
    conc = np.asarray(Image.fromarray(cs.astype(np.float32), 'F').resize((SIZE, SIZE), Image.BILINEAR)) * inside
    lo, hi, k = HOLE
    t = np.clip((conc - lo) / (hi - lo), 0, 1)
    rgb = rgb * (1 - k * (t * t * (3 - 2 * t)))[..., None]

    # Retoques de dos defectos del modelo, en la mitad izquierda de la imagen (la que se refleja):
    # 1. Sien (pterión): donde el ala mayor del esfenoides se junta con el frontal queda una ranura negra de ~1,5 mm.
    #    Se rellenan los píxeles de ranura (hondos más de 1 mm respecto a un disco de 1,4 mm) más oscuros que el 60 % de su
    #    entorno; el surco suave de la sutura se queda.
    rows, cols = box(0.40, 0.445, 0.222, 0.295)
    sub_h = h[rows, cols]
    slot = (ndimage.grey_closing(sub_h, footprint=disk(12)) - sub_h > 0.001) & inside[rows, cols]
    lum = rgb[rows, cols] @ np.array([0.2126, 0.7152, 0.0722])
    dark = lum < 0.6 * ndimage.median_filter(lum, size=41)
    mask = np.zeros_like(inside)
    mask[rows, cols] = ndimage.binary_dilation(slot & dark, structure=disk(2)) & inside[rows, cols]
    rgb = fill(rgb, alpha > 0.5, mask, ndimage)
    # 2. Vértice (bregma): los parietales y el frontal no encajan y queda un escalón que en el contorno se ve como una
    #    muesca. Las columnas del escalón se sustituyen por las de al lado, en espejo, siguiendo la curva del contorno.
    rgb, alpha = vertex(rgb, alpha, np)

    # Color: algo menos saturado (el marfil de la textura tira a amarillo).
    lum = (rgb @ np.array([0.2126, 0.7152, 0.0722]))[..., None]
    rgb = lum + (rgb - lum) * SATURATION

    # Simetría: la mitad izquierda de la imagen en espejo y, desde justo bajo los incisivos inferiores, la derecha
    # (transición de 8 px a 1024).
    img = np.dstack([rgb, alpha])
    half = SIZE // 2
    left, right = img.copy(), img.copy()
    left[:, half:] = img[:, :half][:, ::-1]
    right[:, :half] = img[:, half:][:, ::-1]
    w = np.clip((np.arange(SIZE) - CHIN * SIZE) / (8 * f) + 0.5, 0, 1)[:, None, None]
    img = left * (1 - w) + right * w
    logo = Image.fromarray((np.clip(img, 0, 1) * 255).round().astype(np.uint8))
    os.makedirs(os.path.join(ROOT, 'docs/marca'), exist_ok=True)
    logo.save(os.path.join(ROOT, 'docs/marca/anato3d-craneo.png'), optimize=True)

    # Cuadrados sobre negro: el cráneo ocupa el 86 % del alto, centrado; en los muy pequeños, algo más nítido. En el
    # «maskable» (Android lo recorta en círculo o en otra forma), el 72 %: dentro del círculo seguro (80 % del lado).
    crop = logo.crop(logo.getbbox())
    out = (('docs/marca/anato3d-craneo-negro.png', SIZE, 0.86), ('web/public/icon-512.png', 512, 0.86),
           ('web/public/icon-192.png', 192, 0.86), ('web/public/icon-180.png', 180, 0.86),
           ('web/public/icon-maskable-512.png', 512, 0.72), ('web/public/favicon-32.png', 32, 0.86),
           ('web/public/favicon-16.png', 16, 0.86))
    for path, s, frac in out:
        hgt = round(s * frac); wid = round(crop.width * hgt / crop.height)
        part = crop.resize((wid, hgt), Image.LANCZOS)
        if s <= 32: part = part.filter(ImageFilter.UnsharpMask(radius=0.6, percent=60, threshold=0))
        # Los favicons, sin fondo: con el cuadrado negro, Safari (y otros en modo oscuro) les ponía una placa clara
        # detrás y se veían con «orillas blancas» en la pestaña (Carlos, 13 nov 2026). Los iconos de app, sobre negro.
        favicon = 'favicon' in path
        canvas = Image.new('RGBA', (s, s), (0, 0, 0, 0 if favicon else 255))
        canvas.alpha_composite(part, ((s - wid) // 2, (s - hgt) // 2))
        (canvas if favicon else canvas.convert('RGB')).save(os.path.join(ROOT, path), optimize=True)
    print('logo: docs/marca/anato3d-craneo.png, anato3d-craneo-negro.png e iconos en web/public')


if __name__ == '__main__':
    render() if bpy else compose()
