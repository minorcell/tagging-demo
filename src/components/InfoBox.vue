<script setup lang="ts"></script>

<template>
  <Tag name="infoBox">
    <div class="infoBox">
      <Tag name="header">
        <div class="header">
          <Tag name="title">
            <h2>This is a title</h2>
          </Tag>
          <Tag name="author">
            <p class="author">
              <Tag name="firstName">
                <span class="first-name">John</span>
              </Tag>
              <Tag name="lastName">
                <span class="last-name">Doe</span>
              </Tag>
            </p>
          </Tag>
          <Tag name="close">
            <button class="close">X</button>
          </Tag>
        </div>
      </Tag>
      <Tag name="content">
        <p class="content">
          This is an info box. You can use it to
          <Tag name="mark">
            <mark
              >display
              <Tag name="strong">
                <strong>information about</strong>
              </Tag>
            </mark>
          </Tag>
        </p>
      </Tag>
      <Tag name="footer">
        <div class="footer">
          <Tag name="buttonOk">
            <button class="ok">OK</button>
          </Tag>
        </div>
      </Tag>
    </div>
  </Tag>
</template>

<style scoped>
.infoBox {
  border: 1px solid blue;
  border-radius: 8px;
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.author {
  font-size: 14px;
  color: #666;
}

.first-name {
  font-weight: bold;
  margin-right: 5px;
}
.last-name {
  font-weight: bold;
  margin-left: 5px;
}
.close {
  cursor: pointer;
  background-color: red;
}

.content {
  font-size: 16px;
  margin: 10px 0;
}
strong {
  font-weight: bold;
  margin: 0 5px;
}
.ok {
  background-color: green;
}
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
