import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Tag from "./components/Tag.vue";
const app = createApp(App);

app.component("Tag", Tag);

app.mount("#app");
