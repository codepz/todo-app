<template>
  <q-page class="flex flex-center">
    <p class="text-h5" @click="clickButton('test')">Page Home</p>
  </q-page>
</template>

<script>
export default {
  name: "HomePage",

  data() {
    return {};
  },
  methods: {
    clickButton: function (data) {
      // $socket is socket.io-client instance
      this.$socket.emit("event_name", data);
    },
  },
  mounted() {
    // this.sockets.subscribe("todo:update", (data) => {
    //   console.log("Data", data);
    // });
    // console.log("run", sockets);
  },
};
</script>
