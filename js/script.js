// loadData().then(data => {
//
//   // Creates the view objects
//   const worldMap = new Map(data);
//
//
//   // here we load the map data
//   d3.json('data/world.json').then(mapData => {
//
//     worldMap.drawMap(mapData);

d3.csv("data/cleaned-data.csv").then(museums => {
  const dataPortrait = new DataPortrait(museums)
  dataPortrait.dataSummary(museums);
})
// });
// })
//
// async function loadFile(file) {
//   let data = await d3.csv(file).then(d => {
//     let mapped = d.map(g => {
//       for (let key in g) {
//         let numKey = +key;
//         if (numKey) {
//           g[key] = +g[key];
//         }
//       }
//       return g;
//     });
//     return mapped;
//   });
//   return data;
// }
//
// async function loadData() {
//   let geoData = await loadFile('data/temp_data.csv');
//
//   return {
//     'geoData': geoData,
//   };
// }