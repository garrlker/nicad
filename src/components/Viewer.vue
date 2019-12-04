<template>
  <div class="viewer">
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { csgToGeometry } from "../lib/util";
// import { setupAttributes, wireframeVertex, wireframeFragment } from "../lib/shaders/wireframe";
const debug = require('debug')('Viewer');

export default {
  name: 'Viewer',
  methods: {
    animate() {
      requestAnimationFrame( this.animate );

      // required if controls.enableDamping or controls.autoRotate are set to true
      this.$controls.update();

      this.$renderer.render( this.$scene, this.$camera );
    },

    setGeometry(shape) {
      debug("Shape", shape);
      
      var geometry = csgToGeometry(shape);
      var material = new THREE.MeshPhongMaterial();
      var mesh = new THREE.Mesh( geometry, material );

      this.$scene.add(mesh);

      // var lineMaterial = new THREE.LineBasicMaterial({
      //   color: 0x000000
      // });

      // var line = new THREE.Line( geometry, lineMaterial );
      // this.$scene.add( line );
      // TODO: DELETE THREE MESHLINE PACKAGE, NOT INTENDED FOR WIREFRAMES

      var geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )
      var mat = new THREE.LineBasicMaterial( { color: 0, linewidth: 4 } );
      var wireframe = new THREE.LineSegments( geo, mat );
      this.$scene.add( wireframe );
    }

  },
  mounted(){
    this.$renderer = new THREE.WebGLRenderer();
    this.$renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.$renderer.domElement );

    this.$scene = new THREE.Scene();
    this.$scene.background = new THREE.Color( 0x333333 );

    var light = new THREE.PointLight( 0xffffff );
    light.position.set( 10, 10, 10 );
    this.$scene.add( light );

    var ambiLight = new THREE.AmbientLight( 0x999999 ); // soft white light
    this.$scene.add( ambiLight );

    this.$camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    debug("CAMERA", this.$camera);
    this.$controls = new OrbitControls( this.$camera, this.$renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    this.$camera.position.set( 0, 20, 1000 );
    this.$controls.update();

    // var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    // var material = new THREE.MeshBasicMaterial();
    // { color: THREE.Color(0x859ca8) }
    // var mesh = new THREE.Mesh( geometry, material );
    // this.$scene.add( mesh )

    requestAnimationFrame( this.animate );
  }
}
</script>

<style scoped>
</style>
