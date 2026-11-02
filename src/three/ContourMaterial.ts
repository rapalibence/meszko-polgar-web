import * as THREE from 'three';

/** Token colors, duplicated here because GLSL cannot read CSS variables. */
const INK = new THREE.Color('#EDE8DF');
const ACCENT = new THREE.Color('#E4561B');

export function createContourMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uInk: { value: INK },
      uAccent: { value: ACCENT },
      uActiveMin: { value: 1 },
      uActiveMax: { value: 1 },
      uSweep: { value: -999 },
      uMajorEvery: { value: 1e6 },
    },
    vertexShader: /* glsl */ `
      attribute float aLevel;
      varying float vLevel;
      varying vec3 vWorld;
      void main() {
        vLevel = aLevel;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk;
      uniform vec3 uAccent;
      uniform float uActiveMin;
      uniform float uActiveMax;
      uniform float uSweep;
      uniform float uMajorEvery;
      varying float vLevel;
      varying vec3 vWorld;
      void main() {
        bool isActive = vLevel >= uActiveMin - 0.01 && vLevel <= uActiveMax + 0.01;
        float major = step(0.5, 1.0 - abs(fract(vLevel / uMajorEvery + 0.5) - 0.5) * 2.0 * uMajorEvery / 0.6);
        float sweep = 1.0 - smoothstep(0.0, 1.5, abs(vWorld.x - uSweep));
        vec3 color = uInk;
        float alpha = 0.18;
        if (major > 0.5) { color = mix(uInk, uAccent, 0.8); alpha = 0.45; }
        alpha = max(alpha, sweep * 0.55);
        color = mix(color, uInk, sweep * 0.4);
        if (isActive) { color = uAccent; alpha = 0.9; }
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}
