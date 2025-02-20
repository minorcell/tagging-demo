# Tagging

## 实现原理说明

1. 上下文管理：

- 使用 `Vue` 的 `provide/inject` 实现嵌套组件通信
- 每个 `Tag` 组件维护自己的子节点列表
- 通过 `onMounted/onBeforeUnmount` 生命周期管理节点注册

2. 树形结构构建：

- 每个 `Tag` 节点包含 `name`、组件实例和子节点
- 父节点自动收集子节点信息
- 使用响应式对象`(reactive)`自动维护树结构

3. 查询机制：

- 使用深度优先搜索遍历 Tag 树
- 支持路径匹配查询（如`"editorbox check"`）
- 返回匹配的 HTMLElement

4. 组件关系：

- `<TagRoot />` 作为根容器和查询入口
- `<Tag />` 组件支持无限嵌套，自动维护层级关系
- 自动处理组件卸载时的节点清理

## 示例

#### 示例组件

```vue
<script setup>
...
const { getElement } = useTag();

const handleCheck = () => {
  const checkbutton = getElement("editorbox check");
  console.log(checkbutton);
};

const logCodeContext = () => {
  const pre = getElement("editorbox pre");
  console.log(pre);
};
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
  </RootTag>
</template>
```

#### 控制台运行效果

![run](./public/01.png)

## 实现原则

- 分层设计：`RootTag` 为根，`Tag` 形成树形结构
- 职责分离：标注组件只管注册，消费组件负责查询
- 响应式树：自动维护节点关系，无需手动更新
- 上下文穿透：支持任意层级的嵌套标注
