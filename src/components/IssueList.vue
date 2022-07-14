<template>
  <div class="tasks__list">
    <div class="tasks__list__header">
      <div
        class="tasks__list__header__cell"
        v-for="(header, i) in headers"
        :key="i"
      >
        <span>{{ header.label }}</span>
      </div>
      <div class="tasks__list__header__cell">
        <span>Actions</span>
      </div>
    </div>
    <div :class="rowClass(row)" v-for="(row, x) in items" :key="x">
      <div
        class="tasks__list__body__item"
        v-for="({ value }, z) in headers"
        :key="z"
      >
        <div class="tasks__list__body__cell">
          {{ row[value] }}
        </div>
      </div>
      <div class="tasks__list__actions">
        <v-btn
          text
          square
          icon="icon-edit"
          v-if="!row.isDeleted && !row.isResolved"
          @click="$emit('edit', row)"
        ></v-btn>
        <v-btn
          text
          square
          icon="icon-delete"
          v-if="!row.isDeleted && !row.isResolved"
          @click="$emit('delete', row)"
        ></v-btn>
        <v-btn
          text
          square
          icon="icon-done"
          v-if="!row.isDeleted && !row.isResolved"
          @click="$emit('done', row)"
        ></v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import VBtn from "./VBtn.vue";

export default defineComponent({
  components: { VBtn },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const headers = [
      { value: "title", label: "Title" },
      { value: "date", label: "Date" },
      { value: "first_name", label: "user" },
      { value: "desc", label: "Decription" },
    ];
    const rowClass = (row) => {
      return [
        "tasks__list__body",
        {
          "tasks__list__body__cell--deleted": row.isDeleted,
          "tasks__list__body__cell--done": row.isResolved,
        },
      ];
    };
    return {
      headers,
      rowClass,
    };
  },
});
</script>

<style></style>
