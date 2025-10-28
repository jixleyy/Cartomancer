# Start

  |
  v
[Generate Base Points]

- Data: points[]
- Cost: Low
  |
  v
[Construct Voronoi Diagram / Delaunay Triangulation] [HEAVY]
- Data: cells[], edges[]
- Cost: Medium → High (O(n log n))
- Optimizations: Use Fortune’s algorithm, Web Workers
  |
  v
[Assign Elevation / Noise Application] [MEDIUM]
- Data: cells[].elevation
- Cost: Medium
- Optimizations: Cache noise, lower-res noise + interpolation, parallelize
  |
  v
[Optional Erosion Simulation] [HEAVY]
- Data: cells[].elevation
- Cost: High (iterative slope/water flow)
- Optimizations: Simplified mesh, approximations, Web Workers
  |
  v
[Generate Rivers] [HEAVY]
- Data: rivers[], cells[], edges[]
- Cost: High (pathfinding over graph)
- Optimizations: Precompute adjacency, limit river sources, efficient pathfinding
  |
  v
[Assign Climate & Biomes] [MEDIUM]
- Data: cells[].temperature, cells[].precipitation, cells[].biome
- Cost: Medium
- Optimizations: Precompute maps, vectorize biome assignment
  |
  v
[Define Political Divisions] [MEDIUM → HEAVY]
- Data: regions[], cells[]
- Cost: Medium → High (graph traversal)
- Optimizations: Union-Find for merging, cache neighbor relationships
  |
  v
[Generate Roads & Trade Networks] [HEAVY]
- Data: roads[], cities[]
- Cost: High (shortest-path over city graph)
- Optimizations: Precompute adjacency, efficient pathfinding, incremental updates
  |
  v
[Render Map (SVG/Canvas)] [VERY HEAVY]
- Data: cells[], rivers[], roads[], regions[]
- Cost: Very High (SVG DOM is expensive)
- Optimizations: Use Canvas/WebGL, layer caching, virtual viewport rendering
  |
  v
[User Interaction & Export] [MEDIUM → HEAVY]
- Data: full map state (cells[], regions[], roads[], rivers[])
- Cost: Medium → High
- Optimizations: Incremental export, offscreen canvas, optimized JSON
  |
  v
End

[MEDIUM] → moderate cost

[HEAVY] → performance-critical steps

[VERY HEAVY] → highest cost; major optimization potential
