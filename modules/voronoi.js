class Voronoi {
  constructor(delaunay, points, pointsN) {
    this.delaunay = delaunay;
    this.points = points;
    this.pointsN = pointsN;

    this.cells = { v: [], c: [], b: [] };
    this.vertices = { p: [], v: [], c: [] };

    // --- Caches for repeated computations ---
    this._pointsOfTriangleCache = {};
    this._triangleCenterCache = {};
    this._edgesOfTriangleCache = {};
    // Reusable visit buffer for edgesAroundPoint to avoid Set allocation
    this._visitStamp = 1;
    this._visited = new Uint32Array(Math.max(16, this.delaunay.halfedges.length));

    for (let e = 0; e < this.delaunay.triangles.length; e++) {
      const p = this.delaunay.triangles[this.nextHalfedge(e)];

      if (p < this.pointsN && !this.cells.c[p]) {
        const edges = this.edgesAroundPoint(e);
        this.cells.v[p] = edges.map(e => this.triangleOfEdge(e));
        this.cells.c[p] = edges.map(e => this.delaunay.triangles[e]).filter(c => c < this.pointsN);
        this.cells.b[p] = edges.length > this.cells.c[p].length ? 1 : 0;
      }

      const t = this.triangleOfEdge(e);
      if (!this.vertices.p[t]) {
        this.vertices.p[t] = this.triangleCenter(t);
        this.vertices.v[t] = this.trianglesAdjacentToTriangle(t);
        this.vertices.c[t] = this.pointsOfTriangle(t);
      }
    }
  }

  pointsOfTriangle(t) {
    if (this._pointsOfTriangleCache[t]) return this._pointsOfTriangleCache[t];
    const edges = this.edgesOfTriangle(t);
    const points = [ this.delaunay.triangles[edges[0]],
                     this.delaunay.triangles[edges[1]],
                     this.delaunay.triangles[edges[2]] ];
    this._pointsOfTriangleCache[t] = points;
    return points;
  }

  trianglesAdjacentToTriangle(t) {
    const edges = this.edgesOfTriangle(t);
    const dah = this.delaunay.halfedges;
    return [
      this.triangleOfEdge(dah[edges[0]]),
      this.triangleOfEdge(dah[edges[1]]),
      this.triangleOfEdge(dah[edges[2]])
    ];
  }

  edgesAroundPoint(start) {
    const result = [];
    const dah = this.delaunay.halfedges;
    let incoming = start;
    const stamp = ++this._visitStamp;
    if (stamp === 0xFFFFFFFF) {
      this._visitStamp = 1;
    }
    const visited = this._visited;
    const len = visited.length;

    do {
      result.push(incoming);
      if (incoming < len) visited[incoming] = stamp;
      const outgoing = this.nextHalfedge(incoming);
      incoming = dah[outgoing];
    } while (incoming !== -1 && (incoming >= len || visited[incoming] !== stamp) && result.length < 20);

    return result;
  }

  triangleCenter(t) {
    if (this._triangleCenterCache[t]) return this._triangleCenterCache[t];
    const pts = this.pointsOfTriangle(t);
    const center = this.circumcenter(this.points[pts[0]], this.points[pts[1]], this.points[pts[2]]);
    this._triangleCenterCache[t] = center;
    return center;
  }

  edgesOfTriangle(t) {
    const c = this._edgesOfTriangleCache[t];
    if (c) return c;
    const arr = [3 * t, 3 * t + 1, 3 * t + 2];
    this._edgesOfTriangleCache[t] = arr;
    return arr;
  }
  triangleOfEdge(e) { return Math.floor(e / 3); }
  nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }
  prevHalfedge(e) { return (e % 3 === 0) ? e + 2 : e - 1; }

  circumcenter(a, b, c) {
    const [ax, ay] = a;
    const [bx, by] = b;
    const [cx, cy] = c;

    const ad = ax * ax + ay * ay;
    const bd = bx * bx + by * by;
    const cd = cx * cx + cy * cy;
    const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));

    return [
      Math.floor(1 / D * (ad * (by - cy) + bd * (cy - ay) + cd * (ay - by))),
      Math.floor(1 / D * (ad * (cx - bx) + bd * (ax - cx) + cd * (bx - ax)))
    ];
  }
}