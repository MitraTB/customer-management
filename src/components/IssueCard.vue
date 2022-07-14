<template>
  <div class="tasks__cards__item">
    <div class="tasks__cards__item__wrapper">
      <h2 class="tasks__cards__item__title" v-text="issue.title" />
      <h3 class="tasks__cards__item__subtitle" v-text="issue.subtitle" />
      <p class="tasks__cards__item__desc" v-text="issue.desc" />
      <div class="tasks__cards__action">
        <v-btn
          text
          square
          icon="icon-edit"
          v-if="!issue.isDeleted && !issue.isResolved"
          @click="$emit('edit', issue)"
        ></v-btn>
        <v-btn
          text
          square
          icon="icon-delete"
          v-if="!issue.isDeleted && !issue.isResolved"
          @click="$emit('delete', issue)"
        ></v-btn>
        <v-btn
          text
          square
          icon="icon-done"
          v-if="!issue.isDeleted && !issue.isResolved"
          @click="$emit('done', issue)"
        ></v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "@vue/runtime-core";
import VBtn from "./VBtn.vue";

export default defineComponent({
  components: { VBtn },
  props: {
    item: {
      type: Object,
      default: () => ({
        title: "",
        subtitle: "",
        desc: "",
      }),
    },
  },
  setup(props) {
    const issue = computed(() => {
      return {
        title: props?.item?.title || "",
        subtitle: props?.item?.date || "",
        desc: props?.item?.desc || "",
        isDeleted: props?.item?.isDeleted,
        isResolved: props?.item?.isResolved,
      };
    });
    return {
      issue,
    };
  },
});
</script>

<style></style>
