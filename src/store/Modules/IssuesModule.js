import {
  ISSUE_ACTION,
  ISSUE_CREATE_ACTION,
  ISSUE_CREATE_FAILED,
  ISSUE_CREATE_REQUEST,
  ISSUE_CREATE_SUCCESS,
  ISSUE_DELETE_ACTION,
  ISSUE_DELETE_FAILED,
  ISSUE_DELETE_REQUEST,
  ISSUE_DELETE_SUCCESS,
  ISSUE_EDIT_ACTION,
  ISSUE_EDIT_FAILED,
  ISSUE_EDIT_REQUEST,
  ISSUE_EDIT_SUCCESS,
  ISSUE_FAILED,
  ISSUE_FILER,
  ISSUE_FILER_SHOW,
  ISSUE_FILER_TYPE,
  ISSUE_REQUEST,
  ISSUE_RESOLVE_ACTION,
  ISSUE_RESOLVE_FAILED,
  ISSUE_RESOLVE_REQUEST,
  ISSUE_RESOLVE_SUCCESS,
  ISSUE_SUCCESS,
} from "@/Types/Store";
import axios from "axios";

export const IssueModule = {
  namespaced: true,
  state: () => ({
    issues: [],
    loading: false,
    singleItemLoading: false,
    total: 0,
    modified: 0,
    deleted: 0,
    resolved: 0,
    activeState: "all",
    listMode: "box",
    users: [],
  }),
  mutations: {
    [ISSUE_REQUEST]: (state) => {
      state.loading = true;
    },
    [ISSUE_SUCCESS]: (state, payload) => {
      state.modified = 0;
      state.deleted = 0;
      state.resolved = 0;
      state.total = payload.length;
      payload.forEach((item) => {
        const user = state?.users?.find((user) => item.email === user.email);
        if (!user) {
          state.users.push({
            email: item.email,
            first_name: item.first_name,
            last_name: item.last_name,
            name: `${item.first_name} ${item.last_name}`,
          });
        }
        if (item.isModified) {
          state.modified += 1;
        }
        if (item.isDeleted) {
          state.deleted += 1;
        }
        if (item.isResolved) {
          state.resolved += 1;
        }
      });
      state.issues = payload;
      state.loading = false;
    },
    [ISSUE_FAILED]: (state) => {
      state.loading = false;
    },
    [ISSUE_CREATE_REQUEST]: (state) => {
      state.singleItemLoading = true;
    },
    [ISSUE_CREATE_SUCCESS]: (state, payload) => {
      state.singleItemLoading = false;
      state.issues.unshift(payload);
    },
    [ISSUE_CREATE_FAILED]: (state) => {
      state.singleItemLoading = false;
    },
    [ISSUE_EDIT_REQUEST]: (state) => {
      state.singleItemLoading = true;
    },
    [ISSUE_EDIT_SUCCESS]: (state, payload) => {
      const index = state.issues.findIndex((issue) => issue.id === payload.id);
      if (index > -1) state.issues[index] = payload;
      state.singleItemLoading = false;
    },
    [ISSUE_EDIT_FAILED]: (state) => {
      state.singleItemLoading = false;
    },
    [ISSUE_FILER_TYPE]: (state, payload) => {
      state.activeState = payload;
    },
    [ISSUE_FILER_SHOW]: (state, payload) => {
      state.listMode = payload;
    },
    [ISSUE_RESOLVE_REQUEST]: (state) => {
      state.singleItemLoading = true;
    },
    [ISSUE_RESOLVE_SUCCESS]: (state, payload) => {
      const index = state.issues.findIndex((issue) => issue.id === payload.id);
      if (index > -1) state.issues[index] = payload;
      state.singleItemLoading = false;
    },
    [ISSUE_RESOLVE_FAILED]: (state) => {
      state.singleItemLoading = false;
    },
    [ISSUE_DELETE_REQUEST]: (state) => {
      state.singleItemLoading = true;
    },
    [ISSUE_DELETE_SUCCESS]: (state, payload) => {
      const index = state.issues.findIndex((issue) => issue.id === payload.id);
      if (index > -1) state.issues[index] = payload;
      state.singleItemLoading = false;
    },
    [ISSUE_DELETE_FAILED]: (state) => {
      state.singleItemLoading = false;
    },
  },
  actions: {
    [ISSUE_ACTION]: async ({ commit }, payload) => {
      try {
        commit(ISSUE_REQUEST);
        const res = await axios.get("http://localhost:3000/issues");
        if (res && res.status === 200) {
          commit(ISSUE_SUCCESS, res.data, payload);
        } else {
          commit(ISSUE_FAILED);
        }
      } catch (error) {
        commit(ISSUE_FAILED);
      }
    },
    [ISSUE_CREATE_ACTION]: async ({ commit, dispatch }, payload) => {
      try {
        commit(ISSUE_CREATE_REQUEST);
        const res = await axios.post("http://localhost:3000/issues", payload);
        if (res && res.status === 200) {
          commit(ISSUE_CREATE_SUCCESS, res.data);
          dispatch(ISSUE_ACTION);
        } else {
          commit(ISSUE_CREATE_FAILED);
        }
      } catch (error) {
        commit(ISSUE_CREATE_FAILED);
      }
    },
    [ISSUE_EDIT_ACTION]: async ({ commit, dispatch }, payload) => {
      try {
        commit(ISSUE_EDIT_REQUEST);
        const res = await axios.put(
          `${`http://localhost:3000/issues`}/${payload.id}`,
          { ...payload, isModified: true }
        );
        if (res && res.status === 200) {
          commit(ISSUE_EDIT_SUCCESS, res.data);
          dispatch(ISSUE_ACTION);
        } else {
          commit(ISSUE_EDIT_FAILED);
        }
      } catch (error) {
        commit(ISSUE_EDIT_FAILED);
      }
    },
    [ISSUE_RESOLVE_ACTION]: async ({ commit, dispatch }, payload) => {
      try {
        commit(ISSUE_RESOLVE_REQUEST);
        const res = await axios.patch(
          `${`http://localhost:3000/issues`}/${payload.id}`,
          { isResolved: true }
        );
        if (res && res.status === 200) {
          commit(ISSUE_RESOLVE_SUCCESS, res.data);
          dispatch(ISSUE_ACTION);
        } else {
          commit(ISSUE_RESOLVE_FAILED);
        }
      } catch (error) {
        commit(ISSUE_EDIT_FAILED);
      }
    },
    [ISSUE_DELETE_ACTION]: async ({ commit, dispatch }, payload) => {
      try {
        commit(ISSUE_DELETE_REQUEST);
        const res = await axios.patch(
          `${`http://localhost:3000/issues`}/${payload.id}`,
          { isDeleted: true }
        );
        if (res && res.status === 200) {
          dispatch(ISSUE_ACTION);
          commit(ISSUE_DELETE_SUCCESS, res.data);
        } else {
          commit(ISSUE_DELETE_FAILED);
        }
      } catch (error) {
        commit(ISSUE_DELETE_FAILED);
      }
    },
    [ISSUE_FILER]: ({ commit }, payload) => {
      const { type, value } = payload;
      if (!type || !value) return;
      switch (type) {
        case "state":
          commit(ISSUE_FILER_TYPE, value);
          break;

        default:
          commit(ISSUE_FILER_SHOW, value);
          break;
      }
    },
  },
  getters: {
    listItems(state) {
      return state?.issues?.filter((issue) => {
        switch (state.activeState) {
          case "resolved":
            return issue.isResolved;
          case "modified":
            return issue.isModified;
          case "deleted":
            return issue.isDeleted;
          default:
            return issue;
        }
      });
    },
    listStatus(state) {
      return [
        { label: "all", value: state.total || 0 },
        { label: "modified", value: state.modified || 0 },
        { label: "deleted", value: state.deleted || 0 },
        { label: "resolved", value: state.resolved || 0 },
      ];
    },
    activeState(state) {
      return state.activeState;
    },
    showMode(state) {
      return state.listMode;
    },
    users(state) {
      return state.users;
    },
  },
};
