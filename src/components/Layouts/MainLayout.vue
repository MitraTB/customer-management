<template>
  <aside :class="['app__sidebar', { active }]">
    <div class="app__sidebar__logo">task manager</div>
    <app-navigation />
  </aside>
  <div class="app__wrapper">
    <header class="app__header">
      <v-btn
        class="app__header__nav"
        text
        square
        icon="icon-nav"
        @click="active = !active"
      />
      <div class="app__header__actions">
        <v-btn text square icon="icon-notification" />
        <div class="app__profile">
          <div class="app__profile__avatar">
            <img src="@/assets/user.png" alt="User" />
          </div>
          <div class="app__profile__avatar__name" v-text="username" />
        </div>
      </div>
    </header>
    <div class="app__body">
      <router-view></router-view>
    </div>
  </div>
  <app-icons />
</template>

<script>
import AppNavigation from "@/components/App/AppNavigation.vue";
import VBtn from "@/components/VBtn.vue";
import AppIcons from "@/components/App/AppIcons.vue";
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { APP_GETTER_USERNAME } from "@/Types/Store";
import { useRoute } from "vue-router";
export default defineComponent({
  components: {
    AppNavigation,
    AppIcons,
    VBtn,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const active = ref(false);
    const username = computed(() => {
      const user = store.getters[APP_GETTER_USERNAME];
      return `Hello ${user}`;
    });
    watch(
      () => route.name,
      () => {
        active.value = false;
      }
    );
    return {
      username,
      active,
    };
  },
});
</script>

<style></style>
