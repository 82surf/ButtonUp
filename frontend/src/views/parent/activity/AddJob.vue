<!-- 
  author : 정은이
-->
<template>
  <div class="mx-9 mt-2 mb-10">
    <!-- selectedImageIdx는 images list의 인덱스 -->
    <v-slide-group v-model="selectedImageIdx" class="pa-0 ma-0" center-active>
      <v-slide-item v-for="(img, index) in images" :key="index" v-slot="{ active, toggle }">
        <v-card class="ma-4" height="180" width="180" @click="toggle">
          <v-img class="fill-height" :src="img"> </v-img>

          <v-fade-transition>
            <v-overlay v-if="active" absolute color="parent01">
              <v-icon
                v-if="active"
                color="white"
                size="48"
                v-text="'mdi-checkbox-marked-circle'"
              ></v-icon>
            </v-overlay>
          </v-fade-transition>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <v-form v-model="isValidate">
      <!-- 직업 -->
      <v-list-item cols="12" class="justify-space-between align-baseline ma-0 pa-0">
        <v-text-field
          cols="8"
          v-model="newJob.name"
          label="직업명"
          required
          :rules="checkValid.name"
          color="parent01"
        ></v-text-field>
      </v-list-item>
      <!-- 급여 -->
      <v-list-item cols="12" class="justify-space-between align-baseline ma-0 pa-0">
        <v-col class="ma-0 pa-0 flex-grow-1 flex-shrink-1">
          <v-text-field
            v-model="newJob.pay"
            label="급여"
            required
            :rules="checkValid.pay"
            color="parent01"
          ></v-text-field>
        </v-col>

        <v-col cols="5" class="ma-0 pa-0 align-center" align="end">
          <!-- 급여 지급 단위 -->
          <v-btn-toggle
            tile
            mandatory
            v-model="newJob.payTerm"
            color="ma-0 pa-0 parent01 align-center justify-end"
            class="ml-2"
          >
            <v-row dense class="ma-0 pa-0 justify-end" style="flex-wrap: nowrap">
              <v-col>
                <v-btn small value="주급" color="parent01" class="white--text">주급</v-btn>
              </v-col>
              <v-col>
                <v-btn small value="월급" color="parent01" class="white--text">월급</v-btn>
              </v-col>
            </v-row>
          </v-btn-toggle>
        </v-col>
      </v-list-item>

      <!-- 할일 추가 -->
      <v-list-item
        required
        v-for="(todo, t) in newJob.toDoContents"
        :key="t"
        cols="12"
        class="justify-space-between align-baseline ma-0 pa-0"
      >
        <v-text-field
          :key="`inoput-${t}`"
          cols="8"
          v-model="newJob.toDoContents[t]"
          label="할일 추가"
          required
          :rules="checkValid.todo"
          color="parent01"
        ></v-text-field>
        <v-col cols="1" class="ml-2 pa-0">
          <v-btn icon color="parent01" @click="addTodo">
            <v-icon dark> mdi-plus </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1" class="ml-2 pa-0">
          <v-btn icon color="parent01" @click="removeTodo(t)">
            <v-icon dark> mdi-minus </v-icon>
          </v-btn>
        </v-col>
      </v-list-item>

      <!-- 직업 생성 submit -->
      <v-btn
        :disabled="!isValidate"
        @click="clickAddJob"
        block
        color="parent01"
        class="white--text mt-4"
        >직업 생성
      </v-btn>

      <Modal
        :visible.sync="dialog"
        :isParent="true"
        :title="`직업이 생성되었습니다`"
        :content="`직업 관리 페이지로 이동합니다`"
        :textPositiveBtn="`확인`"
        :positiveAction="go"
        :ishaveNegBtn="false"
      ></Modal>
    </v-form>
  </div>
</template>

<script>
import { apiAddJob } from "@/api/jobsAPI.js";
import { mapGetters } from "vuex";
import Modal from "../../../components/common/Modal.vue";

export default {
  components: { Modal },
  name: "AddJob",
  data() {
    return {
      isValidate: true,
      checkValid: {
        name: [(v) => !!v || "직업의 이름을 입력해주세요."],
        pay: [
          (v) => !!v || "월급을 입력해주세요",
          (v) => /^[0-9]*$/.test(v) || "급여는 숫자만 입력 가능합니다.",
        ],
        todo: [(v) => !!v || "할일을 입력해주세요."],
      },
      dialog: false,
      newJob: {
        jobImageSeq: 0,
        jobImagePath: "",
        name: null,
        parentSeq: null,
        pay: null,
        payTerm: null,
        toDoContents: [""],
      },
      passwordConfirm: null,
      images: [
        "https://cdn-icons-png.flaticon.com/512/3461/3461602.png",
        "https://cdn-icons-png.flaticon.com/512/4605/4605529.png",
        "https://cdn-icons-png.flaticon.com/512/1983/1983164.png",
        "https://cdn-icons-png.flaticon.com/512/1995/1995539.png",
        "https://cdn-icons-png.flaticon.com/512/3598/3598055.png",
        "https://cdn-icons-png.flaticon.com/512/3048/3048404.png",
        "https://cdn-icons-png.flaticon.com/512/6618/6618581.png",
        "https://cdn-icons-png.flaticon.com/512/2451/2451319.png",
        "https://cdn-icons-png.flaticon.com/512/2302/2302164.png",
        "https://cdn-icons-png.flaticon.com/512/3255/3255797.png",
        "https://cdn-icons-png.flaticon.com/512/1810/1810006.png",
        "https://cdn-icons-png.flaticon.com/512/1809/1809376.png",
      ],
      selectedImageIdx: 0,
    };
  },
  computed: {
    ...mapGetters("userStore", ["checkUserInfo"]),
  },
  methods: {
    addTodo() {
      if (this.newJob.toDoContents.length < 3) {
        this.newJob.toDoContents.push("");
      }
    },
    removeTodo(index) {
      if (this.newJob.toDoContents.length > 1) {
        this.newJob.toDoContents.splice(index, 1);
      }
    },
    clickAddJob() {
      this.newJob.parentSeq = this.checkUserInfo.seq;
      this.newJob.jobImagePath = this.images[this.selectedImageIdx];
      console.log(this.images[this.selectedImageIdx]);
      var param = this.newJob;
      console.log(param);
      apiAddJob(
        param,
        () => {
          // console.log(response.data);
          // console.log("성공");
          this.dialog = !this.dialog;
        },
        // (error) => {
        //   console.log(error);
        // }
        () => {}
      );
    },
    go() {
      this.gotoJobManage();
    },
    gotoJobManage() {
      this.$router.push("/parent/activity/job");
    },
  },
};
</script>

<style></style>
