import { ref, onBeforeUnmount } from "vue";

function useElementPosition(callback: (rect: DOMRect) => void) {
  const mutationObserver = ref<MutationObserver | null>(null);
  const intersectionObserver = ref<IntersectionObserver | null>(null);
  let lastRect: DOMRect | null = null;
  let rafId: number | null = null;

  /** 轮询监听元素位置信息 */
  const pollPosition = (element: HTMLElement) => {
    if (rafId) cancelAnimationFrame(rafId);
    const check = () => {
      const rect = element.getBoundingClientRect();
      if (
        !lastRect ||
        lastRect.top !== rect.top ||
        lastRect.left !== rect.left
      ) {
        lastRect = rect;
        callback(rect);
      }
      rafId = requestAnimationFrame(check);
    };
    rafId = requestAnimationFrame(check);
  };

  /** 开始监听 */
  const startPositionObserving = (element: HTMLElement | null) => {
    if (!element) return;
    stopPositionObserving(); // 先清除之前的监听

    // MutationObserver 监听 style/class 变化
    mutationObserver.value = new MutationObserver(() => {
      const rect = element.getBoundingClientRect();
      callback(rect);
    });
    mutationObserver.value.observe(element, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // IntersectionObserver 监听滚动/视口变化
    intersectionObserver.value = new IntersectionObserver(() => {
      const rect = element.getBoundingClientRect();
      callback(rect);
    });
    intersectionObserver.value.observe(element);

    // 轮询监听（适用于 transform 变化）
    pollPosition(element);
  };

  /** 停止监听 */
  const stopPositionObserving = () => {
    mutationObserver.value?.disconnect();
    intersectionObserver.value?.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    mutationObserver.value = null;
    intersectionObserver.value = null;
    rafId = null;
  };

  onBeforeUnmount(() => {
    stopPositionObserving();
  });

  return {
    startPositionObserving,
    stopPositionObserving,
  };
}

export { useElementPosition };
