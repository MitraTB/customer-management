<template>
  <div class="app__page">
    <div class="app__page__header">
      <div class="app__page__header__desc">
        <div class="app__page__header__desc__title" v-text="pageTitle" />
        <div class="app__page__header__desc__subtitle" v-text="pageSubTitle" />
      </div>
      <div class="app__page__header__action">
        <v-btn
          icon="icon-plus"
          square
          dark
          color="primary"
          @click="handleCreateIssue"
        />
      </div>
    </div>
    <div class="tasks">
      <div class="tasks__filters">
        <div class="tasks__filters__status">
          <div
            class="tasks__filters__status__item"
            v-for="({ label, value }, i) in taskStatuses"
            :key="i"
            @click="handleSetTaskState(label)"
          >
            <span v-text="label" />
            <div :class="fitlerStateClasses(label)" v-text="value" />
          </div>
        </div>
        <div class="tasks__filters__status">
          <div
            class="tasks__filters__status__item"
            v-for="({ key, icon }, i) in listTypes"
            :key="i"
            @click="handleSetListType(key)"
          >
            <div :class="listTypeClasses(key)">
              <v-icon :icon="icon" />
            </div>
          </div>
        </div>
      </div>
      <issue-list
        :items="items"
        v-if="islistMode"
        @edit="hanldeedit"
        @delete="hanldedelete"
        @done="hanldedone"
      />
      <transition-group
        name="list"
        tag="div"
        class="tasks__cards"
        v-else-if="iscardMode"
      >
        <issue-card
          v-for="item in items"
          :key="item?.id || item"
          :item="item"
          @edit="hanldeedit(item)"
          @delete="hanldedelete(item)"
          @done="hanldedone(item)"
        />
      </transition-group>
    </div>
    <issue-modal v-model="showModal" :item="activeIssue" />
  </div>
</template>

<script>
import VBtn from "@/components/VBtn.vue";
import VIcon from "@/components/VIcon.vue";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
} from "@vue/runtime-core";
import IssueCard from "@/components/IssueCard.vue";
import { useStore } from "vuex";
import {
  ISSUE_GETTER_FILTER_STATE,
  ISSUE_GETTER_LIST,
  ISSUE_GETTER_LIST_STATUS,
  ISSUE_GETTER_SHOW_MODE,
  ISSUE_MODULE_DELETE_ACTION,
  ISSUE_MODULE_FILTER_ACTION,
  ISSUE_MODULE_GETALL_ACTION,
  ISSUE_MODULE_RESOLVE_ACTION,
} from "@/Types/Store";
import IssueList from "@/components/IssueList.vue";
import IssueModal from "@/components/IssueModal.vue";
export default defineComponent({
  components: { VBtn, VIcon, IssueCard, IssueList, IssueModal },
  name: "HomeView",
  setup() {
    const store = useStore();
    const showModal = ref(false);
    const pageTitle = computed(() => "Issues");
    const pageSubTitle = computed(() => "Here is List of Issues");
    const taskStatuses = computed(
      () => store.getters[ISSUE_GETTER_LIST_STATUS]
    );
    const listTypes = reactive([
      { key: "box", icon: "icon-view-box" },
      { key: "list", icon: "icon-view-list" },
    ]);
    const activeState = computed(
      () => store.getters[ISSUE_GETTER_FILTER_STATE]
    );
    const activeIssue = ref({});
    const showType = computed(() => store.getters[ISSUE_GETTER_SHOW_MODE]);
    const islistMode = computed(() => showType.value === "list");
    const iscardMode = computed(() => showType.value === "box");
    const items = computed(() => store.getters[ISSUE_GETTER_LIST]);
    const fitlerStateClasses = (state) => {
      return [
        "tasks__filters__status__count",
        {
          "tasks__filters__status__count--active": activeState.value === state,
        },
      ];
    };
    const listTypeClasses = (state) => {
      return [
        "tasks__filters__status__count",
        "tasks__filters__status__count--icon",
        {
          "tasks__filters__status__count--active": showType.value === state,
        },
      ];
    };
    const handleSetTaskState = (value) => {
      store.dispatch(ISSUE_MODULE_FILTER_ACTION, {
        type: "state",
        value,
      });
    };
    const handleSetListType = (value) => {
      store.dispatch(ISSUE_MODULE_FILTER_ACTION, {
        type: "mode",
        value,
      });
    };
    const handlegetIssues = async () => {
      await store.dispatch(ISSUE_MODULE_GETALL_ACTION);
    };
    const handleCreateIssue = () => {
      showModal.value = true;
    };
    const hanldeedit = (item) => {
      activeIssue.value = item;
      showModal.value = true;
    };
    const hanldedelete = async (item) => {
      await store.dispatch(ISSUE_MODULE_DELETE_ACTION, item);
    };
    const hanldedone = async (item) => {
      await store.dispatch(ISSUE_MODULE_RESOLVE_ACTION, item);
    };
    onMounted(async () => await handlegetIssues());
    return {
      pageTitle,
      pageSubTitle,
      taskStatuses,
      iscardMode,
      islistMode,
      listTypes,
      activeState,
      items,
      showModal,
      activeIssue,
      fitlerStateClasses,
      listTypeClasses,
      handleSetTaskState,
      handleSetListType,
      handleCreateIssue,
      hanldeedit,
      hanldedelete,
      hanldedone,
    };
  },
});
</script>
<style lang="scss">
@import "src/assets/Styles/Mixins/responsive";
@import "src/assets/Styles/variables";
.tasks {
  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    @include sm {
      flex-direction: column;
      gap: 15px;
    }
    &__status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        text-transform: capitalize;
        cursor: pointer;
      }
      &__count {
        padding: 5px;
        background-color: white;
        min-width: 24px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid $border-color;
        transition: all 0.3s linear;
        &--active {
          background-color: $app-color-primary;
          color: #ffffff;
          border-color: $app-border-primary;
        }
      }
    }
  }
  &__cards {
    padding: 20px 0 10px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    margin-left: -15px;
    margin-right: -15px;
    &__item {
      width: 100%;
      @include md {
        width: 33%;
      }
      @include lg {
        width: 25%;
      }
      padding: 15px;
      &__wrapper {
        display: flex;
        flex-direction: column;
        height: 300px;
        padding: 25px;
        background-color: white;
        border-radius: 25px;
      }
      &__title {
        font-size: var(--font-size-14);
        font-weight: 600;
        margin-bottom: 10px;
        text-transform: capitalize;
      }
      &__subtitle {
        font-size: var(--font-size-12);
        font-weight: 300;
        margin-bottom: 20px;
        padding-bottom: 10px;
        text-transform: capitalize;
        border-bottom: 1px solid $border-color;
      }
      &__desc {
        font-size: var(--font-size-12);
        line-height: 22px;
        font-weight: 400;
        margin-bottom: 20px;
        text-transform: capitalize;
      }
    }
    &__action {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex: 1;
    }
  }
  &__list {
    padding: 20px 0 10px;
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 10px;
      padding: 0 30px;
      &__cell {
        font-size: var(--font-size-12);
        font-weight: 300;
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          flex: 0.5;
        }
        &:nth-child(4) {
          flex: 1;
        }
        &:nth-child(5) {
          text-align: center;
          flex: 1;
        }
      }
    }
    &__body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 20px 30px;
      background-color: white;
      margin-bottom: 10px;
      border: 1px solid #ececee;
      border-radius: 2px;
      box-shadow: 0px 1px 5px 0px #ececee;
      &__item {
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          flex: 0.5;
        }
        &:nth-child(4) {
          flex: 1;
        }
        &:nth-child(5) {
          flex: 1;
        }
      }
      &__cell {
        &--deleted {
          border-right: 4px solid #ff1f6e;
          > .tasks__list__body__item {
            text-decoration: line-through;
          }
        }
        &--done {
          border-right: 4px solid #00eb91;
        }
      }
    }
    &__actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex: 1;
    }
  }
}
</style>
