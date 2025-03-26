<script setup lang="ts">
import {
  TAG_CONTEXT_KEY,
  tagApi,
  type TagContext,
  type TagNode,
} from "../utils/tagging.ts";
import { reactive, provide, onMounted, onBeforeUnmount, type VNode } from "vue";

const root = reactive<TagNode>({
  name: "__root__",
  instance: null,
  children: [],
});

/**
 * Perform a fuzzy search to find a node based on pathTokens.
 * Maintain a queue as a search queue to store the nodes to be searched (node)
 * and their matching progress (index).
 */
const fuzzySearch = (
  rootNodes: TagNode[],
  pathTokens: string[]
): TagNode | null => {
  const queue: { node: TagNode; index: number }[] = rootNodes.map((node) => ({
    node,
    index: 0,
  }));

  while (queue.length > 0) {
    const { node, index } = queue.shift()!;

    // When the match is successful, if the index reaches pathTokens.length - 1,
    // it indicates a complete match and the node is returned directly.
    if (node.name === pathTokens[index]) {
      // If there is an exact match, the result is returned
      if (index === pathTokens.length - 1) {
        return node;
      }
      // Otherwise, DFS is used, giving priority to going deep into the current branch,
      // which helps to quickly find the "continuous matching" path.
      queue.unshift(
        ...node.children.map((child) => ({
          node: child,
          index: index + 1,
        }))
      );
    }

    // Regardless of whether the current node is matched or not,
    // its child nodes are added to the queue with the original matching progress (without incrementing the index).
    // In this way, even if the current branch is blocked, you can find the correct path from the next branch.
    queue.push(
      ...node.children.map((child) => ({
        node: child,
        index,
      }))
    );
  }
  return null;
};

const handleFound = (path: string) => {
  const pathTokens = path.trim().split(/\s+/);
  if (pathTokens.length === 0) return null;

  const foundNode = fuzzySearch(root.children, pathTokens);
  return foundNode;
};

const getElement = (path: string) => {
  const foundNode = handleFound(path);
  return foundNode?.instance?.subTree?.children?.[0]?.el || null;
};

const getInstance = (path: string) => {
  const foundNode = handleFound(path);
  return foundNode?.instance?.subTree?.children?.[0] || null;
};

const getAllTagElements = () => {
  const elementToNode = new Map<HTMLElement, TagNode>();
  const nodeToPath = new Map<TagNode, string>();

  const traverse = (node: TagNode, currentPath: string[]) => {
    const pathStr = currentPath.join(" ");
    nodeToPath.set(node, pathStr);
    const subTree = node.instance?.subTree;
    if (subTree && Array.isArray(subTree.children)) {
      subTree.children.forEach((child: VNode) => {
        if (child.el instanceof HTMLElement) {
          elementToNode.set(child.el, node);
        }
      });
    }
    node.children.forEach((child) =>
      traverse(child, [...currentPath, child.name])
    );
  };

  root.children.forEach((child) => traverse(child, [child.name]));
  return { elementToNode, nodeToPath };
};

onMounted(() => {
  tagApi.value = {
    getElement,
    getInstance,
    getAllTagElements,
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
