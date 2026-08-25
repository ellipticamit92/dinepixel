module.exports = {
  apps: [
    {
      name: "dinepixel",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/deploy/dinepixel",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
