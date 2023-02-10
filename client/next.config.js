const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
	eslint: {
		dirs: ['.'],
	},
	env: {
		SERVER_IP1: process.env.SERVER_IP1,
	},
	poweredByHeader: false,
	trailingSlash: true,
	basePath: '',
	reactStrictMode: true,
})

module.exports = withImages()
