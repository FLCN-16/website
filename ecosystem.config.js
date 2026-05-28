module.exports = {
  apps: [
    {
      name: "flcn-website",
      script: "pnpm",
      args: "dev",
      cwd: "/root/Work/flcn-website",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};
