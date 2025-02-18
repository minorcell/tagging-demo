<script setup>
import { ref } from "vue";
import Tag from "./components/Tag.vue";
import TagConsumer from "./components/TagConsumer.vue";

const consumerRef = ref();

function log() {
  const instance = consumerRef.value?.find(["infoBox", "confirm"]);
  console.log(instance.subTree.children[0].el);
}
</script>

<template>
  <TagConsumer ref="consumerRef">
    <Tag name="infoBox">
      <div class="info-box">
        <Tag name="confirm">
          <button @click="log">确认</button>
        </Tag>
      </div>
    </Tag>
  </TagConsumer>
</template>
