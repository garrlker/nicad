<template v-if="node.name">
  <translate :xform="node.props.translate || [0,0,0]" v-on="$listeners" @csg="cacheCSG">
    <scale :xform="node.props.scale || [1,1,1]">
      <rotate :xform="node.props.rotate || [0,0,0]">
        <component :is="node.name" v-bind="node.props">
          <div v-if="node.children">
            <feature v-for="childNode in node.children" :key="childNode.id" :node="childNode"/>
          </div>
        </component>
      </rotate>
    </scale>
  </translate>
</template>

<script>
import * as VueCSG from "vue-csg";
export default {
  name: "Feature",
  props:{
    node:{
      type: Object,
      default: () => {}
    }
  },
  components: {
    ...VueCSG
  },
  methods:{
    cacheCSG(csg){
      this.$cachedCSG = csg;
    }
  }
};
</script>