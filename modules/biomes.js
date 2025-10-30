"use strict";

window.Biomes = (function () {
  const MIN_LAND_HEIGHT = 20;

  const getDefault = () => {
    const name = [
      "Marine", "Hot desert", "Cold desert", "Savanna", "Grassland",
      "Tropical seasonal forest", "Temperate deciduous forest", "Tropical rainforest",
      "Temperate rainforest", "Taiga", "Tundra", "Glacier", "Wetland",
      // -- Custom biomes -- //
      // Tropical & Subtropical Moist Broadleaf Forests
      "Tropical lowland rainforest", "Tropical montane rainforest",
      "Tropical moist deciduous forest", "Littoral rainforest",
      // Tropical & Subtropical Dry Forests
      "Tropical dry deciduous forest", "Tropical dry evergreen forest",
      "Tropical dry thorn forest",
      // Tropical & Subtropical Coniferous Forests
      "Tropical coniferous forest", "Subtropical coniferous forest",
      // Temperate Forests
      "Temperate deciduous forest", "Temperate mixed forest", "Temperate coniferous forest",
      // Boreal Forests / Taiga
      "Boreal spruce-fir forest", "Boreal larch forest", "Boreal pine forest",
      // Tropical & Subtropical Grasslands, Savannas & Shrublands
      "Tropical savanna grassland", "Tropical seasonal grassland", "Tropical shrubland",
      // Temperate Grasslands, Savannas & Shrublands
      "Temperate prairie", "Temperate grass-shrub mosaic",
      // Flooded Grasslands & Savannas
      "Tropical flooded grassland", "Temperate flooded grassland",
      // Montane Grasslands & Shrublands
      "Montane grassland", "Alpine grassland", "Montane shrubland",
      // Mediterranean Forests, Woodlands & Scrub
      "Mediterranean sclerophyll forest", "Mediterranean woodland & scrub",
      "Mediterranean shrubland",
      // Deserts & Xeric Shrublands
      "Subtropical desert", "Cold desert", "Semi-arid shrubland",
      "Xeric shrubland",
      // Mangroves & Coastal Wetlands
      "Tropical mangrove forest", "Subtropical mangrove forest", "Salt marsh",
      "Coastal lagoon",
      // Tundra
      "Arctic tundra", "Alpine tundra", "Polar desert",
      // Other Terrestrial / Transitional Biomes
      "Floodplain forest", "Heathland", "Peat bog", "Steppe-forest transition",
      "Riparian woodland", "Coastal dune shrubland",
      // Marine & Coastal Biomes
      "Rocky shore", "Sandy beach", "Mudflat", "Coral reef", "Barrier reef",
      "Mesophotic coral reef", "Kelp forest", "Seagrass meadow", "Upwelling zone",
      "Sea ice edge", "Atoll", "Continental shelf", "Continental slope",
      "Continental rise", "Abyssal plain", "Hadal zone", "Pelagic zone",
      "Polar open sea", "Hydrothermal vent field", "Cold seep", "Cold-water coral reef",
      "Sediment plain", "Mangrove creek", "Lagoonal sandbar", "Coastal cliff",
      "Ice shelf underside", "Ocean gyre", "Subantarctic island shelf",
      "Subantarctic island benthic", "Subantarctic shallow shelf"
    ];

    const color = [
      "#466eab", "#fbe79f", "#b5b887", "#d2d082", "#c8d68f",
      "#b6d95d", "#29bc56", "#7dcb35", "#409c43", "#4b6b32",
      "#96784b", "#d5e7eb", "#0b9131",
      // -- Custom Biome Colors --
      // Tropical & Subtropical Moist Broadleaf Forests
      "#007F0E", "#0A6B1D", "#0B8A2C", "#0C9B3B",
      // Tropical & Subtropical Dry Forests
      "#6B8E23", "#3C7A0A", "#556B2F",
      // Tropical & Subtropical Coniferous Forests
      "#2E8B57", "#228B22",
      // Temperate Forests
      "#228B22", "#006400", "#013220",
      // Boreal Forests / Taiga
      "#0B3D0B", "#1B4D1B", "#154515",
      // Tropical & Subtropical Grasslands, Savannas & Shrublands
      "#BDB76B", "#C2B280", "#A0522D",
      // Temperate Grasslands, Savannas & Shrublands
      "#EEE8AA", "#D2B48C",
      // Flooded Grasslands & Savannas
      "#6B8E23", "#556B2F",
      // Montane Grasslands & Shrublands
      "#7CFC00", "#ADFF2F", "#6B8E23",
      // Mediterranean Forests, Woodlands & Scrub
      "#556B2F", "#6B8E23", "#808000",
      // Deserts & Xeric Shrublands
      "#EDC9AF", "#D2B48C", "#C19A6B", "#CD853F",
      // Mangroves & Coastal Wetlands
      "#2E8B57", "#3CB371", "#7FFFD4", "#66CDAA",
      // Tundra
      "#FFFFFF", "#F0FFF0", "#F5F5F5",
      // Other Terrestrial / Transitional Biomes
      "#228B22", "#556B2F", "#3E8E41", "#9ACD32", "#228B22", "#DEB887",
      // Marine & Coastal Biomes
      "#A9A9A9", "#FFF5BA", "#8B4513", "#FF7F50", "#FF6347",
      "#FF4500", "#006400", "#2E8B57", "#4682B4",
      "#E0FFFF", "#20B2AA", "#5F9EA0", "#4682B4",
      "#4169E1", "#191970", "#000080", "#1E90FF",
      "#B0E0E6", "#FF4500", "#4682B4", "#FF6347",
      "#2F4F4F", "#3CB371", "#66CDAA", "#A0522D",
      "#F0FFFF", "#1E90FF", "#4682B4",
      "#191970", "#5F9EA0"
    ];

    const habitability = [
      0, 4, 10, 22, 30, 50, 100, 80, 90, 12, 4, 0, 12,
      // NEW VALUES
        // Tropical & Subtropical Moist Broadleaf Forests
      80, 60, 75, 70,
      // Tropical & Subtropical Dry Forests
      65, 60, 50,
      // Tropical & Subtropical Coniferous Forests
      55, 50,
      // Temperate Forests
      75, 70, 65,
      // Boreal Forests / Taiga
      40, 35, 30,
      // Tropical & Subtropical Grasslands, Savannas & Shrublands
      70, 65, 50,
      // Temperate Grasslands, Savannas & Shrublands
      80, 65,
      // Flooded Grasslands & Savannas
      60, 55,
      // Montane Grasslands & Shrublands
      40, 35, 45,
      // Mediterranean Forests, Woodlands & Scrub
      70, 65, 60,
      // Deserts & Xeric Shrublands
      20, 10, 25, 30,
      // Mangroves & Coastal Wetlands
      50, 45, 40, 50,
      // Tundra
      5, 10, 2,
      // Other Terrestrial / Transitional Biomes
      60, 40, 35, 55, 50, 45,
      // Marine & Coastal Biomes
      0, 0, 0, 10, 10, 10, 15, 20, 15, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    const iconsDensity = [
      0, 3, 2, 120, 120, 120, 120, 150, 150, 100, 5, 0, 250,
      // NEW VALUES
      // Tropical & Subtropical Moist Broadleaf Forests
      150, 120, 130, 140,
      // Tropical & Subtropical Dry Forests
      100, 90, 80,
      // Tropical & Subtropical Coniferous Forests
      90, 80,
      // Temperate Forests
      120, 110, 100,
      // Boreal Forests / Taiga
      80, 70, 60,
      // Tropical & Subtropical Grasslands, Savannas & Shrublands
      100, 90, 70,
      // Temperate Grasslands, Savannas & Shrublands
      110, 80,
      // Flooded Grasslands & Savannas
      90, 80,
      // Montane Grasslands & Shrublands
      50, 40, 60,
      // Mediterranean Forests, Woodlands & Scrub
      90, 80, 70,
      // Deserts & Xeric Shrublands
      20, 10, 25, 30,
      // Mangroves & Coastal Wetlands
      80, 70, 60, 60,
      // Tundra
      5, 10, 5,
      // Other Terrestrial / Transitional Biomes
      60, 40, 30, 50, 50, 40,
      // Marine & Coastal Biomes
      10, 10, 10, 20, 20, 15, 25, 30, 20, 10, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
    ];

    const iconsRaw = [
      {}, {dune:3, cactus:6, deadTree:1}, {dune:9, deadTree:1},
      {acacia:1, grass:9}, {grass:1}, {acacia:8, palm:1},
      {deciduous:1}, {acacia:5, palm:3, deciduous:1, swamp:1},
      {deciduous:6, swamp:1}, {conifer:1}, {grass:1}, {}, {swamp:1},
      // NEW VALUES
      {tropicalTree:10, palm:2, vines:3}, // Tropical lowland rainforest
      {tropicalTree:8, moss:2}, // Tropical montane rainforest
      {tropicalTree:8, deciduous:5}, // Tropical moist deciduous forest
      {tropicalTree:6, palm:3}, // Littoral rainforest
      {dryTree:6, grass:8}, // Tropical dry deciduous forest
      {dryTree:7, palm:1}, // Tropical dry evergreen forest
      {thornTree:5, cactus:3}, // Tropical dry thorn forest
      {conifer:6, tropicalTree:2}, // Tropical coniferous forest
      {conifer:7, palm:1}, // Subtropical coniferous forest
      {deciduous:8, grass:4}, // Temperate deciduous forest
      {deciduous:6, conifer:4}, // Temperate mixed forest
      {conifer:8}, // Temperate coniferous forest
      {spruce:6, fir:4}, // Boreal spruce-fir forest
      {larch:6, grass:2}, // Boreal larch forest
      {pine:7, grass:2}, // Boreal pine forest
      {acacia:8, grass:6}, // Tropical savanna grassland
      {grass:9, bush:4}, // Tropical seasonal grassland
      {bush:7, grass:3}, // Tropical shrubland
      {grass:8, wildflower:3}, // Temperate prairie
      {grass:7, shrub:4}, // Temperate grass-shrub mosaic
      {grass:8, waterPlant:3}, // Tropical flooded grassland
      {grass:6, waterPlant:3}, // Temperate flooded grassland
      {grass:5, shrub:3}, // Montane grassland
      {grass:4, alpineFlower:3}, // Alpine grassland
      {shrub:6, grass:2}, // Montane shrubland
      {sclerophyllTree:6, shrub:3}, // Mediterranean sclerophyll forest
      {sclerophyllTree:5, shrub:4}, // Mediterranean woodland & scrub
      {shrub:7, grass:2}, // Mediterranean shrubland
      {cactus:5, dryShrub:4}, // Subtropical desert
      {coldShrub:3, sparseGrass:2}, // Cold desert
      {dryShrub:5, cactus:2}, // Semi-arid shrubland
      {xericShrub:6, dryGrass:2}, // Xeric shrubland
      {mangrove:8, palm:2}, // Tropical mangrove forest
      {mangrove:6, palm:2}, // Subtropical mangrove forest
      {saltGrass:6, reed:2}, // Salt marsh
      {waterPlant:4, grass:2}, // Coastal lagoon
      {lichen:3, moss:2}, // Arctic tundra
      {grass:2, alpineFlower:3}, // Alpine tundra
      {lichen:2, moss:1}, // Polar desert
      {floodTree:5, grass:3}, // Floodplain forest
      {heath:6, shrub:2}, // Heathland
      {peatMoss:6, shrub:2}, // Peat bog
      {grass:6, shrub:3}, // Steppe-forest transition
      {riparianTree:5, grass:3}, // Riparian woodland
      {coastalShrub:6, grass:2}, // Coastal dune shrubland
      {rock:0}, // Rocky shore
      {sand:0}, // Sandy beach
      {mud:0}, // Mudflat
      {coral:5, fish:10}, // Coral reef
      {coral:5, fish:8}, // Barrier reef
      {coral:4, fish:6}, // Mesophotic coral reef
      {kelp:8, fish:5}, // Kelp forest
      {seagrass:6, fish:4}, // Seagrass meadow
      {plankton:5, fish:6}, // Upwelling zone
      {ice:0, plankton:2}, // Sea ice edge
      {coral:5, fish:6}, // Atoll
      {plankton:3, fish:2}, // Continental shelf
      {plankton:2, fish:2}, // Continental slope
      {plankton:1, fish:1}, // Continental rise
      {sediment:0, worm:1}, // Abyssal plain
      {sediment:0, worm:1}, // Hadal zone
      {plankton:5, fish:4}, // Pelagic zone
      {ice:0}, // Polar open sea
      {vent:3, chemoBacteria:3}, // Hydrothermal vent field
      {sediment:2, worm:2}, // Cold seep
      {coral:3, fish:3}, // Cold-water coral reef
      {sediment:2}, // Sediment plain
      {mangrove:5, palm:1}, // Mangrove creek
      {sand:3, grass:1}, // Lagoonal sandbar
      {rock:2, shrub:1}, // Coastal cliff
      {ice:0}, // Ice shelf underside
      {plankton:5, fish:3}, // Ocean gyre
      {plankton:2, fish:2}, // Subantarctic island shelf
      {sediment:1, worm:1}, // Subantarctic island benthic
      {plankton:2, fish:2} // Subantarctic shallow shelf
    ];

    // Original values preserved; new values appended
    const cost = [
      10,200,150,60,50,70,70,80,90,200,1000,5000,150,
      // NEW VALUES (corresponding to the additional biomes)
      300, 250, 280, 300, 260, 270, 240, 220, 200, 180, 150, 120, 150, 140, 160, 180,
      200, 180, 170, 160, 200, 190, 180, 150, 120, 100, 110, 130, 220, 230, 200, 180,
      100, 80, 120, 120, 500, 400, 350, 300, 50, 60, 60, 400, 350, 300, 250, 200, 150,
      100, 200, 180, 220, 250, 100, 120, 150, 130, 200, 180, 160, 170, 180, 120
    ];

    const biomesMartix = [
      // Moisture Band 0: Very Dry
      new Uint8Array([
        11, 11, 41, 2, 2, 2, 42, 42, 43, 3, 3, 4, 56, 56, 39, 39, 40, 40, 43, 5, 5, 6, 7, 1, 1, 1
      ]),
      // Moisture Band 1: Dry
      new Uint8Array([
        11, 11, 41, 2, 2, 42, 42, 43, 3, 3, 4, 56, 56, 37, 37, 38, 39, 5, 5, 6, 7, 1, 1, 1, 40, 40
      ]),
      // Moisture Band 2: Moderate
      new Uint8Array([
        10, 10, 26, 3, 3, 4, 5, 6, 27, 27, 28, 30, 30, 31, 31, 32, 32, 33, 34, 34, 35, 35, 36, 6, 6, 7
      ]),
      // Moisture Band 3: Moist
      new Uint8Array([
        9, 9, 24, 4, 4, 5, 6, 7, 27, 27, 28, 30, 30, 33, 33, 32, 32, 33, 34, 34, 35, 35, 36, 7, 7, 8
      ]),
      // Moisture Band 4: Very Wet
      new Uint8Array([
        7, 8, 23, 5, 5, 6, 7, 8, 13, 14, 15, 16, 44, 44, 45, 45, 46, 46, 47, 48, 48, 49, 7, 8, 8, 9
      ])
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

    const biomeNameToId = new Map();
    name.forEach((biomeName, index) => {
      biomeNameToId.set(biomeName, index);
    });

    return { i: d3.range(0, name.length), name, color, biomesMartix, habitability, iconsDensity, icons, cost, biomeNameToId };
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
    const biomeId = biomesData.biomeNameToId;

    if (height < MIN_LAND_HEIGHT) return biomeId.get("Marine");
    if (temperature < -5) return biomeId.get("Glacier");
    if (temperature >= 25 && !hasRiver && moisture < 8) return biomeId.get("Hot desert");
    if (isWetland(moisture, temperature, height)) return biomeId.get("Wetland");

    const moistureBand = Math.min((moisture / 5) | 0, 4);
    const temperatureBand = Math.min(Math.max(20 - temperature, 0), 25);
    return biomesData.biomesMartix[moistureBand][temperatureBand];
  }

  function isWetland(moisture, temperature, height) {
    return (temperature > -2) && ((moisture > 40 && height < 25) || (moisture > 24 && height > 24 && height < 60));
  }

  return { getDefault, define, getId };
})();