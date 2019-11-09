loadData().then(data => {
  let that = this;

  function updateYear(year) {
    that.activeYear = year;
  }

  // Creates the view objects
  const worldMap = new Map(data, updateYear);
  const museumTabs = new MuseumTabs(data.museumBios);
  museumTabs.drawMuseumTabs();
  const dataPortrait = new DataPortrait(data.geoData, worldMap, museumTabs)
  dataPortrait.dataSummary(data.geoData);


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

async function loadData() {
  // let geoData = await loadFile('data/temp_data.csv');

  let bios = await loadFile('data/museum-bio.csv');

  let geoData = await loadFile('data/cleaned-data.csv').then(d => {
    for (let row of d) {
      row.continent = row.continent.substring(0, 2);
    }
    return d;
  });

  let cc = await loadFile('data/country_code_web.csv'); // This to get the country names from the country codes

  return {
    'geoData': geoData,
    'countryCodes': cc,
    'museumBios': bios
  };
}
