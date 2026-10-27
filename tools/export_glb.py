"""Exporta una colección de un .blend generado por tools/ a GLB comprimido con Draco, como la Fase 2.

Uso:
  Blender -b --disable-autoexec --python tools/export_glb.py -- build/male_muscular.blend Muscular_System web/public/models/male-muscular.glb
"""
import bpy, sys

src, collection, out = sys.argv[sys.argv.index('--') + 1:][:3]
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.data.libraries.load(src) as (data_from, data_to):
    data_to.collections = [collection]
col = data_to.collections[0]
bpy.context.scene.collection.children.link(col)
bpy.context.view_layer.update()

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format='GLB',
    use_active_scene=True,
    export_extras=True,
    export_yup=True,
    export_apply=False,
    export_hierarchy_full_collections=True,
    export_vertex_color='ACTIVE',            # p. ej. el tono de la piel genital
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
)
print('exportado', out)
