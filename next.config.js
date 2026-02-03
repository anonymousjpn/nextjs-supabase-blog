/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        appDir:true
    },
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:["gflfnxtbayoabieasfgp.supabase.co"]
  },
  webpack: (config, { webpack }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals['node:fs'] = 'commonjs node:fs';
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      'stream/web': false,
      async_hooks: false,
      net: false,
      tls: false,
      'util/types': false,
      worker_threads: false,
      perf_hooks: false,
      console: false,
      diagnostics_channel: false,
    };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^node:(crypto|events|stream|util)/,
        (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }
      )
    );

    return config;
  },
}

module.exports = nextConfig
