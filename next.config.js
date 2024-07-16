/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['echarts', 'zrender']);


const nextConfig =  withPlugins([
  withTM,
], {
  reactStrictMode: false,
  //disable EsLint
  eslint: {
    ignoreDuringBuilds: true,
  },
});

module.exports = nextConfig;