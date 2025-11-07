const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerConfig = require('../src/docs/swagger');

const specs = swaggerJsdoc(swaggerConfig);
const outputPath = path.resolve(__dirname, '../src/docs/swagger-output.json');
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
console.log('Swagger documentation generated at', outputPath);
