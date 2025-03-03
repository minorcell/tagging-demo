import { onBeforeUnmount, ref } from "vue";

export function useResizeObserver(
  callback: (entry: ResizeObserverEntry) => void
) {
  const resizeObserver = ref<ResizeObserver | null>(null);

  /** 开始监听元素尺寸变化 */
  const startResizeObserving = (element: HTMLElement | null) => {
    if (!element) return;
    stopResizeObserving(); // 先移除旧的监听
    resizeObserver.value = new ResizeObserver((entries) => {
      for (let entry of entries) {
        callback(entry);
      }
    });
    resizeObserver.value.observe(element);
  };

  /** 停止监听 */
  const stopResizeObserving = () => {
    resizeObserver.value?.disconnect();
    resizeObserver.value = null;
  };

  onBeforeUnmount(() => {
    stopResizeObserving();
  });

  return {
    startResizeObserving,
    stopResizeObserving,
  };
}
