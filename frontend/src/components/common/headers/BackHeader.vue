<template>
  <div>
    <v-app-bar dense :color="bgColor" elevation="0">
      <v-icon @click="onClickBackBtn(backBtnPath)" class="mr-6 back-btn">mdi-arrow-left</v-icon>
      <v-toolbar-title v-if="$route.path.includes(`/parent/home/child-info`)">
        {{ $route.params.child.name }}
      </v-toolbar-title>
      <v-toolbar-title v-else>
        {{ pageTitle }}
      </v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "BackHeader",
  props: {
    pageTitle: {
      type: String,
      default: "",
    },
    backBtnPath: {
      type: String,
      default: "",
    },
    bgColor: {
      props: String,
      default: "white",
    },
  },
  methods: {
    onClickBackBtn(path) {
      if (path) {
        this.$router.push(path);
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  cursor: pointer;
}
</style>
