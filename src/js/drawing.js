import { phongVertex, phongFragment } from "./shaders/phongShading";
import { previewVertex, previewFragment } from "./shaders/previewShading";
import { lineVertex, lineFragment } from "./shaders/lineShading";
import { csgToGeometry } from "./util";

function createGeometry(regl, csg) {
  var { vertices, normals, colors } = csgToGeometry(csg);

  return regl({
    primitive: "triangles",
    count: vertices.length,
    vert: phongVertex,
    frag: phongFragment,
    attributes: {
      position: vertices,
      normal: normals,
      color: colors
    },
    cull: {
      enable: true,
      face: "back"
    }
  });
}

function createEdge(regl, csg) {
  var edges = [];
  csg.polygons.forEach(polygon => {
    polygon.vertices.forEach((startVtx, index) => {
      if (polygon.vertices[index + 1]) {
        var endVtx = polygon.vertices[index + 1];

        edges.push(
          [startVtx.pos._x, startVtx.pos._y, startVtx.pos._z],
          [endVtx.pos._x, endVtx.pos._y, endVtx.pos._z]
        );
      }
    });
  });

  return regl({
    primitive: "lines",
    count: edges.length,
    vert: lineVertex,
    frag: lineFragment,
    attributes: {
      position: edges
    },
    lineWidth: 6
  });
}
function createPreview(regl, csg) {
  var { vertices } = csgToGeometry(csg);

  return regl({
    primitive: "triangles",
    count: vertices.length,
    vert: previewVertex,
    frag: previewFragment,
    attributes: {
      position: vertices
    },
    uniforms: {
      color: [0.99, 0.59, 0.0, 1.0]
    },
    cull: {
      enable: true,
      face: "back"
    },
    depth: {
      enable: false
    },
    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: 0,
        dstRGB: "one minus src alpha",
        dstAlpha: 1
      },
      equation: {
        rgb: "add",
        alpha: "add"
      },
      color: [1, 1, 1, 1]
    }
  });
}

export { createGeometry, createEdge, createPreview };
