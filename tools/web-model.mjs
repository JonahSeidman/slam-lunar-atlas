// Build the site's rover.glb from the CAD export:  cd tools && npm ci && node web-model.mjs ~/Downloads/ATLAS_G071_Phoebe_Rover_web.glb ../rover.glb
// tether dropped, centred on the body, hierarchy flattened, parts merged by material, wheels/boots lightly simplified (0.5 mm), names stripped, meshopt-compressed.
// Then bump rover.glb?v= in index.html to the first 8 of its md5 and run ./build.sh.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, flatten, join, weld, meshopt, getBounds, simplifyPrimitive } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const [src, out, err = '0.0005'] = process.argv.slice(2);
await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(src), root = doc.getRoot(), scene = root.getDefaultScene() || root.listScenes()[0];

for (const n of root.listNodes()) if (/^tether_/.test(n.getName())) n.dispose();
const body = root.listNodes().find(n => n.getName() === 'body');
const b = getBounds(body), cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2;
const wrap = doc.createNode().setTranslation([-cx, 0, -cz]);
for (const n of scene.listChildren()) { scene.removeChild(n); wrap.addChild(n); }
scene.addChild(wrap);

await doc.transform(prune(), dedup(), flatten(), join({ keepNamed: false }), weld());
// only the dense organic parts (wheel cleats, seal boots) are simplified; the deck grid and radiators tear if touched
if (+err) for (const m of root.listMeshes()) for (const p of m.listPrimitives())
  if (/^(wheel_|seal_boot)/.test(p.getMaterial()?.getName() || '')) simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio: 0, error: +err });
await doc.transform(prune(), dedup());
for (const p of [...root.listNodes(), ...root.listMeshes(), ...root.listMaterials(), ...root.listAccessors(), ...root.listTextures(), ...root.listScenes()]) { p.setName(''); p.setExtras({}); }
root.getAsset().generator = 'SLAM site';
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(out, doc);
const sb = getBounds(scene);
console.log('bounds', sb.min.map(v => v.toFixed(3)).join(','), sb.max.map(v => v.toFixed(3)).join(','));
