const { Server } = require('net');
const HOST = "0.0.0.0";

const error = (message) => {
  console.log(message);
  process.exit(1);
};

const initSocket = (port) => {
  const server = new Server();
  server.listen({port, host:HOST}, () => {
    console.log(`Listening on port ${port}`);
  })
};

const runServer = () => {
  if (process.argv.length !== 3) {
    error(
      `Argumentos incorrectos. Debe ser: Obejeto de  Node, ${process.argv[1]} & Puerto`
    );
  }
  let port = process.argv[2];
  if (isNaN(port)) {
    error('El puerto debe ser un número.');
  }
  port = Number(port);
  initSocket(port);
};

const isMainFile = require.main === module;

if (isMainFile) {
  runServer();
}
