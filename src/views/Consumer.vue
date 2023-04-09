<template>
  <div class="consumer">
    <Element
      v-for="ele in selectedList"
      :key="ele.id"
      :element="ele"
      @clickElement="handleClickElement"
    />
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import Element from "../components/Element.vue";
import { db } from "../firebase/firebaseInit";
import { doc, setDoc, getDoc } from "firebase/firestore";
const selectedList = ref([]);
initData();
async function initData() {
  let docRef = doc(db, "template", "templateDoc");
  try {
    let res = await getDoc(docRef);
    selectedList.value = res.data().data;
  } catch (error) {
    alert("there is some errors");
  }
}
function handleClickElement(ele) {
  if (ele.component === "ElementButton" && ele.props?.message) {
    alert(ele.props.message);
  }
}
</script>
<style lang="scss" scoped>
.consumer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
