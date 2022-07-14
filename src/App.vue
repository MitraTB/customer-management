<template>
  <main class="app">
    <main-layout />
  </main>
</template>

<script>
import MainLayout from "@/components/Layouts/MainLayout.vue";
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  components: {
    MainLayout,
  },
});
</script>

<style lang="scss">
@import "src/assets/Styles/Mixins/responsive";
@import "src/assets/Styles/variables";
@import "src/assets/Styles/Reset";
@import "src/assets/Styles/font";
@import "src/assets/Styles/Components/_app";
:root {
  --font-size-10: 1rem;
  --font-size-11: 1.1rem;
  --font-size-12: 1.2rem;
  --font-size-13: 1.3rem;
  --font-size-14: 1.4rem;
  --font-size-15: 1.5rem;
  --font-size-16: 1.6rem;
  --font-size-17: 1.7rem;
  --font-size-18: 1.8rem;
  --font-size-19: 1.9rem;
  --font-size-20: 2rem;
  --font-size-21: 2.1rem;
  --font-size-22: 2.2rem;
  --font-size-23: 2.3rem;
  --font-size-24: 2.4rem;
}
</style>
