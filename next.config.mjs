/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true, // Necessary for GitHub Pages deployment
	},
	trailingSlash: true,
};

export default nextConfig;
