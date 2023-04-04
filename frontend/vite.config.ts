import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    vueJsx({
      // options ... 
    })
  ],
  css: {
    preprocessorOptions: {
        less: {
            modifyVars: {
                hack: `true; @import (reference) "${path.resolve("src/var.less")}";`,
            },
            javascriptEnabled: true,
        },
        
    },
  },

});
