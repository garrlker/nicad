<template>
  <div id="app">
    <viewer ref="viewer"/>
  </div>
</template>

<script>
import Viewer from './components/Viewer.vue'
const debug = require('debug')('App');
import { CAG, CSG } from '@jscad/csg';
debug("INIT CSG", CSG);
debug("INIT CAG", CAG);

// Pollute global space with CSG operations
// for (const property in CSG) {
  // window[property] = property;
// }

export default {
  name: 'app',
  components: {
    Viewer
  },
  mounted(){
    // let myshape = CAG.rectangle({center: [5, 5, 5], size: [5, 10]});
    // let myshape = CSG.cube( {size: 40});


    // let kernel = new CSG();

    // let cube = CSG.cube({round:true});
    // let sphere = CSG.sphere({radius: 1.2});
    // let sphere = CSG.cube( { size: 5, center: [1,1,1], round:true});

    // let finalShape = cube.union(sphere);

    // JSCad Default Shape
    let cube1 = CSG.cube({size: 5, center: [1,1,1]});
    let cube2 = CSG.cube({size: 2.1});

    let sphere1 = CSG.sphere({r: 2});
    let sphere2 = CSG.sphere({r: 3, center:[-1,-1,-1]}); 

    debug("Cube 1", cube1);
    let finalShape = 
      cube1.subtract(sphere1)
      .union(
        sphere2
        .intersect(cube2)
      )

    // finalShape = 
    //   CSG.cube({size: 3, center: true}).subtract(CSG.sphere({r: 2, center: true}))
    //     .union(
    //       CSG.sphere({r: 1.3, center: true})
    //         .intersect(
    //           CSG.cube({size: 2.1, center: true})
    //         )
    //     ).translate([0, 0, 1.5]).scale(10);

    debug("Finalshape", finalShape);
    // debug("Finalshape Triangles", sphere.toTriangles());
    
  //   debug(kernel.union(
  //   kernel.subtract(
  //     CSG.cube({size: 3, center: true}),
  //     CSG.sphere({r: 2, center: true})
  //   ),
  //   kernel.intersection(
  //     CSG.sphere({r: 1.3, center: true}),
  //     CSG.cube({size: 2.1, center: true})
  //   )
  // ).translate([0, 0, 1.5]).scale(10));

  //   let myshape = CAG.prototype.union(
  //   CAG.prototype.subtract(
  //     CSG.cube({size: 3, center: true}),
  //     CSG.sphere({r: 2, center: true})
  //   ),
  //   CAG.prototype.intersect(
  //     CSG.sphere({r: 1.3, center: true}),
  //     CSG.cube({size: 2.1, center: true})
  //   )
  // ).translate([0, 0, 1.5]).scale(10);
  // let myshape = CSG.sphere();
  // let myshape = CSG.sphere({radius: 1.2});

  debug("Geometry", finalShape);
    this.$refs.viewer.setGeometry(finalShape);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
