<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-teal">
      <q-toolbar>
        <q-toolbar-title class="flex flex-center">
          <q-input
            rounded
            dense
            color="white"
            bg-color="white"
            outlined
            v-model="search"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer class="bg-teal">
      <q-tabs dense>
        <q-route-tab
          v-for="(link, idx) in essentialLinks"
          :key="idx"
          :to="link.link"
          :name="link.name"
          :icon="link.icon"
          :label="link.title"
          exact
        />
      </q-tabs>
    </q-footer>
    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      show-if-above
      bordered
      class="bg-teal-1"
    >
      <q-list>
        <q-item-label header> Navigation {{ answer }}</q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    name: "home",
    title: "Home",
    icon: "home",
    link: "/",
  },
  {
    name: "todo",
    title: "Todo",
    icon: "list",
    link: "/todo",
  },
  {
    name: "blog",
    title: "Blog",
    icon: "home_work",
    link: "/blog",
  },
  {
    name: "settings",
    title: "Settings",
    icon: "settings",
    link: "/setting",
  },
];

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const store = useStore();
    const leftDrawerOpen = ref(false);
    const search = ref("");
    const answer = ref("");

    watch(search, async (newQuestion, oldQuestion) => {
      if (newQuestion.indexOf("?") > -1) {
        answer.value = "Thinking...";
      } else {
        store.dispatch("todos/setSearch", newQuestion);
      }
    });

    return {
      search,
      answer,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>

<style lang="scss" scoped>
/* set breakpoint for display footer */
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}
/* set color class active list*/
.q-drawer {
  .q-router-link--exact-active {
    color: #ff5722 !important;
    backgroun-color: white !important;
  }
}
</style>
