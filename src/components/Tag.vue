<!-- Tag.vue -->
<script setup lang="ts">
import {
  inject,
  getCurrentInstance,
  reactive,
  provide,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  TAG_CONTEXT_KEY,
  type TagContext,
  type TagNode,
} from "../utils/tagging";

const props = defineProps<{
  name: string;
}>();

const parentContext = inject<TagContext>(TAG_CONTEXT_KEY, null);
const instance = getCurrentInstance();

// 当前节点的子节点管理
const children = reactive<TagNode[]>([]);

// 提供给子组件的上下文，用于子组件注册到当前节点和从当前节点移除
const currentContext: TagContext = {
  addChild(node: TagNode) {
    children.push(node);
  },
  removeChild(node: TagNode) {
    const index = children.indexOf(node);
    if (index > -1) children.splice(index, 1);
  },
};

provide(TAG_CONTEXT_KEY, currentContext);

// 当前节点信息
const selfNode = reactive<TagNode>({
  name: props.name,
  instance,
  children,
});

// 挂载时注册到父节点
onMounted(() => {
  parentContext?.addChild(selfNode);
});

// 卸载时从父节点移除
onBeforeUnmount(() => {
  parentContext?.removeChild(selfNode);
});
</script>

<template>
  <slot />
</template>
