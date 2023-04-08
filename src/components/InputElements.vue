<template>
  <div class="input-group">
    <div v-if="isElementParagraph" class="input-group__paragraph">
      <label>Paragraph Text</label>
      <input
        @input="(e) => handleChangeValueInput(e, 'paragraphText')"
        v-model="paragraphTextValue"
      />
    </div>
    <div v-else class="input-group__button">
      <label>Button Text</label>
      <input
        @input="(e) => handleChangeValueInput(e, 'buttonText')"
        v-model="buttonTextValue"
      />
      <label>Alert Message</label>
      <input
        @input="(e) => handleChangeValueInput(e, 'alertMessage')"
        v-model="alertTextValue"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, defineEmits } from "vue";
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
});
const paragraphTextValue = ref("");
const buttonTextValue = ref("");
const alertTextValue = ref("");

const emit = defineEmits(["updateValue"]);

onMounted(() => {
  paragraphTextValue.value = props.element?.props?.text ?? "";
  buttonTextValue.value = props.element?.props?.text ?? "";
  alertTextValue.value = props.element?.props?.message ?? "";
});
const isElementParagraph = computed(
  () => props.element.component === "ElementParagraph"
);
function handleChangeValueInput(e) {
  if (isElementParagraph.value) {
    emit("updateValue", [
      {
        name: "text",
        text: paragraphTextValue.value,
      },
    ]);
    return;
  }
  emit("updateValue", [
    {
      name: "text",
      text: buttonTextValue.value,
    },
    {
      name: "message",
      text: alertTextValue.value,
    },
  ]);
}
</script>

<style lang="scss" scoped>
label {
  display: block;
}
</style>
