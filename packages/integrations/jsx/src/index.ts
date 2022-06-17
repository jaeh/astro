import { AstroIntegration } from 'astro';

function getRenderer() {
	return {
		name: '@astrojs/jsx',
		clientEntrypoint: '@astrojs/jsx/client.js',
		serverEntrypoint: '@astrojs/jsx/server.js',
		jsxImportSource: 'astro',
		jsxTransformOptions: async () => {
			const { default: { default: jsx } } = await import('@babel/plugin-transform-react-jsx');
			const { default: astroJSX } = await import('./babel/index.js');
			return {
				plugins: [astroJSX(), jsx({ }, { throwIfNamespace: false, runtime: 'automatic', importSource: 'astro' })],
			};
		},
	};
}

function getViteConfiguration() {
	return {
		optimizeDeps: {
			include: ['@astrojs/jsx/client.js'],
			exclude: ['@astrojs/jsx/server.js'],
		},
	};
}

export default function (): AstroIntegration {
	return {
		name: '@astrojs/jsx',
		hooks: {
			'astro:config:setup': ({ addRenderer, updateConfig, addPageExtensions }) => {
				addRenderer(getRenderer());
				addPageExtensions(['.jsx', '.tsx']);
				updateConfig({
					vite: getViteConfiguration(),
				});
			},
		},
	};
}