import { tagApi } from "../utils/tagging";

export function useTag() {
  const getElement = (path: string) => {
    if (!tagApi.value) {
      throw new Error("TagConsumer not mounted");
    }
    return tagApi.value.getElement(path);
  };

  return {
    getElement,
  };
}
