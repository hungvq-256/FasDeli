<template>
  <div class="element-wrapper">
    <div
      v-if="isParagraphComponent"
      class="element-wrapper__paragraph"
      @click="() => emit('clickElement', element)"
    >
      {{ element.props?.text || "paragraph" }}
    </div>
    <button
      v-else
      class="element-wrapper__button"
      @click="() => emit('clickElement', element)"
    >
      {{ element.props?.text || "Button" }}
    </button>
  </div>
</template>

<script setup>
import { computed, defineEmits } from "vue";
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["clickElement"]);

const isParagraphComponent = computed(() => {
  return props.element.component === "ElementParagraph";
});
</script>

<style lang="scss" scoped>
.element-wrapper {
  &__paragraph {
    cursor: pointer;
  }
}
</style>
