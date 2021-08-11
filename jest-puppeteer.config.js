module.exports = {
    launch: {
      dumpio: true,
      headless: process.env.HEADLESS !== 'false',
    },
    server: {
      command: 'npm run start',
      port: 3000,
      protocol: 'http',
      host: 'testhost.com',
      launchTimeout: 10000,
      debug: true,
    },
  }