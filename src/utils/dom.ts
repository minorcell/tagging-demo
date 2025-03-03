import { ref, watch, type WatchSource, onBeforeUnmount } from "vue";

export function useElementRect(elSource: WatchSource<HTMLElement | null>) {
  const rect = ref<DOMRect | null>(null);

  let rafId: number | null = null;
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

  // Use requestAnimationFrame to poll and monitor changes in elements
  function pollPosition(element: HTMLElement) {
    if (rafId) cancelAnimationFrame(rafId);
    const check = () => {
      updateRect(element);
      rafId = requestAnimationFrame(check);
    };
    rafId = requestAnimationFrame(check);
    // Returns a function that cancels the poll
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };
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

      // Use MutationObserver to monitor style/class changes
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

      // Polling monitoring (capturing changes such as transform)
      const cancelPoll = pollPosition(el);

      onCleanup(() => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        intersectionObserver.disconnect();
        cancelPoll();
      });
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  return rect;
}
