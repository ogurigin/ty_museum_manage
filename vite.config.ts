import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VitePluginCompression from 'vite-plugin-compression';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig(({ command, mode }) => {
	loadEnv(mode, process.cwd());
	return {
		base: './',
		build: {
			minify: false, //打包结果是否minify
			rollupOptions: { //vite打包是通过rollup来打包的
				output: {
					manualChunks: (id: string) => {
						if (id.indexOf('no_modules') > -1) {
							return 'vendor'
						}
					}
				}
			}
		},
		plugins: [
			vue(),
			VueSetupExtend(),
			createSvgIconsPlugin(
				{
					iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
					symbolId: 'icon-[dir]-[name]'
				}
			),
			AutoImport({
				imports: ['vue', 'vue-router'],
				dts: 'src/auto-import.d.ts',
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()],
				dts: 'src/components.d.ts',
			}),
			// ViteCDNPlugin({
			// 	modules: [{
			// 		name: 'lodash', //包名
			// 		var: '_', //对应的cdn导出变量
			// 		path: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'
			// 	}]
			// }),
			VitePluginCompression()
		],
		optimizeDeps: {
			include: ['schart.js']
		},
		server: {
			// 配置代理
			port:'2222',
			proxy: {
				'/api': {
					// target: "http://192.168.1.113:9063",
					target: "https://zxadmin.taoart.com/api",
					secure: false,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				},
				'/Two': {
					// target: "http://192.168.1.113:9057",
					target: "https://crm.taoart.com/system/listType",
					secure: false,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/Two/, ''),
				},
				'/ggb': {
					target: "http://192.168.1.112:8080",
					secure: false,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/ggb/, ''),
				},
				//线上地址
				// "/api": {
				//   target: "https://zxapi.taoart.com/api",
				//   secure: true,
				//   changeOrigin: true,
				//   rewrite: path => path.replace(/^\/api/, ''),
				// },

				// //线上地址
				// '/Two': {
				// 	target: "https://crm.taoart.com/system/listType",
				// 	secure: false,
				// 	changeOrigin: true,
				// 	rewrite: path => path.replace(/^\/Two/, ''),
				// },
			},
		},
		resolve: {
			alias: [
				{
					find: '@',
					replacement: resolve(__dirname, './src')
				}
			]
		}
	}
});
