module.exports = {
  apps: [
    {
      name: 'plunge-portal',
      script: 'npm run start',
      instances: 1,
      autorestart: true,
      watch: false,
      watch_options: {
        followSymlinks: false
      },
      env: {
        // next expects that it will control the value of NODE_ENV.
        // NODE_ENV: 'production',
        PORT: process.env.DEV_APP_PORT || 3002 // Default to 3002 if not set
      },
      max_memory_restart: '1G'
    }
  ]
}
