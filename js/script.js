loadData().then(data => {

  // Creates the view objects
  const worldMap = new Map(data);

  // here we load the map data
  d3.json('data/world.json').then(mapData => {

    worldMap.drawMap(mapData);

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

async function loadData() { //this is probably overkill
  let geoData = await loadFile('data/temp_data.csv');
  let cc = await loadFile('data/country_code_web.csv');  // This to get the country names from the country codes

  return {
    'geoData': geoData,
    'countryCodes': cc
  };
}
