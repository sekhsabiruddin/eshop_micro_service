const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Auth Service',
    description: 'Automatically generated API docs for the Auth Service',
    version: '1.0.0',
  },
  host: 'localhost:6001',
  basePath: '/api',
  schemes: ['http'],
};

const outputFile = './apps/auth-service/src/swagger-output.json';  // ✅ Corrected path
const endpointsFiles = ['./apps/auth-service/src/routes/auth.router.ts'];  // ✅ Point to your routes

swaggerAutogen(outputFile, endpointsFiles, doc);
