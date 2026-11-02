import { buildPit, type PitOptions } from './terrain';
import { buildContours } from './contours';

export type PitWorkerRequest = { opts: PitOptions; interval: number };
export type PitWorkerResponse = {
  positions: Float32Array;
  normals: Float32Array;
  contourPositions: Float32Array;
  contourLevels: Float32Array;
  extent: number;
  tierStep: number;
  ramp: { x: number; y: number; z: number; angle: number }[];
  floorY: number;
};

self.onmessage = (e: MessageEvent<PitWorkerRequest>) => {
  const { opts, interval } = e.data;
  const pit = buildPit(opts);
  const c = buildContours(pit, opts, interval);
  const msg: PitWorkerResponse = {
    positions: pit.positions,
    normals: pit.normals,
    contourPositions: c.positions,
    contourLevels: c.levels,
    extent: pit.extent,
    tierStep: opts.depth / opts.tiers,
    ramp: pit.rampSamples(48),
    floorY: -opts.depth,
  };
  (self as unknown as Worker).postMessage(msg, [
    msg.positions.buffer,
    msg.normals.buffer,
    msg.contourPositions.buffer,
    msg.contourLevels.buffer,
  ]);
};
