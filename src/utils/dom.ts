import { ref, watch, type WatchSource } from "vue";

export function useElementRect(elSource: WatchSource<HTMLElement | null>) {
  const rect = ref<DOMRect | null>(null);

  let lastRect: DOMRect | null = null;

  function updateRect(element: HTMLElement) {
    const newRect = element.getBoundingClientRect();
    if (
      !lastRect ||
      lastRect.top !== newRect.top ||
      lastRect.left !== newRect.left ||
      lastRect.width !== newRect.width ||
      lastRect.height !== newRect.height
    ) {
      lastRect = newRect;
      rect.value = newRect;
    }
  }

  watch(
    elSource,
    (el, _, onCleanup) => {
      if (!el) return;

      updateRect(el);

      // Use ResizeObserver to monitor size changes
      const resizeObserver = new ResizeObserver(() => {
        updateRect(el);
      });
      resizeObserver.observe(el);

      /**
       * Use `MutationObserver` to monitor `style/class` changes.
       * It is mainly used to deal with special cases such as the use of `transform`.
       * `transform` is the rendering done by the browser on the existing element, which will not change the position and size
       */
      const mutationObserver = new MutationObserver(() => {
        updateRect(el);
      });
      mutationObserver.observe(el, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      // Use IntersectionObserver to monitor scroll/viewport changes
      const intersectionObserver = new IntersectionObserver(() => {
        updateRect(el);
      });
      intersectionObserver.observe(el);

      onCleanup(() => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        intersectionObserver.disconnect();
      });
    },
    { immediate: true }
  );

  return rect;
}
