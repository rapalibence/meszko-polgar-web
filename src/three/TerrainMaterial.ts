import * as THREE from 'three';

/**
 * Standard material with an emissive band: vertices whose world Y lies in
 * [uActiveMin, uActiveMax] glow in the accent color. Used to light the active bench.
 */
export function createTerrainMaterial() {
  const mat = new THREE.MeshStandardMaterial({
    color: '#5A554C',
    roughness: 1,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const uniforms = {
    uActiveMin: { value: 1 },
    uActiveMax: { value: 1 },
    uAccent: { value: new THREE.Color('#E4561B') },
    uGlow: { value: 0 },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWorldY = (modelMatrix * vec4(transformed, 1.0)).y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;\nuniform float uActiveMin;\nuniform float uActiveMax;\nuniform vec3 uAccent;\nuniform float uGlow;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float band = step(uActiveMin, vWorldY) * step(vWorldY, uActiveMax);
        float edge = smoothstep(0.0, 0.35, vWorldY - uActiveMin) * smoothstep(0.0, 0.35, uActiveMax - vWorldY);
        totalEmissiveRadiance += uAccent * band * (0.10 + 0.16 * edge) * uGlow;`,
      );
  };
  return { material: mat, uniforms };
}
