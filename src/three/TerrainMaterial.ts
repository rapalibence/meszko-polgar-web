import * as THREE from 'three';

/**
 * Standard material with an emissive band: vertices whose world Y lies in
 * [uActiveMin, uActiveMax] glow in the accent color. Used to light the active bench.
 */
export function createTerrainMaterial() {
  const mat = new THREE.MeshStandardMaterial({
    color: '#6B655B',
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
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;\nvarying vec3 vWorldP;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvec4 wp4 = modelMatrix * vec4(transformed, 1.0);\nvWorldY = wp4.y;\nvWorldP = wp4.xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;\nvarying vec3 vWorldP;\nuniform float uActiveMin;\nuniform float uActiveMax;\nuniform vec3 uAccent;\nuniform float uGlow;\nfloat hash3(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        // Per-facet stone variation: flat shading gives one normal per facet, so quantise on it.
        float f = hash3(floor(vWorldP * 2.2));
        float strata = 0.5 + 0.5 * sin(vWorldY * 2.6);
        diffuseColor.rgb *= 0.88 + 0.2 * f + 0.06 * strata;`,
      )
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
