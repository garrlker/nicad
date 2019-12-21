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
      debug("Scene", this.$scene);

      // Clear previous geometry
      if(this.$mesh){
        this.$scene.remove(this.$mesh);
        this.$geometry.dispose();
        this.$material.dispose();

        this.$scene.remove(this.$linewireframe);
        this.$linegeo.dispose();
        this.$linemat.dispose();
      }
      
      this.$geometry = csgToGeometry(shape);
      this.$material = new THREE.MeshPhongMaterial({side: THREE.FrontSide});
      this.$mesh = new THREE.Mesh( this.$geometry, this.$material );

      this.$scene.add(this.$mesh);

      // var lineMaterial = new THREE.LineBasicMaterial({
      //   color: 0x000000
      // });

      // var line = new THREE.Line( this.$geometry, lineMaterial );
      // this.$scene.add( line );
      // TODO: DELETE THREE MESHLINE PACKAGE, NOT INTENDED FOR WIREFRAMES

      this.$linegeo = new THREE.EdgesGeometry( this.$geometry ); // or WireframeGeometry( this.$geometry )
      this.$linemat = new THREE.LineBasicMaterial( { color: 0, linewidth: 4 } );
      this.$linewireframe = new THREE.LineSegments( this.$linegeo, this.$linemat );
      this.$scene.add( this.$linewireframe );
    }

  },
  mounted(){
    this.$renderer = new THREE.WebGLRenderer();
    this.$renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.$renderer.domElement );

    this.$scene = new THREE.Scene();
    this.$scene.background = new THREE.Color( 0x333333 );

    var light = new THREE.PointLight( 0xffffff, 0.35, 0, 2 );
    // light.position.set( 0, 0, 0 );
    // this.$scene.add( light );

    var ambiLight = new THREE.AmbientLight( 0x999999 ); // soft white light
    this.$scene.add( ambiLight );

    let width = window.innerWidth / 50;
    let height = window.innerHeight / 50;

    this.$camera = new THREE.OrthographicCamera( -width, width, height, -height, -1000, 10000 );
    this.$camera.add( light );
    this.$scene.add(this.$camera);
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
