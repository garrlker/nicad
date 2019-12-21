<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'FakeValue',
  props: {
    range: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentValue: 0,
      increment: true,
      rps: 60,
      counter: 0
    }
  },
  methods: {
    updateValue(){
      requestAnimationFrame(this.updateValue)
      this.counter += 1;

      if(this.counter !== this.rps){
        return;
      }

      this.counter = 0;

      if(this.increment){
        this.currentValue += 1;
      }else{
        this.currentValue -= 1;
      }

      if(this.currentValue === this.range[0] || this.currentValue === this.range[1]){
        this.increment = !this.increment;
      }

      this.emitValue()
    },
    emitValue(){
      this.$emit("value", this.currentValue);
    }
  },
  mounted() {
    this.currentValue = this.range[0];
    this.updateValue();
  }
}
</script>
