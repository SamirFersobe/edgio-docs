// This file was automatically added by edgio init.
// You should commit this file to source control.
const {withEdgio, withServiceWorker} = require('@edgio/next/config');

const mdConstants = require('./constants');

const path = require('path');
const {remarkPlugins} = require('./plugins/markdownToHtml');

const _preEdgioExport = {
  images: {
    domains: ['opt.moovweb.net'],
  },
  experimental: {
    plugins: true,
    // TODO: this doesn't work because https://github.com/vercel/next.js/issues/30714
    concurrentFeatures: false,
    scrollRestoration: true,
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  webpack: (config, {dev, isServer, ...options}) => {
    // IMPORTANT: https://www.npmjs.com/package/webpack-bundle-analyzer
    if (process.env.ANALYZE) {
      const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    // Add our custom markdown loader in order to support frontmatter
    // and layout
    config.module.rules.push({
      test: /.mdx?$/, // load both .md and .mdx files
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins,
          },
        },
        // IMPORTANT: This is the page layouts loader
        // The tree is MyApp, AppShell, Page...
        // This is the starting point of the app. Makes sure all pages
        // 1. Are all .mdx files as oppose .ts or .tsx — it essentially reads
        // from the file-system without having to getStaticProps and co
        path.join(__dirname, './plugins/md-layout-loader'),

        // Replace template strings (eg. {{ PRODUCT_NAME }} ) in .md files
        {
          loader: 'string-replace-loader',
          options: {
            search: '{{\\s*(\\w+)\\s*}}',
            flags: 'gi',
            replace(match, p1, offset, string) {
              // return the matching constants value or the original match if not found
              return mdConstants[p1] || match;
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = (phase, config) =>
  withEdgio(
    withServiceWorker({
      ..._preEdgioExport,
    })
  );
