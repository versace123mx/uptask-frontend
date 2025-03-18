import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

/*
La configruacion 

resolve:{
      alias:{
        '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }

  solo es para que en las carpetas la ruta sea @archivo y no ../carpeta/componente
  tambien se configuran en tsconfig.json
*/
