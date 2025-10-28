"use strict";

window.Biomes = (function () {
  const MIN_LAND_HEIGHT = 20;

  const getDefault = () => {
    const name = [
      "Marine", "Hot desert", "Cold desert", "Savanna", "Grassland",
      "Tropical seasonal forest", "Temperate deciduous forest", "Tropical rainforest",
      "Temperate rainforest", "Taiga", "Tundra", "Glacier", "Wetland"
    ];

    const color = [
      "#466eab", "#fbe79f", "#b5b887", "#d2d082", "#c8d68f",
      "#b6d95d", "#29bc56", "#7dcb35", "#409c43", "#4b6b32",
      "#96784b", "#d5e7eb", "#0b9131"
    ];

    const habitability = [0, 4, 10, 22, 30, 50, 100, 80, 90, 12, 4, 0, 12];
    const iconsDensity = [0, 3, 2, 120, 120, 120, 120, 150, 150, 100, 5, 0, 250];

    const iconsRaw = [
      {}, {dune:3, cactus:6, deadTree:1}, {dune:9, deadTree:1},
      {acacia:1, grass:9}, {grass:1}, {acacia:8, palm:1},
      {deciduous:1}, {acacia:5, palm:3, deciduous:1, swamp:1},
      {deciduous:6, swamp:1}, {conifer:1}, {grass:1}, {}, {swamp:1}
    ];

    const cost = [10,200,150,60,50,70,70,80,90,200,1000,5000,150];

    const biomesMartix = [
      new Uint8Array([1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,10]),
      new Uint8Array([3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,10,10,10]),
      new Uint8Array([5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,9,9,9,9,10,10,10]),
      new Uint8Array([5,6,6,6,6,6,6,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,10,10,10]),
      new Uint8Array([7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,10,10])
    ];

    // precompute weighted icons array
    const icons = iconsRaw.map(iconObj => {
      const arr = [];
      for (const key in iconObj) {
        const count = iconObj[key];
        for (let i = 0; i < count; i++) arr.push(key);
      }
      return arr;
    });

    return { i: d3.range(0, name.length), name, color, biomesMartix, habitability, iconsDensity, icons, cost };
  };

  function define() {
    TIME && console.time("defineBiomes");

    const cellsPack = pack.cells;
    const heights = cellsPack.h;
    const neighbors = cellsPack.c;
    const riverIds = cellsPack.r || cellsPack.fl || []; // tolerate different naming
    const flux = cellsPack.fl || new Float32Array(heights.length);
    const gridRef = cellsPack.g || cellsPack.gridReference || new Uint32Array(heights.length);

    const gridCells = grid.cells;
    const temp = gridCells.temp;
    const prec = gridCells.prec;

    const nCells = heights.length;
    const biomesArray = new Uint8Array(nCells);

    // local references for speed
    const MINH = MIN_LAND_HEIGHT;
    const rnLocal = rn;
    const isRiverFlag = (id) => Boolean(riverIds[id]);

    for (let cellId = 0; cellId < nCells; cellId++) {
      const h = heights[cellId];
      let moisture;
      if (h < MINH) {
        moisture = 0;
      } else {
        moisture = calculateMoisture(cellId, prec, gridRef, neighbors, flux, riverIds);
      }
      const temperature = temp[gridRef[cellId]];
      biomesArray[cellId] = getId(moisture, temperature, h, isRiverFlag(cellId));
    }

    pack.cells.biome = biomesArray;

    TIME && console.timeEnd("defineBiomes");
  }

  function calculateMoisture(cellId, precCache, gridRefCache, neighborsCache, fluxCache, riverCache) {
    let moisture = precCache[gridRefCache[cellId]] || 0;
    if (riverCache[cellId]) moisture += Math.max((fluxCache[cellId] || 0) / 10, 2);

    let sum = moisture;
    let count = 1;
    const neighs = neighborsCache[cellId] || [];
    for (let i = 0, ln = neighs.length; i < ln; i++) {
      const nId = neighs[i];
      if ((pack.cells.h[nId] || 0) >= MIN_LAND_HEIGHT) {
        sum += (precCache[gridRefCache[nId]] || 0);
        count++;
      }
    }
    return rn(4 + sum / count);
  }

  function getId(moisture, temperature, height, hasRiver) {
    if (height < MIN_LAND_HEIGHT) return 0;          // Marine
    if (temperature < -5) return 11;                // Glacier
    if (temperature >= 25 && !hasRiver && moisture < 8) return 1; // Hot desert
    if (isWetland(moisture, temperature, height)) return 12; // Wetland

    const moistureBand = Math.min((moisture / 5) | 0, 4);
    const temperatureBand = Math.min(Math.max(20 - temperature, 0), 25);
    return biomesData.biomesMartix[moistureBand][temperatureBand];
  }

  function isWetland(moisture, temperature, height) {
    return (temperature > -2) && ((moisture > 40 && height < 25) || (moisture > 24 && height > 24 && height < 60));
  }

  return { getDefault, define, getId };
})();