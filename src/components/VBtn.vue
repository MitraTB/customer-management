<template>
  <component :class="classes" v-bind="attributes" :is="component">
    <div class="button__wrapper">
      <svg
        v-if="loading && !square"
        class="button--loading__spinner"
        viewBox="0 0 50 50"
      >
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        />
      </svg>
      <v-icon v-if="icon" :size="iconSize" :icon="icon" />
      <slot></slot>
    </div>
  </component>
</template>

<script>
import { computed, defineComponent } from "@vue/runtime-core";
import VIcon from "./VIcon.vue";

export default defineComponent({
  components: { VIcon },
  props: {
    color: String,
    icon: String,
    loading: Boolean,
    iconSize: {
      type: String,
      default: "16",
    },
    router: Boolean,
    square: Boolean,
    dark: Boolean,
    create: Boolean,
    text: Boolean,
    inline: Boolean,
    dense: Boolean,
    block: Boolean,
  },
  setup(props, { attrs }) {
    const component = computed(() => (props.router ? "router-link" : "button"));
    const attributes = computed(() => {
      let attr = {
        type: attrs.type,
        disabled: attrs.disabled || props.loading,
      };
      if (props.router) {
        attr.to = attrs.to;
      }
      return attr;
    });
    const classes = computed(() => {
      let classes = {
        "v-btn": true,
        "v-btn__square": props.square,
        "v-btn__create": props.create,
        "v-btn__inline": props.inline,
        "v-btn__text": props.text,
        "v-btn--disabled": !!attrs.disabled,
        "v-btn--dense": props.dense,
        "v-btn--dark": props.dark,
        "v-btn--loading": props.loading,
        "v-btn--block": props.block,
      };
      if (props.color) classes[`v-btn--${props.color}`] = true;
      return classes;
    });
    return {
      component,
      attributes,
      classes,
    };
  },
});
</script>
<style lang="scss">
@import "src/assets/Styles/Components/_vbtn";
</style>
