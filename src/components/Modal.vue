<template>
  <Teleport to="body">
    <div v-if="isvisiable" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <slot />
        <button @click="confirmModal">Confirm</button>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineModel, defineEmits } from "vue";

const isvisiable = defineModel<boolean>();
const emit = defineEmits(["confirm", "close"]);

const closeModal = () => {
  isvisiable.value = false;
  emit("close");
};

const confirmModal = () => {
  emit("confirm");
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
