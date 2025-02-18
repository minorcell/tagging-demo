<!-- TagConsumer.vue -->
<script setup lang="ts">
import { TAG_CONTEXT_KEY } from "../utils/tagging";
import { reactive, provide } from "vue";

const root = reactive<TagNode>({
  name: "__root__",
  instance: null,
  children: [],
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

defineExpose({
  find(path: string[]) {
    function findNode(nodes: TagNode[], remainingPath: string[]): any {
      if (!remainingPath.length) return null;

      const targetName = remainingPath[0];
      const node = nodes.find((n) => n.name === targetName);

      if (!node) return null;
      if (remainingPath.length === 1) return node.instance;

      return findNode(node.children, remainingPath.slice(1));
    }

    return findNode(root.children, path);
  },
});
</script>

<template>
  <slot />
</template>
