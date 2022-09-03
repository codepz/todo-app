<template>
  <q-page class="q-pa-md">
    <!-- List Of Todo -->
    <Todos :todos="todos" @update="update" />
    <!-- Form Todo -->
    <Modal :todo="todo" :timer="timer" @update="handleRecord" />
    <!-- If Not Data -->
    <div v-if="todos.length === 0" class="absolute-center">
      <q-btn flat rounded color="grey" label="No Data Todos" />
    </div>
    <!-- Button Actions -->
    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-btn fab icon="add" color="teal" @click="openModal(true)" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { computed, watch, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import moment from "moment";
import Todos from "components/Todos/TodosComponent.vue";
import Modal from "components/Todos/ModalTodo.vue";
export default {
  name: "PageTodo",
  components: {
    Todos,
    Modal,
  },

  setup() {
    /**
     * 
     * VARIABLE FOR INIT FRAMEWORK
     ==================================================================*/
    const store = useStore();
    const $q = useQuasar();

    /**
     * 
     * DATA COLLECTIONS
     ==================================================================*/
    let todo = reactive({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
    });
    const timer = reactive({
      time: "",
      date: "",
    });
    let myInterval;

    /**
     * 
     * COMPUTED
     ==================================================================*/
    const keyword = computed(() => store.getters["todos/search"]);
    const message = computed(() => store.getters["todos/message"]);
    const todos = computed(() => {
      const data = store.getters["todos/todos"];
      if (!keyword.value.length) {
        return data;
      } else {
        return data.filter(
          (item) => item.title.toLowerCase().indexOf(keyword.value) > -1
        );
      }
    });
    /**
     * 
     * WATCH MESSAGE
     ==================================================================*/
    watch(message, (value) => {
      let type = "";
      let msg = "";
      let color = "";
      if (value) {
        if (value.success) {
          msg = value.message;
          type = "positive";
          color = "teal";
        } else {
          msg = value.message;
          type = "negative";
          color = "negative";
        }
        $q.notify({
          message: `Todo:  ${msg} `,
          // group: true,
          color: `${color}`,
          type: `${type}`,
          position: "top",
        });
      }
    });
    /**
     * 
     * MODAL ACTIONS
     ==================================================================*/

    function openModal(val) {
      store.dispatch("todos/showModal", val);
    }
    /**
     * 
     * HANDLE RECORD
     ==================================================================*/

    function handleRecord(data) {
      if (data._id) {
        store.dispatch("todos/updateTodo", {
          id: data._id,
          title: data.title,
          update: data,
        });
      } else {
        store.dispatch("todos/createTodo", data);
      }
      openModal(false);
    }
    /**
     * 
     * UPDATE TODO
     ==================================================================*/
    const record = computed(() => store.getters["todos/todo"]);
    function update(id) {
      store.dispatch("todos/getById", id);
      Object.assign(todo, record.value);
      openModal(true);
    }

    return {
      // data=========================
      todos,
      todo,
      timer,
      myInterval,

      // function=====================
      openModal,
      handleRecord,
      update,
      store,
    };
  },

  mounted() {
    this.store.dispatch("todos/getTodos");
    this.myInterval = setInterval(() => {
      this.timer.time = moment().format("H:mm:ss");
      this.timer.date = moment().format("YYYY-MMM-DD");
    }, 1000);
  },
  unmounted() {
    clearInterval(this.myInterval);
  },
};
</script>
