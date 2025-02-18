<script setup>
import { ref } from "vue";
import Tag from "./components/Tag.vue";
import TagConsumer from "./components/TagConsumer.vue";
import ClickToRender from "./components/ClickToRender.vue";

const consumerRef = ref();

function log() {
  const instance = consumerRef.value?.find(["infoBox", "confirm"]);
  console.log(instance.subTree.children[0].el);
}

function logTree() {
  const tree = consumerRef.value?.getTagTree();
  console.log(tree);
}
</script>

<template>
  <TagConsumer ref="consumerRef">
    <Tag name="infoBox">
      <div class="info-box">
        <Tag name="confirm">
          <button @click="log">点击打印我</button>
          <button @click="logTree">点击打印tagTree</button>
        </Tag>
      </div>
    </Tag>
    <Tag name="textBox">
      <div class="info-box">
        <Tag name="text">
          <p>
            这是一段文本
            <Tag name="special">
              <span>特殊文本</span>
            </Tag>
          </p>
          <Tag name="code">
            <pre>
              <code>
                console.log('Hello, World!')
              </code>
            </pre>
          </Tag>
        </Tag>
      </div>
    </Tag>
    <ClickToRender />
  </TagConsumer>
</template>

<style scoped>
.info-box {
  padding: 10px;
  border: 1px solid #ddd;
  margin: 10px 0;
}

button {
  margin-right: 10px;
}

span {
  color: red;
}

span::before {
  content: "【";
}

span::after {
  content: "】";
}

span:hover {
  color: blue;
}

span:hover::before {
  content: "《";
}

span:hover::after {
  content: "》";
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>
