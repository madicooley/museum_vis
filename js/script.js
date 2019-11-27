loadData().then(data => {
  let that = this;

  const vizCoord = new VizCoordinator(data);
  vizCoord.initializeView();

  console.log("here!")

  // here we load the map data
  d3.json('data/world.json').then(mapData => {
    console.log("drawing map")
    vizCoord.worldMap.drawMap(mapData);
  });

});

async function loadFile(file) {
  let data = await d3.csv(file).then(d => {
    let mapped = d.map(g => {
      for (let key in g) {
        let numKey = +key;
        if (numKey) {
          g[key] = +g[key];
        }
      }
      return g;
    });
    return mapped;
  });
  return data;
}

async function loadData() {
  let bios = await loadFile('data/museum-bio.csv');
  let geoData = await loadFile('data/cleaned-data.csv').then(d => {
    for (let row of d) {
      row.continent = row.continent.substring(0, 2);
    }
    return d;
  });

  return {
    'geoData': geoData,
    'museumBios': bios
  };
}
