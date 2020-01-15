<template>
  <div class="interface">
    <div class="left-sidebar">
      <slot name="left-sidebar"></slot>
    </div>
    <div class="shelf">
      <slot name="shelf"></slot>
    </div>
    <div class="right-sidebar">
      <slot name="right-sidebar"></slot>
    </div>
    <div class="bottom-toolbar">
      <slot name="bottom-toolbar"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Layout"
};
</script>

<style lang="scss">
@media only screen and (min-width: 1024px) {
  .interface {
    pointer-events: none;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    display: grid;
    grid-template: auto 24px / 240px auto 240px;

    .left-sidebar {
      pointer-events: auto;
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      border-radius: 1px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      transition: ease 0.2s;
    }

    .right-sidebar {
      pointer-events: auto;
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      transition: ease 0.2s;
    }

    .bottom-toolbar {
      z-index: 2;
      pointer-events: auto;
      grid-column: 1 / 4;
      grid-row: 2 / 3;
      border: 1px black;
      background-color: #fe9801;
      backdrop-filter: blur(10px);
    }

    .shelf {
      pointer-events: auto;
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      width: 200px;
      height: 200px;
      justify-self: end;
      background-color: red;
    }
  }
}
</style>
