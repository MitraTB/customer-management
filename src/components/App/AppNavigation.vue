<template>
  <nav class="app__nav">
    <ul class="app__nav__list">
      <li class="app__nav__list__item" v-for="(nav, i) in navs" :key="i">
        <router-link
          class="app__nav__list__item__link"
          :to="{ name: nav.target }"
        >
          <div class="app__nav__list__item__content">
            <v-icon class="app__nav__list__item__icon" :icon="nav.icon" />
            <span>{{ nav.name }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import VIcon from "@/components/VIcon.vue";
import { APP_GETTER_NAV } from "@/Types/Store";
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    VIcon,
  },
  setup() {
    const store = useStore();
    const navs = computed(() => store.getters[APP_GETTER_NAV]);
    return {
      navs,
    };
  },
});
</script>

<style></style>
