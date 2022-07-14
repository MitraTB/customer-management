import Navigation from "@/Variables/Navigation";

export const AppModule = {
  namespaced: true,
  state: () => ({
    navs: Navigation,
    user: {
      firstname: "Mitra",
      lastname: "Tabatabaei",
    },
    notifications: 5,
  }),
  mutations: {},
  actions: {},
  getters: {
    navigation(state) {
      return state.navs;
    },
    username(state) {
      return state?.user?.firstname || "";
    },
  },
};
