import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path';
import dts from 'vite-plugin-dts';
import {peerDependencies} from './package.json';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
	react(),
	cssInjectedByJsPlugin(),
	dts({
	    insertTypesEntry: true
	})
    ],
    build: {
	lib: {
	    /*
	    entry: [
		path.resolve(__dirname, 'src/HoursFormatter/HoursFormatter.tsx'),
		path.resolve(__dirname, 'src/InputComponent/InputComponent.tsx'),
		path.resolve(__dirname, 'src/Map/Map.tsx')

	    ],
	     */
	    entry: path.resolve(__dirname, 'src/index.tsx'),
	    name: 'frg-react',
	    formats: ['es', 'umd'],
	    fileName: (format) => `frg-react.${format}.js`
	},
	rollupOptions: {
	    external: Object.keys(peerDependencies),
	    output: {
		globals: {
		    react: 'React',
		    'react-dom': 'ReactDom'
		}
	    }
	}
    }
})
