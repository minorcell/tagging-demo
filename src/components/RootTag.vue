<!-- TagConsumer.vue -->
<script setup lang="ts">
import {
  TAG_CONTEXT_KEY,
  tagApi,
  type TagContext,
  type TagNode,
} from "../utils/tagging";
import { reactive, provide, onMounted, onBeforeUnmount } from "vue";

const root = reactive<TagNode>({
  name: "__root__",
  instance: null,
  children: [],
});

const find = (path: string[]) => {
  function findNode(nodes: TagNode[], remainingPath: string[]): any {
    if (!remainingPath.length) return null;
    const targetName = remainingPath[0];
    const node = nodes.find((n) => n.name === targetName);
    if (!node) return null;
    return remainingPath.length === 1
      ? node.instance
      : findNode(node.children, remainingPath.slice(1));
  }
  return findNode(root.children, path);
};

const api = {
  find,
  getTagTree: () => root,
};

// 注册全局 API
onMounted(() => {
  tagApi.value = api;
});

onBeforeUnmount(() => {
  tagApi.value = null;
});

const context: TagContext = {
  addChild(node: TagNode) {
    root.children.push(node);
  },
  removeChild(node: TagNode) {
    const index = root.children.indexOf(node);
    if (index > -1) root.children.splice(index, 1);
  },
};

provide(TAG_CONTEXT_KEY, context);
</script>

<template>
  <slot />
</template>
