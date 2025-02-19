// hooks/useTagFinder.ts
import { tagApi } from "../utils/tagging";

export function useTagFinder() {
  const find = (path: string[]) => {
    if (!tagApi.value) {
      throw new Error("TagConsumer not mounted");
    }
    return tagApi.value.find(path);
  };

  const getTagTree = () => {
    if (!tagApi.value) {
      throw new Error("TagConsumer not mounted");
    }
    return tagApi.value.getTagTree();
  };

  return {
    find,
    getTagTree,
  };
}
