<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import { useTag, type TagNode } from "../utils/tagging";

const { getAllTagElements } = useTag();

const props = defineProps<{
  active: boolean;
}>();

let elementToNode: Map<HTMLElement, TagNode> | null = null;
let nodeToPath: Map<TagNode, string> | null = null;
const currentPath = ref<string | null>(null);
const currentElementRef = ref<HTMLElement | null>(null);

function findNearestTagElement(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current) {
    if (elementToNode?.has(current)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function handleMouseOver(event: MouseEvent) {
  const target = event.target as HTMLElement;

  const tagElement = findNearestTagElement(target);
  if (tagElement) {
    const node = elementToNode?.get(tagElement);

    if (node) {
      currentPath.value = nodeToPath?.get(node) || "未知路径";
      nextTick(() => {
        if (currentElementRef.value) {
          createMaskToTaggedElement(tagElement);
        } else {
          console.error("currentElementRef is still null after nextTick");
        }
      });
    }
  } else {
    currentPath.value = null;
  }
}

function createMaskToTaggedElement(element: HTMLElement | null) {
  if (!element) return;
  const { left, top, width, height } = element.getBoundingClientRect();

  Object.assign(currentElementRef.value!.style, {
    left: `${left - 6}px`,
    top: `${top - 6}px`,
    width: `${width + 12}px`,
    height: `${height + 12}px`,
  });
}

watch(
  () => props.active,
  (newVal) => {
    if (newVal) {
      const { elementToNode: eToNode, nodeToPath: nToPath } =
        getAllTagElements();
      elementToNode = eToNode;
      nodeToPath = nToPath;
      window.addEventListener("mouseover", handleMouseOver);
    } else {
      window.removeEventListener("mouseover", handleMouseOver);
      elementToNode = null;
      nodeToPath = null;
      currentPath.value = null;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  window.removeEventListener("mouseover", handleMouseOver);
});
</script>

<template>
  <Teleport to="body" v-if="props.active">
    <div ref="currentElementRef" class="tagging-selector" v-if="currentPath">
      <span class="current-path">{{ currentPath }}</span>
    </div>
  </Teleport>
</template>

<style scoped>
.tagging-selector {
  position: fixed;
  border: 2px solid #07c0cf;
  border-radius: 5px;
  background: rgba(7, 192, 207, 0.5);
  pointer-events: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.current-path {
  color: black;
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(7, 192, 207);
  border: 2px solid #07c0cf;
  white-space: nowrap;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
