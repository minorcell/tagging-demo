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

export interface TagApi {
  getElement: (path: string) => HTMLElement | null;
}

export const TAG_CONTEXT_KEY = Symbol("tag_context");

export const tagApi = ref<{
  getElement: (path: string) => HTMLElement | null;
} | null>(null);
