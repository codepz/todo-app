import { api } from "../boot/axios";

const state = {
  todos: [],
  message: "",
  modal: false,
  todo: {},
  search: "",
};

const mutations = {
  SET_TODOS(state, payload) {
    state.todos = payload;
  },
  SET_TODO(state, payload) {
    const data = state.todos.find((x) => x._id === payload.id);
    Object.assign(state.todo, data);
  },
  CREATE_TODO(state, payload) {
    state.todos.unshift(payload);
  },
  UPDATE_TODO(state, payload) {
    const data = state.todos.find((x) => x._id === payload.todo._id);
    const { message, ...others } = payload;
    Object.assign(data, others.todo);
  },
  DELETE_TODO(state, payload) {
    const i = state.todos.map((x) => x._id).indexOf(payload);
    state.todos.splice(i, 1);
  },
  SET_MESSAGE(state, payload) {
    state.message = payload;
  },
  SET_MODAL(state, payload) {
    state.modal = payload;
  },
  SET_SEARCH(state, payload) {
    state.search = payload;
  },
};

const actions = {
  "SOCKET_todo:create"({ commit }, payload) {
    commit("CREATE_TODO", payload);
  },

  "SOCKET_todo:update"({ commit }, payload) {
    commit("UPDATE_TODO", payload);
  },

  "SOCKET_todo:delete"({ commit }, payload) {
    commit("DELETE_TODO", payload._id);
  },

  setSearch({ commit }, payload) {
    commit("SET_SEARCH", payload);
  },
  showModal({ commit }, payload) {
    commit("SET_MODAL", payload);
  },

  getById({ commit }, payload) {
    commit("SET_TODO", payload);
  },

  async getTodos({ commit }) {
    const response = await api.get("/todos");
    commit("SET_TODOS", response.data);
  },

  async createTodo({ commit }, payload) {
    try {
      const response = await api.post(`/todos`, payload);
      commit("SET_MESSAGE", {
        success: true,
        message: `[ CREATE ] : ${response.data.title}, Successfully!`,
      });
    } catch (err) {
      commit("SET_MESSAGE", {
        success: false,
        message: `[Field required!], Title Harus Di isi`,
      });
    }
  },

  async updateTodo({ commit }, payload) {
    try {
      const response = await api.patch(`/todos/${payload.id}`, payload.update);

      let message = `[ X ] : ${payload.title}, Not Completed!`;
      if (payload.checked) {
        if (response.data.todo.completed)
          message = `[ DONE ] : ${payload.title}, Completed!`;
      } else {
        message = `[ UPDATE ] : ${payload.title}, Successfully`;
      }
      commit("SET_MESSAGE", { success: true, message });
    } catch (err) {
      commit("SET_MESSAGE", {
        success: false,
        message: `${err.message}`,
      });
    }
  },

  async deleteTodo({ commit }, payload) {
    try {
      await api.delete(`/todos/${payload.id}`);

      commit("SET_MESSAGE", {
        success: false,
        message: `[ DELETE ] : ${payload.name}, Successfully!`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

const getters = {
  todos: (state) => {
    return state.todos;
  },
  todo: (state) => {
    return state.todo;
  },
  message: (state) => {
    return state.message;
  },
  modal: (state) => {
    return state.modal;
  },
  search: (state) => state.search,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
