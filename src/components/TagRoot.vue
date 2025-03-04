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

const getElement = (path: string) => {
  const pathTokens = path.trim().split(/\s+/);
  if (pathTokens.length === 0) return null;

  // 模糊搜索
  function fuzzySearch(rootNodes: TagNode[]): TagNode | null {
    const queue: { node: TagNode; index: number }[] = rootNodes.map((node) => ({
      node,
      index: 0,
    }));

    while (queue.length > 0) {
      const { node, index } = queue.shift()!;

      // 匹配成功时
      if (node.name === pathTokens[index]) {
        // 完全匹配时返回结果
        if (index === pathTokens.length - 1) {
          return node;
        }
        // 深度优先：将子节点插入队列前部
        queue.unshift(
          ...node.children.map((child) => ({
            node: child,
            index: index + 1,
          }))
        );
      }

      // 无论是否匹配都继续搜索（允许跳过节点）
      // 广度优先：将子节点插入队列后部
      queue.push(
        ...node.children.map((child) => ({
          node: child,
          index,
        }))
      );
    }
    return null;
  }

  // 执行搜索并返回结果
  const foundNode = fuzzySearch(root.children);
  return foundNode?.instance?.subTree?.children?.[0]?.el || null;
};

onMounted(() => {
  tagApi.value = {
    getElement,
  };
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
