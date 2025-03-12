import { ref } from "vue";

const listeners = ref([]);

export const useEventBus = () => {
  const emit = (event, ...args) => {
    listeners.value.forEach((listener) => {
      if (listener.event === event) {
        listener.callback(...args);
      }
    });
  };

  const on = (event, callback) => {
    listeners.value.push({ event, callback });

    return () => off(event, callback);
  };

  const off = (event, callback) => {
    listeners.value = listeners.value.filter(
      (listener) => listener.event !== event || listener.callback !== callback
    );
  };

  return {
    emit,
    on,
    off,
  };
};
