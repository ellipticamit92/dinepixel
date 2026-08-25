module.exports = {
  apps: [
    {
      name: "dinepixel",
      script: "npm",
      args: "start",
      cwd: "/home/deploy/dinepixel",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
