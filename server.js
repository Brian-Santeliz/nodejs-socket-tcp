const { Server } = require('net');
const HOST = '0.0.0.0';

const EXIT_SOCKET = 'exit';
const clientConnected = new Map();

const error = (msg) => {
  console.log(msg);
  process.exit(1);
};

const sendMessage = (msg, socketSend) => {
  Array.from(clientConnected.keys())
    .filter((socketCliente) => socketCliente !== socketSend)
    .forEach((socketCliente) => {
      socketCliente.write(msg);
    });
};
const initSocket = (port) => {
  const server = new Server();

  server.on('connection', (socket) => {
    socket.setEncoding('utf-8');
    console.log(
      `Client connected: ${socket.remoteAddress}:${socket.remotePort}`
      );
    socket.on('data', (data) => {
      const client = clientConnected.has(socket);
      if (!client) {
        clientConnected.set(socket, data);
        console.log(
          `¡Client with username ${data} has been register to chat successfully you Adress is: ${socket.remoteAddress}:${socket.remotePort}!`
        );
        return;
      }
      if (data === EXIT_SOCKET) {
        clientConnected.delete(data);
        socket.end();
        return;
      }
      const usernameCliente = clientConnected.get(socket)
      const msgToSendClient = `${usernameCliente} Send: ${data}`;
      console.log(`Client ${usernameCliente}: ${data}`);
      sendMessage(msgToSendClient, socket);
    });

    socket.on('close', () => {
      console.log(
        `Client Disconected with adress: ${socket.remoteAddress}:${socket.remotePort}`
      );
    });
    socket.on('error', (e) => error(e.message));
  });

  server.listen({ port, host: HOST }, () => {
    console.log(`Listening on port ${port} and ${HOST}`);
  });
  server.on('error', (err) => error(err.message));
};

const runServer = () => {
  if (process.argv.length !== 3) {
    error(
      `Wrong arguments. Must send the port for socket server`
    );
  }
  let port = process.argv[2];
  if (isNaN(port)) {
    error('The port must be number type.');
  }
  port = Number(port);
  initSocket(port);
};

const isMainFile = require.main === module;

if (isMainFile) {
  runServer();
}
