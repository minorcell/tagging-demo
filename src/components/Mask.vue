<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useTag } from "../utils/tagging";
import { useElementRect } from "../utils/dom";

type HighlightRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const props = defineProps<{
  visible: boolean;
  highlightElementPath: string;
}>();

const { getElement } = useTag();

const targetElement = computed(() => {
  return props.visible ? getElement(props.highlightElementPath) : null;
});

const elementRect = useElementRect(targetElement);

const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);

const borderRadius = 10;

const highlightRect = computed<HighlightRect>(() => {
  const rect = elementRect.value;
  if (rect) {
    return {
      left: rect.left + window.scrollX - 10,
      top: rect.top + window.scrollY - 10,
      width: rect.width + 20,
      height: rect.height + 20,
    };
  }
  return { left: 0, top: 0, width: 0, height: 0 };
});

function createRoundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  return `
    M${x + rr},${y}
    H${x + w - rr}
    Q${x + w},${y} ${x + w},${y + rr}
    V${y + h - rr}
    Q${x + w},${y + h} ${x + w - rr},${y + h}
    H${x + rr}
    Q${x},${y + h} ${x},${y + h - rr}
    V${y + rr}
    Q${x},${y} ${x + rr},${y}
    Z
  `;
}

const svgPath = computed(() => {
  const { left, top, width, height } = highlightRect.value;
  const outerRect = `M0,0 H${screenWidth.value} V${screenHeight.value} H0 Z`;
  const holeRect = createRoundedRectPath(
    left,
    top,
    width,
    height,
    borderRadius
  );
  return outerRect + " " + holeRect;
});

function updateScreenSize() {
  screenWidth.value = window.innerWidth;
  screenHeight.value = window.innerHeight;
}

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<template>
  <Transition>
    <div v-if="visible" class="mask">
      <svg
        class="svg-mask"
        :width="screenWidth"
        :height="screenHeight"
        :viewBox="`0 0 ${screenWidth} ${screenHeight}`"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          :d="svgPath"
          fill="rgba(0, 0, 0, 0.5)"
          fill-rule="evenodd"
          pointer-events="fill"
        />
      </svg>
      <div class="slot-container">
        <slot :slot-info="highlightRect" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mask {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.svg-mask {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.slot-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  pointer-events: none;
}
.slot-container * {
  pointer-events: auto;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
