<script setup lang="ts">
import Tag from "./Tag.vue";
import { ref } from "vue";
const list = ref([""]);

function renderList() {
  list.value = ["A", "B", "C"];
}
</script>

<template>
  <div>
    <h2>动态渲染查看tagTree更新</h2>
    <button @click="renderList">点击动态渲染List</button>
    <div>
      <Tag name="list">
        <div>
          <Tag :name="item" v-for="item in list" :key="item">
            <div>{{ item }}</div>
          </Tag>
        </div>
      </Tag>
    </div>
  </div>
</template>

<style scoped></style>
