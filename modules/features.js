"use strict";

window.Features = (function () {
  const DEEPER_LAND = 3;
  const LANDLOCKED = 2;
  const LAND_COAST = 1;
  const UNMARKED = 0;
  const WATER_COAST = -1;
  const DEEP_WATER = -2;

  function markup({distanceField, neighbors, start, increment, limit = 127}) {
    for (let distance = start, marked = 1; marked > 0 && distance !== limit; distance += increment) {
      marked = 0;
      const prevDistance = distance - increment;
      const neighs = neighbors;
      for (let cellId = 0, nCells = neighs.length; cellId < nCells; cellId++) {
        if (distanceField[cellId] !== prevDistance) continue;

        const neigh = neighs[cellId];
        for (let i = 0, ln = neigh.length; i < ln; i++) {
          const neighborId = neigh[i];
          if (distanceField[neighborId] !== UNMARKED) continue;
          distanceField[neighborId] = distance;
          marked++;
        }
      }
    }
  }

  function markupGrid() {
    TIME && console.time("markupGrid");
    Math.random = aleaPRNG(seed);

    const {h: heights, c: neighbors, b: borderCells, i} = grid.cells;
    const cellsNumber = i.length;
    const distanceField = new Int8Array(cellsNumber);
    const featureIds = new Uint16Array(cellsNumber);
    const features = [0];

    let nextUnmarked = 0;
    let featureId = 1;

    while (nextUnmarked !== -1) {
      const firstCell = nextUnmarked;
      featureIds[firstCell] = featureId;

      const land = heights[firstCell] >= 20;
      let border = Boolean(borderCells[firstCell]);

      const queue = [firstCell];
      let qIndex = 0;

      while (qIndex < queue.length) {
        const cellId = queue[qIndex++];
        if (borderCells[cellId]) border = true;

        const neigh = neighbors[cellId];
        for (let n = 0, ln = neigh.length; n < ln; n++) {
          const neighborId = neigh[n];
          const isNeibLand = heights[neighborId] >= 20;

          if (land === isNeibLand && featureIds[neighborId] === UNMARKED) {
            featureIds[neighborId] = featureId;
            queue.push(neighborId);
          } else if (land && !isNeibLand) {
            distanceField[cellId] = LAND_COAST;
            distanceField[neighborId] = WATER_COAST;
          }
        }
      }

      features.push({i: featureId, land, border, type: land ? "island" : border ? "ocean" : "lake"});

      nextUnmarked = -1;
      for (let k = 0, fk = featureIds.length; k < fk; k++) {
        if (featureIds[k] === UNMARKED) {
          nextUnmarked = k;
          break;
        }
      }
      featureId++;
    }

    markup({distanceField, neighbors, start: DEEP_WATER, increment: -1, limit: -10});

    grid.cells.t = distanceField;
    grid.cells.f = featureIds;
    grid.features = features;

    TIME && console.timeEnd("markupGrid");
  }

  function markupPack() {
    TIME && console.time("markupPack");

    const {cells, vertices} = pack;
    const {c: neighbors, b: borderCells, i} = cells;
    const packCellsNumber = i.length;
    if (!packCellsNumber) return;

    const distanceField = new Int8Array(packCellsNumber);
    const featureIds = new Uint16Array(packCellsNumber);
    const haven = createTypedArray({maxValue: packCellsNumber, length: packCellsNumber});
    const harbor = new Uint8Array(packCellsNumber);
    const features = [0];

    let nextUnmarked = 0;
    let featureId = 1;

    while (nextUnmarked !== -1) {
      const firstCell = nextUnmarked;
      featureIds[firstCell] = featureId;

      const land = isLand(firstCell);
      let border = Boolean(borderCells[firstCell]);
      let totalCells = 1;

      const queue = [firstCell];
      let qIndex = 0;

      while (qIndex < queue.length) {
        const cellId = queue[qIndex++];
        if (borderCells[cellId]) border = true;

        const neigh = neighbors[cellId];
        for (let n = 0, ln = neigh.length; n < ln; n++) {
          const neighborId = neigh[n];
          const isNeibLand = isLand(neighborId);

          if (land && !isNeibLand) {
            distanceField[cellId] = LAND_COAST;
            distanceField[neighborId] = WATER_COAST;
            if (!haven[cellId]) defineHaven(cellId);
          } else if (land && isNeibLand) {
            if (distanceField[neighborId] === UNMARKED && distanceField[cellId] === LAND_COAST)
              distanceField[neighborId] = LANDLOCKED;
            else if (distanceField[cellId] === UNMARKED && distanceField[neighborId] === LAND_COAST)
              distanceField[cellId] = LANDLOCKED;
          }

          if (!featureIds[neighborId] && land === isNeibLand) {
            queue.push(neighborId);
            featureIds[neighborId] = featureId;
            totalCells++;
          }
        }
      }

      features.push(addFeature({firstCell, land, border, featureId, totalCells}));

      nextUnmarked = -1;
      for (let k = 0, fk = featureIds.length; k < fk; k++) {
        if (featureIds[k] === UNMARKED) {
          nextUnmarked = k;
          break;
        }
      }
      featureId++;
    }

    markup({distanceField, neighbors, start: DEEPER_LAND, increment: 1});
    markup({distanceField, neighbors, start: DEEP_WATER, increment: -1, limit: -10});

    pack.cells.t = distanceField;
    pack.cells.f = featureIds;
    pack.cells.haven = haven;
    pack.cells.harbor = harbor;
    pack.features = features;

    TIME && console.timeEnd("markupPack");

    function defineHaven(cellId) {
      const neigh = neighbors[cellId];
      const waterCells = [];
      for (let i = 0, ln = neigh.length; i < ln; i++) {
        const c = neigh[i];
        if (isWater(c)) waterCells.push(c);
      }
      if (!waterCells.length) {
        haven[cellId] = 0;
        harbor[cellId] = 0;
        return;
      }
      let closestId = waterCells[0];
      let minDist = dist2(cells.p[cellId], cells.p[closestId]);
      for (let i = 1, ln = waterCells.length; i < ln; i++) {
        const w = waterCells[i];
        const d = dist2(cells.p[cellId], cells.p[w]);
        if (d < minDist) {
          minDist = d;
          closestId = w;
        }
      }
      haven[cellId] = closestId;
      harbor[cellId] = waterCells.length;
    }

    function addFeature({firstCell, land, border, featureId, totalCells}) {
      const type = land ? "island" : border ? "ocean" : "lake";
      const [startCell, featureVertices] = getCellsData(type, firstCell);
      const points = clipPoly(featureVertices.map(v => vertices.p[v]));
      const area = d3.polygonArea(points);
      const absArea = Math.abs(rn(area));

      const feature = {i: featureId, type, land, border, cells: totalCells, firstCell: startCell, vertices: featureVertices, area: absArea};

      if (type === "lake") {
        if (area > 0) feature.vertices = feature.vertices.reverse();
        feature.shoreline = unique(feature.vertices.map(v => vertices.c[v].filter(isLand)).flat());
        feature.height = Lakes.getHeight(feature);
      }

      return feature;

      function getCellsData(featureType, firstCell) {
        if (featureType === "ocean") return [firstCell, []];

        const getType = c => featureIds[c];
        const ofSameType = c => getType(c) === getType(firstCell);
        const ofDifferentType = c => !ofSameType(c);

        const startCell = findOnBorderCell(firstCell);
        const featureVertices = getFeatureVertices(startCell);
        return [startCell, featureVertices];

        function findOnBorderCell(firstCell) {
          const isOnBorder = c => borderCells[c] || neighbors[c].some(ofDifferentType);
          if (isOnBorder(firstCell)) return firstCell;

          const list = cells.i;
          for (let i = 0, ln = list.length; i < ln; i++) {
            const c = list[i];
            if (ofSameType(c) && isOnBorder(c)) return c;
          }

          throw new Error(`Markup: firstCell ${firstCell} is not on the feature or map border`);
        }

        function getFeatureVertices(startCell) {
          const vList = cells.v[startCell];
          for (let i = 0, ln = vList.length; i < ln; i++) {
            const v = vList[i];
            const vc = vertices.c[v];
            for (let j = 0, lj = vc.length; j < lj; j++) {
              if (ofDifferentType(vc[j])) return connectVertices({vertices, startingVertex: v, ofSameType, closeRing: false});
            }
          }
          throw new Error(`Markup: startingVertex for cell ${startCell} is not found`);
        }
      }
    }
  }

function specify() {
  const cells = grid.cells.i.length;
  const OCEAN_MIN_SIZE = cells / 25;
  const SEA_MIN_SIZE = cells / 1000;
  const CONTINENT_MIN_SIZE = cells / 10;
  const ISLAND_MIN_SIZE = cells / 1000;

  const features = pack.features;
  const featureCache = new Map();

  for (let idx = 0, fl = features.length; idx < fl; idx++) {
    const feature = features[idx];
    if (!feature || feature.type === "ocean") continue;

    feature.group = defineGroup(feature);

    if (feature.type === "lake") {
      if (!featureCache.has(feature.i)) {
        feature.height = Lakes.getHeight(feature);
        feature.name = Lakes.getName(feature);
        featureCache.set(feature.i, {height: feature.height, name: feature.name});
      } else {
        const cached = featureCache.get(feature.i);
        feature.height = cached.height;
        feature.name = cached.name;
      }
    }
  }

  function defineGroup(feature) {
    switch (feature.type) {
      case "island": return defineIslandGroup(feature);
      case "ocean": return defineOceanGroup(feature);
      case "lake": return defineLakeGroup(feature);
      default: throw new Error(`Markup: unknown feature type ${feature.type}`);
    }
  }

  function defineOceanGroup(feature) {
    const cellsCount = feature.cells;
    if (cellsCount > OCEAN_MIN_SIZE) return "ocean";
    if (cellsCount > SEA_MIN_SIZE) return "sea";
    return "gulf";
  }

  function defineIslandGroup(feature) {
    const prevFeatureIndex = pack.cells.f[feature.firstCell - 1];
    const prevFeature = features[prevFeatureIndex];
    if (prevFeature && prevFeature.type === "lake") return "lake_island";
    if (feature.cells > CONTINENT_MIN_SIZE) return "continent";
    if (feature.cells > ISLAND_MIN_SIZE) return "island";
    return "isle";
  }

  function defineLakeGroup(feature) {
    const {temp, height, cells, firstCell, inlets, outlet, evaporation, flux} = feature;

    if (temp < -3) return "frozen";
    if (height > 60 && cells < 10 && firstCell % 10 === 0) return "lava";

    if (!inlets && !outlet) {
      if (evaporation > flux * 4) return "dry";
      if (cells < 3 && firstCell % 10 === 0) return "sinkhole";
    }

    if (!outlet && evaporation > flux) return "salt";

    return "freshwater";
  }
}


  return {markupGrid, markupPack, specify};
})();