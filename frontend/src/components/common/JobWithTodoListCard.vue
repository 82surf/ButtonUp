<!--
  author : 정은이
-->
<template>
  <div class="mr-4">
    <v-card class="mx-auto ma-4 pa-1 mb-8" max-width="400" rounded="xl" outlined>
      <v-list-item class="mt-4 ml-0 justify-space-between">
        <v-avatar size="60" color="grey">
          <img
            :src="
              job.jobImagePath == null
                ? 'https://cdn.vuetifyjs.com/images/john.jpg'
                : job.jobImagePath
            "
            :alt="job.name"
          />
        </v-avatar>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 ma-0">
              {{ job.name }}
            </v-list-item-title>
            <v-list-item-content class="text-subtitle ma-0 pa-1"
              >{{ job.payTerm }} {{ job.pay.toLocaleString(locales, options) }}</v-list-item-content
            >
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
      <div class="ml-2 mr-2 mt-4 mb-6">
        <v-list-item v-for="(todo, t) in doList" :key="t" class="pa-4" style="display: contents">
          <TodoList
            class="pb-1"
            :todo="todo"
            :isParent="isParent"
            :onlyRead="true"
            :checkboxOn="checkboxOn"
          ></TodoList>
        </v-list-item>
      </div>
    </v-card>
  </div>
</template>

<script>
import TodoList from "./TodoList.vue";
// import { apiGetCheckListRow } from '@/api/checkListAPI.js';

export default {
  name: "JobCard",
  components: {
    TodoList,
  },
  props: {
    checkboxOn: {
      type: Boolean,
      default: true,
    },
    job: Object,
    isParent: Boolean,
    child: Object,
    doList: Array,
  },
  data() {
    return {
      checkList: [],
    };
  },
  // created() {
  //   apiGetCheckListRow(
  //     this.child.seq,
  //     (response) => {
  //       this.checkList = response.data;
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // },
};
</script>

<style></style>
