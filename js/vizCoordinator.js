class VizCoordinator {

  constructor(data) {
    this.data = data;
    // default year of 2000, eventually this will be replaced with year range
    this.activeYear = 2000;
    // this.activeYearRange = [1840,2020]; // default year range, currently unused
    this.activeMuseum = null;
    this.activeCountries = [];

    // let rows = this.data.geoData.filter(d => d.museum === "museum-of-modern-art" && +d.acquisition_date < 1985)

    // dictionary for year range options
    this.yearOpts = [{
        'key': 'year-acquired',
        'value': [1840, 2020]
      },
      {
        'key': 'year-created-before-bc',
        'value': [-400000, -1]
      },
      {
        'key': 'year-created-after-bc',
        'value': [1, 2020]
      }
    ]
    this.activeYearOpt = this.yearOpts[0].key;
    this.activeYearOptRange = this.yearOpts[0].value;
    this.activeYearRange = this.yearOpts[0].value;

    // initialize views to null
    this.worldMap = null;
    this.museumTabs = null;
    this.dataPortrait = null;
    this.treeMap = null;
    this.kdePlot = null;
    this.yearBrush = null;
  }

  initializeView() {
    this.kdePlot = new KdePlot(this.data, this);
    this.kdePlot.initKdePlot();

    this.yearBrush = new YearBrush(this);
    this.yearBrush.initBrush();

    this.worldMap = new Map(this.data, this);
    this.worldMap.drawMuseum(this.activeMuseum);
    // this.worldMap.drawYearSlider();

    this.museumTabs = new MuseumTabs(this.data.museumBios, this);
    this.museumTabs.drawMuseumTabs();

    this.dataPortrait = new DataPortrait(this.data.geoData, this);
    this.dataPortrait.dataSummary(this.data.geoData);

    this.treeMap = new TreeMap(this.data, this);
  }

  getWorldMap() {
    return this.worldMap;
  }

  getMuseumTabs() {
    return this.museumTabs;
  }

  getDataPortrait() {
    return this.dataPortrait;
  }

  getTreeMap() {
    return this.treeMap;
  }

  getKdePlot() {
    return this.kdePlot;
  }

  updateYear(newYear) {
    this.activeYear = newYear;
  }

  updateYearRange(newRange) { // currently unused
    this.activeYearRange = newRange;

    this.reDrawViz();
  }

  updateMuseum(newMuseum) {
    //   console.log('update museum called')
    this.activeMuseum = newMuseum;

    // this.reDrawViz();
    this.kdePlot.drawKdePlot();
  }

  updateCountries(newCountries) {
    this.activeCountries = newCountries;
  }

  updateYearOpts(index) {
    this.activeYearOpt = this.yearOpts[index].key;
    this.activeYearOptRange = this.yearOpts[index].value;
    this.activeYearRange = this.yearOpts[index].value;

    this.yearBrush.initBrush();
  }

  reDrawViz() {
    //   console.log('redrawViz called')
    this.kdePlot.drawKdePlot();
    this.worldMap.drawMuseum(this.activeMuseum);

    this.treeMap.drawTreeMap();
  }

  reDrawBrush(x0, x1) {
    this.yearBrush.redrawBrush(x0, x1);
  }
}