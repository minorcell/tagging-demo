// tagging.ts
/* import {
  reactive,
  inject,
  provide,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
} from "vue"; */

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
