import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import todos from "./store-todo.js";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
      todos,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
