declare module 'simplex-noise' {
  type NoiseFunction2D = (x: number, y: number) => number;
  type NoiseFunction3D = (x: number, y: number, z: number) => number;
  type NoiseFunction4D = (x: number, y: number, z: number, w: number) => number;

  export function createNoise2D(random?: () => number): NoiseFunction2D;
  export function createNoise3D(random?: () => number): NoiseFunction3D;
  export function createNoise4D(random?: () => number): NoiseFunction4D;
}
