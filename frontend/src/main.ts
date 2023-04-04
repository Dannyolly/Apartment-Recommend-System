import { createSSRApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
// @ts-ignore
import uviewPlus from 'uview-plus'
export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia()
  pinia.use(({ store }) => {
      const initialState = JSON.parse(JSON.stringify(store.$state));
      store.$reset = () => {
      store.$state = JSON.parse(JSON.stringify(initialState));
    }
  });
  
  app.use(pinia)
  app.use(uviewPlus);
  //@ts-ignore
  uni.$u.config.unit = 'rpx';
  return {
    app
  };
}
