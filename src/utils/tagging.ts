import { ref } from "vue";

export interface TagNode {
  name: string;
  instance: any;
  children: TagNode[];
}

export interface TagContext {
  addChild: (node: TagNode) => void;
  removeChild: (node: TagNode) => void;
}

export const TAG_CONTEXT_KEY = Symbol("tag_context");
export const TAG_API_KEY = Symbol("tagApi"); // 新增 API Key

// 新增全局 API 引用
export const tagApi = ref<{
  find: (path: string[]) => any;
  getTagTree: () => TagNode;
} | null>(null);
