<template>
  <transition name="fade" appear>
    <div class="modal-overlay" v-if="model" @click="onClose"></div>
  </transition>
  <transition name="pop" appear>
    <div class="modal" role="dialog" v-if="model">
      <div class="modal__header">
        <h4 class="modal__title" v-text="title" />
        <v-btn text square icon="icon-close" @click="onClose" />
      </div>
      <div class="modal__wrapper">
        <form @submit.prevent="handleSend" novalidate>
          <div class="form__col">
            <div class="form__label">title</div>
            <input
              type="text"
              v-model="form.title"
              name="title"
              placeholder="Title"
              :class="titleClass"
            />
          </div>
          <div class="form__col">
            <div class="form__label">date</div>
            <input
              type="date"
              v-model="form.date"
              name="date"
              placeholder="YYYY-MM-DD"
              :class="dateClass"
            />
          </div>

          <div class="form__col">
            <div class="form__label">Contact</div>
            <select
              v-model="form.user"
              name="users"
              :class="userClass"
              @change="handleChangeUser"
            >
              <option
                v-for="(item, i) in users"
                :key="i"
                :value="item.email"
                v-text="item.name"
              />
            </select>
          </div>

          <div class="form__col">
            <div class="form__label">email</div>
            <input
              type="text"
              v-model="form.email"
              name="email"
              :class="emailClass"
            />
          </div>
          <div class="form__col">
            <textarea
              v-model="form.desc"
              name="desc"
              :class="descClass"
              placeholder="Description"
            />
          </div>
          <div class="form__action">
            <v-btn type="submit" color="primary">Submit</v-btn>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  ISSUE_GETTER_USERS,
  ISSUE_MODULE_CREATE_ACTION,
  ISSUE_MODULE_EDIT_ACTION,
} from "@/Types/Store";
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import VBtn from "./VBtn.vue";

export default defineComponent({
  components: { VBtn },
  props: {
    modelValue: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const model = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });
    const isEdit = computed(() => !!props?.item?.id);
    const form = reactive({
      title: "",
      date: "",
      user: "",
      email: "",
      desc: "",
      isDeleted: false,
      isModified: false,
      isResolved: false,
    });
    const users = computed(() => store.getters[ISSUE_GETTER_USERS]);
    const title = computed(() =>
      isEdit.value ? "Modify Issue" : "Create Issue"
    );
    const hastitle = computed(() => !!form.title);
    const hasdate = computed(() => !!form.date);
    const hasuser = computed(() => !!form.user);
    const hasemail = computed(() => !!form.email);
    const hasdesc = computed(() => !!form.desc);
    const titleClass = computed(() => ({
      "v-input": true,
      "v-input--error": isSubmitted.value && !hastitle.value,
    }));
    const dateClass = computed(() => ({
      "v-input": true,
      "v-input--error": isSubmitted.value && !hasdate.value,
    }));
    const userClass = computed(() => ({
      "v-input": true,
      "v-input--error": isSubmitted.value && !hasuser.value,
    }));
    const emailClass = computed(() => ({
      "v-input": true,
      "v-input--error": isSubmitted.value && !hasemail.value,
    }));
    const descClass = computed(() => ({
      "v-input": true,
      "v-input--error": isSubmitted.value && !hasdesc.value,
    }));
    const ErrorClass = computed(() => ({
      "v-input": true,
      "v-input--error": isSubmitted.value && !hasError.value,
    }));
    const isSubmitted = ref(false);
    const hasError = computed(() => {
      return (
        !hastitle.value ||
        !hasdate.value ||
        !hasuser.value ||
        !hasemail.value ||
        !hasdesc.value
      );
    });
    const handleChangeUser = (e) => {
      form.email = e?.target?.value;
    };
    const handleSend = async () => {
      isSubmitted.value = true;
      if (hasError.value) {
        return;
      } else if (isEdit.value) {
        await store.dispatch(ISSUE_MODULE_EDIT_ACTION, form);
      } else {
        await store.dispatch(ISSUE_MODULE_CREATE_ACTION, form);
      }
      onClose();
    };
    const onClose = () => {
      form.title = "";
      form.date = "";
      form.user = "";
      form.email = "";
      form.desc = "";
      model.value = false;
      isSubmitted.value = false;
    };
    watch(
      () => props?.item?.id,
      (id) => {
        if (id) {
          form.id = id;
          form.title = props.item.title;
          form.date = props.item.date;
          form.user = props.item.email;
          form.email = props.item.email;
          form.desc = props.item.desc;
          form.isDeleted = props.item.isDeleted;
          form.isModified = props.item.isModified;
          form.isResolved = props.item.isResolved;
        }
      }
    );
    return {
      model,
      form,
      users,
      title,
      titleClass,
      dateClass,
      userClass,
      emailClass,
      descClass,
      ErrorClass,
      handleChangeUser,
      handleSend,
      onClose,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "src/assets/Styles/Mixins/responsive";
.modal {
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  width: fit-content;
  height: fit-content;
  max-width: 100%;
  min-width: 400px;
  border-radius: 15px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  background: #fff;
  z-index: 999;
  transform: none;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
  }
  &__title {
    font-size: var(--font-size-14);
    font-weight: 300;
  }
  &__wrapper {
    padding: 15px;
  }
  @include sm {
    min-width: 100%;
    height: 100vh;
    border-radius: 0;
  }
}

.modal-overlay {
  content: "";
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background: #181818;
  opacity: 0.6;
  cursor: pointer;
}

.form {
  &__col {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  &__label {
    font-size: var(--font-size-12);
  }
}
.v-input {
  &--error {
    border-color: #ff1f6e;
    color: #ff1f6e;
  }
}
input,
select,
textarea {
  height: 40px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
  min-width: 200px;
  outline: none;
}
textarea {
  width: 100%;
  height: 200px;
  resize: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
