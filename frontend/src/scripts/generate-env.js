// scripts/generate-env.js
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.config().parsed;

const envFileContent = `
export const environment = {
  production: true,
  API_URL: "${envConfig.API_URL}"
};
`;

fs.writeFileSync('src/environments/environment.prod.ts', envFileContent);
