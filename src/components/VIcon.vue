<template>
  <svg :class="`icon-${size}`">
    <use :xlink:href="`#${icon}`" />
  </svg>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: "icon",
    },
    size: {
      type: String,
      default: "14",
    },
  },
});
</script>

<style lang="scss">
@import "src/assets/Styles/Components/icon";
</style>
