<template v-if="node.name">
  <div></div>
</template>

<script>
export default {
  name: "Picking",
  props: {
    reglCtx: {
      type: Function
    }
  },
  components: {},
  watch: {
    reglCtx(ctx) {
      this.createFBO(ctx);
    }
  },
  methods: {
    createFBO(regl) {
      this.$fbo = regl.framebuffer({
        width: 960,
        height: 540
      });

      var drawRed = regl({
        // In a draw call, we can pass the shader source code to regl
        frag: `
          precision mediump float;
          uniform vec4 color;
          void main () {
            gl_FragColor = color;
          }`,

        vert: `
          precision mediump float;
          attribute vec2 position;
          void main () {
            gl_Position = vec4(position, 0, 1);
          }`,

        attributes: {
          position: [[-1, 0], [0, -1], [1, 1]]
        },

        uniforms: {
          color: [1, 0, 0, 1]
        },

        count: 3
      });

      var drawFBO = regl({
        // In a draw call, we can pass the shader source code to regl
        frag: `
          precision mediump float;
          uniform vec4 color;
          void main () {
            gl_FragColor = color;
          }`,

        vert: `
          precision mediump float;
          attribute vec2 position;
          void main () {
            gl_Position = vec4(position, 0, 1);
          }`,

        attributes: {
          position: [[-1, 0], [0, -1], [1, 1]]
        },

        uniforms: {
          color: [1, 0, 0, 1]
        },

        framebuffer: this.$fbo,

        count: 3
      });

      drawRed();
      drawFBO();

      regl.frame(() => {
        drawFBO();
      })

      console.log("FBO", regl.read({
        framebuffer: this.$fbo,
        x: 480,
        y: 270,
        width: 1,
        height: 1,
      }));
    }
  }
};
</script>