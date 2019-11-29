/**
*  Helper class to draw the slider snap
*/
class YearBrush {
    constructor(vizCoord){
        this.vizCoord = vizCoord;

        this.height = 40;
        this.width = 1000;
        this.margins = {'left': 35, 'right': 35, 'top': 25, 'bottom': 5};
    }

    initBrush(){
        let that = this;
        // create x scale
        let x = d3.scaleLinear()
          .domain(this.vizCoord.activeYearRange) 
          .range([0, this.width]);

        // make dropdown call update year opts
        let e = d3.select('#selectOpts').node().value;
        d3.select("#selectOpts").on("change", () => {
          let ind = +d3.select('#selectOpts').node().value;
          this.vizCoord.updateYearOpts(ind);
        })

        // create svg and translated g
        let svg = d3.select('#activeYear-brush')
            .selectAll('svg')
            .data([1])
            .join('svg')
            .attr('width', this.width + this.margins.left + this.margins.right)
            .attr('height', this.height + 40)
        let g = svg.selectAll('g')
          .data([1])
          .join('g')
          .attr('id', 'brush-group')
          .attr('transform', `translate(${this.margins.left}, 20)`);
        let labelG = g.selectAll('g')
          .data(['left', 'right', 'brush'])
          .join('g')
          .attr('id', d => d);

        let labelL = d3.select('#left')
          .selectAll('text')
          .data([1])
          .join('text')
          .attr('id', 'labelleft')
          .attr('x', -5)
          .attr('y', -5)
          .text(this.vizCoord.activeYearRange[0]);
        let labelR = d3.select('#right')
          .selectAll('text')
          .data([1])
          .join('text')
          .attr('id', 'labelright')
          .attr('x', 0)
          .attr('y', this.height + 15)
          .text(this.vizCoord.activeYearRange[1]);

        // define brush
        let brush = d3.brushX()
          .extent([[0,0], [this.width, this.height]])
          .on('brush', function() {
            let s = d3.event.selection;
            // update and move labels
            labelL.attr('x', s[0])
            .text(Math.round(x.invert(s[0])))
            labelR.attr('x', s[1])
            .text(Math.round(x.invert(s[1])) - 1)
            // move brush handles      
            // update view
            // if the view should only be updated after brushing is over, 
            // move these two lines into the on('end') part below
            svg.node().value = s.map(d => Math.round(x.invert(d)));
            svg.node().dispatchEvent(new CustomEvent("input"));
          })
          .on('end', function() {
            if (!d3.event.sourceEvent) return;
            if(d3.event.selection == null){
                d3.event.selection = [0,that.width]
            }
            let d0 = d3.event.selection.map(x.invert);
            let d1 = d0.map(Math.round)
            that.vizCoord.updateYearRange([d1[0], d1[1]]);
            d3.select(this).transition().call(d3.event.target.move, d1.map(x))
          });

        // append brush to g
        let gBrush = d3.select('#brush')
            .selectAll('g')
            .data([1])
            .join('g')
            .attr("class", "brush")
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')
            .call(brush)
        
        // select entire range
        gBrush.call(brush.move, this.vizCoord.activeYearRange.map(x));
    
        return svg.node();
    }

}