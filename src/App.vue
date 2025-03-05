<script setup lang="ts">
import Tag from "./components/Tag.vue";
import RootTag from "./components/TagRoot.vue";
import Mask from "./components/Mask.vue";
import InfoBox from "./components/InfoBox.vue";
import { useTag } from "./utils/tagging";
import { ref } from "vue";

const { getElement } = useTag();
const visible = ref(false);
const currentHighlightElementPath = ref("editorbox check");

function handleCheck() {
  const checkbutton = getElement("editorbox check");
  console.log(checkbutton);
}

function logCodeContext() {
  const pre = getElement("editorbox pre");
  console.log(pre);
}

function closeMask() {
  visible.value = false;
  const checkbutton = getElement("editorbox check");
  if (checkbutton) {
    const styles = {
      position: "static",
      top: "auto",
      left: "auto",
      transform: "scale(1)",
    };
    Object.assign(checkbutton.style, styles);
  }
  currentHighlightElementPath.value = "editorbox check";
}

function changeSize() {
  const checkbutton = getElement("editorbox check");
  if (checkbutton) {
    const styles = {
      transform: "scale(2)",
    };
    Object.assign(checkbutton.style, styles);
  }
}

function moveTarget() {
  const checkbutton = getElement("editorbox check");
  if (checkbutton) {
    const styles = {
      transform: "translate(100px, 100px)",
    };
    Object.assign(checkbutton.style, styles);
  }
}
</script>

<template>
  <RootTag>
    <Tag name="container">
      <div class="container">
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

        <InfoBox />
      </div>
    </Tag>

    <Mask
      :visible="visible"
      :highlight-element-path="currentHighlightElementPath"
    >
      <!-- Mask 提供一个作用于插槽 v-slot="defaultProps" 可供使用方定制样式等 -->
      <div class="slot-container">
        <button @click="closeMask">close mask</button>
        <button @click="changeSize">change size</button>
        <button @click="moveTarget">move target</button>
        <button @click="currentHighlightElementPath = 'header close'">
          模糊查找 close
        </button>
        <button @click="currentHighlightElementPath = 'author lastName'">
          模糊查找 last name
        </button>
        <button @click="currentHighlightElementPath = 'buttonOk'">
          直接查找 buttonOk
        </button>
      </div>
    </Mask>
  </RootTag>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  border: 1px solid blue;
}

.editor {
  border: 1px solid blue;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
}

.slot-container {
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
}

button {
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  border: 1px solid blue;
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
