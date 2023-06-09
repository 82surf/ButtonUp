<!--
author: 유현수
modified: 우정연 - 환전 요청 api 연결, 환전할 단추 개수 입력값 valid 체크
-->

<template>
  <div>
    <BottomSheet
      :btnColor="isDeposit ? 'child02' : 'child06'"
      :btnName="isDeposit ? '환전 요청하기' : '적금 해지하기'"
      btnClass="font-weight-bold mt-3"
      sheetHeight="280px"
      customBtnWidth="120px"
      :closeSheet="closeSheet"
      @sheetClosed="closeSheet = false"
    >
      <template v-slot:body>
        <v-card class="rounded-0" :elevation="0">
          <v-toolbar
            :color="isDeposit ? 'child01' : 'child04'"
            dark
            :elevation="0"
            class="black--text"
            >{{ isDeposit ? "환전 요청" : "적금 해지" }}</v-toolbar
          >
          <div class="mx-4">
            <div v-if="isDeposit" class="mt-4">
              <h3>단추를 현금으로 바꿔볼까요?</h3>
              <p>환전 요청할 금액을 입력해주세요.</p>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="exchangeAmount"
                    label="환전할 단추 개수"
                    required
                    :color="isDeposit ? 'child01' : 'child04'"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="2" align-self="center">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-col>
                <v-col cols="4" align-self="center">
                  <h3 class="text-center">{{ exchangeAmount }}원</h3>
                </v-col>
              </v-row>
            </div>
            <div v-else class="mt-4">
              <h3>정말 해지하시겠어요?</h3>
              <p>지금까지 쌓인 이자를 받을 수 없게 됩니다.</p>
            </div>
            <v-btn
              block
              :color="isDeposit ? 'child01' : 'child04'"
              class="font-weight-bold"
              @click="
                isDeposit
                  ? requestExchange()
                  : vuexCloseSaving(checkUserInfo.seq).then($router.push('/child/home'))
              "
              >{{ isDeposit ? "환전 요청하기" : "적금 해지하기" }}</v-btn
            >
          </div>
        </v-card>
      </template>
    </BottomSheet>
    <!-- 스낵바 -->
    <v-snackbar app v-model="snackbar.isOpen" :timeout="snackbar.timeout" color="child02">
      <span class="black--text font-weight-bold">{{ snackbar.text }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar.isOpen = false"
          class="font-weight-bold"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import BottomSheet from "@/components/common/BottomSheet.vue";
import { addExchangeRequest } from "@/api/requestAPI";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AccountHistoryBtmSheet",
  components: {
    BottomSheet,
  },
  props: {
    isDeposit: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters("userStore", ["checkUserInfo"]),
  },
  data() {
    return {
      exchangeAmount: null,
      closeSheet: false,
      snackbar: {
        isOpen: false,
        text: null,
        timeout: 2000,
      },
    };
  },
  methods: {
    ...mapActions("savingStore", ["vuexCloseSaving"]),
    async requestExchange() {
      if (this.isDeposit) {
        if (this.exchangeAmount <= 0 || this.exchangeAmount == null) {
          this.snackbar.text = "환전할 단추 개수를 확인해주세요!";
          this.snackbar.isOpen = true;
          return;
        }
        let formData = {
          childSeq: this.checkUserInfo.seq,
          price: this.exchangeAmount,
        };
        await addExchangeRequest(
          formData,
          () => {
            // console.log("성공!");
            this.$store.dispatch("accountStore/vuexUpdateDefaultBalance", this.checkUserInfo.seq);
            this.$store.dispatch("accountStore/vuexFetchAccountHistory", this.checkUserInfo.seq);
            // 입출금 내역 갱신하는 부분 필요할 듯
          },
          () => {
            // (err) => {
            // 잔액이 부족하면 에러
            // console.log(err);
            this.snackbar.text = "잔액이 부족합니다!";
            this.snackbar.isOpen = true;
          }
        );
        this.closeSheet = true;
        this.exchangeAmount = null;
        this.snackbar.text = "환전 요청이 완료되었습니다.";
        this.snackbar.isOpen = true;
      }
    },
    ...mapActions({ accountStore: ["vuexUpdateDefaultBalance", "vuexFetchAccountHistory"] }),
  },
};
</script>

<style></style>
