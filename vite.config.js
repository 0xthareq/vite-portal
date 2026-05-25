import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Root = project root (bukan src)
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        // ─── Halaman publik ───
        index:            resolve(__dirname, 'index.html'),
        ceksurat:         resolve(__dirname, 'ceksurat.html'),
        faq:              resolve(__dirname, 'faq.html'),
        kebijakan:        resolve(__dirname, 'kebijakan-privasi.html'),

        // ─── Admin ───
        adminLogin:       resolve(__dirname, 'admin/login.html'),
        adminPanel:       resolve(__dirname, 'admin/index.html'),
      },

      output: {
        // Nama file jadi acak/hash seperti gambar 1
        chunkFileNames:  'assets/chunks/[name]-[hash].js',
        entryFileNames:  'assets/entry/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      }
    },

    // Minify + mangle pakai terser (kode jadi tidak terbaca)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,   // set true kalau mau hapus console.log
        passes: 2,
      },
      mangle: {
        toplevel: false,       // jangan mangle global yg dipakai HTML onclick
      },
      format: {
        comments: false,       // hapus semua komentar
      }
    },

    // Pisah chunks otomatis
    chunkSizeWarningLimit: 600,
  },

  // Dev server
  server: {
    port: 3000,
    open: true,
  },
})
