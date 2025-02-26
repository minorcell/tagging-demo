<script setup lang="ts">
import Tag from "./components/Tag.vue";
import RootTag from "./components/TagRoot.vue";
import Mask from "./components/Mask.vue";
import { useTag } from "./hooks/useTag";
import { ref } from "vue";

const { getElement } = useTag();

const handleCheck = () => {
  const checkbutton = getElement("editorbox check");
  console.log(checkbutton);
};

const logCodeContext = () => {
  const pre = getElement("editorbox pre");
  console.log(pre);
};
const closeMask = () => {
  visible.value = false;
};

const visible = ref(false);
</script>

<template>
  <RootTag>
    <Tag name="editorbox">
      <div class="editor">
        <h2>Coding Here</h2>
        <div class="options">
          <Tag name="check">
            <button @click="handleCheck">Check</button>
          </Tag>
          <Tag name="logpre">
            <button @click="logCodeContext">logpre</button>
          </Tag>
          <Tag name="mask">
            <button @click="visible = !visible">mask</button>
          </Tag>
        </div>
        <Tag name="pre">
          <pre>
            <Tag name="code">
              <code>console.log("Hello, World!");</code>
            </Tag>
          </pre>
        </Tag>
      </div>
    </Tag>
    <Mask :visible="visible" highlight-element-path="editorbox check">
      <button class="button" @click="closeMask">close mask</button>
    </Mask>
  </RootTag>
</template>

<style scoped>
.editor {
  border: 1px solid blue;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
}

button {
  margin-right: 10px;
  padding: 10px 20px;
  border: 1px solid blue;
  border-radius: 8px;
  background-color: #f0f0f0;
}

pre {
  border: 1px solid blue;
  border-radius: 8px;
  padding: 0 10px;
  background-color: #f0f0f0;
  overflow: auto;
}

code {
  width: 100%;
}
</style>
