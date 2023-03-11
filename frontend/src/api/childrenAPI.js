/**
 * author : 유현수
 */

import { apiInstance } from "./index.js";

const api = apiInstance();

// 해당 부모의 아이들을 조회
async function childrenList(parentSeq, success, fail) {
  api.defaults.headers["access-token"] = sessionStorage.getItem("access-token");
  await api.get(`/children/parent/${parentSeq}`).then(success).catch(fail);
}

// 회원가입시 아이와 부모 연결
function childConnect(childSeq, success, fail) {
  api
    .put(`/children/connect`, JSON.stringify(childSeq))
    .then(success)
    .catch(fail);
}

export { childrenList, childConnect };
