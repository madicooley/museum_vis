/**
 *  Class for the KDE plots of the museums
 */
 class KdePlot {

     constructor(data, vizCoord){
         this.data = data
         this.vizCoord = vizCoord
     }

     drawKdePlot(){
         let that = this;

         let svg = d3.select('#kde-plot');
         svg.attr('height', 600)
            .attr('width', 1000);
     }
 }