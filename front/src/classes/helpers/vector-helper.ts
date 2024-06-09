import { position } from "../../types";

export class VectorHelper {
  static construct(x: number, y: number): position {
    return {
      x,
      y,
    };
  }

  static add(v1: position, v2: position): position {
    return this.construct(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(v1: position, v2: position): position {
    return this.construct(v1.x - v2.x, v1.y - v2.y);
  }

  static multiplyBy(v: position, n: number): position {
    return this.construct(v.x * n, v.y * n);
  }

  static magnitude(v: position): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static distance(v1: position, v2: position): number {
    return this.magnitude(this.subtract(v1, v2));
  }
}
