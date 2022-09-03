<template>
  <q-list separator bordered v-if="todos.length > 0" class="q-pa-xs">
    <q-list bordered separator>
      <q-item
        dense
        v-for="todo in todos"
        :key="todo._id"
        :class="
          moment(todo.dueDate + ' ' + todo.dueTime).unix() - moment().unix() <=
          0
            ? 'bg-red-4'
            : todo.completed
            ? 'bg-green-2'
            : 'bg-grey-1'
        "
        v-ripple
      >
        <q-item-section side top>
          <q-btn
            @click="isCompleteTodo(todo)"
            :color="todo.completed ? 'positive' : 'negative'"
            :icon="todo.completed ? 'done_all' : 'crop_square'"
            flat
            round
          />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="todo.completed ? 'text-strike' : ''">{{
            todo.title
          }}</q-item-label>
          <q-item-label caption lines="2">{{ todo.description }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-weight-light text-overline">{{
            moment(todo.dueDate + " " + todo.dueTime)
              .locale("id")
              .fromNow()
          }}</q-item-label>
        </q-item-section>
        <q-separator vertical class="q-ml-sm" />
        <q-item-section side>
          <div class="row">
            <div class="column justify-center">
              <q-icon name="event" size="18px" class="q-mr-xs" />
            </div>
            <div class="column">
              <q-item-label class="row justify-end" caption>
                {{ todo.dueDate }},
              </q-item-label>
              <q-item-label class="row justify-end" caption>
                {{ todo.dueTime }}
              </q-item-label>
            </div>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="q-gutter-xs">
            <q-btn
              @click.stop="promptToDelete({ id: todo._id, name: todo.title })"
              size="sm"
              color="red"
              icon="delete"
              flat
              round
              dense
            />
            <q-btn
              @click.stop="update({ id: todo._id })"
              size="sm"
              color="teal"
              icon="edit"
              flat
              round
              dense
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-list>
</template>

<script>
import { toRefs, computed, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import moment from "moment";
export default {
  name: "TodosComponent",
  props: ["todos"],
  defineEmits: ["update"],
  setup(props, { emit }) {
    /**
     * Variable
     */
    const store = useStore();
    const $q = useQuasar();

    /**
     * Update Todo
     * */

    function update(id) {
      emit("update", id);
    }

    /**
     * Complete Todo
     */
    function isCompleteTodo(record) {
      let data = {
        id: record._id,
        title: record.title,
        checked: true,
        update: { completed: !record.completed },
      };
      store.dispatch("todos/updateTodo", data);
    }

    /**
     * Delete Todo
     */
    function promptToDelete(record) {
      $q.dialog({
        title: "Confirm",
        message: `Do you really want to delete : [ ${record.name} ] ?`,
        cancel: {
          color: "primary",
          size: "md",
          padding: "xs",
          icon: "highlight_off",
          label: null,
          flat: true,
          round: true,
        },
        ok: {
          color: "negative",
          size: "md",
          padding: "xs",
          icon: "task_alt",
          label: null,
          flat: true,
          round: true,
        },
        persistent: true,
        focus: null,
      }).onOk(() => {
        store.dispatch("todos/deleteTodo", record);
      });
    }

    /**
     * Return
     */
    return { promptToDelete, isCompleteTodo, moment, update };
  },
};
</script>
