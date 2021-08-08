const { Socket } = require('net');
const error = (msg) => {
  console.log(msg);
  process.exit(1);
};

const connectToSocket = (host, port) => {
  console.log(`Conecting to server ${host}:${port}`);

  const socket = new Socket();
  // Setting of socket
  socket.setDefaultEncoding('utf-8');
  socket.connect({
    host,
    port,
  });
  socket.on("connect", ()=>{
    console.log('Connected successfully!');

  })
  socket.on('error', (e) => error(e.message));
};
const runClient = () => {
  if (process.argv.length !== 4) {
    error(
      `Argumentos incorrectos. Debe ser: Obejeto de  Node, ${process.argv[1]}, Host & Puerto`
    );
  }
  let port = process.argv[3];
  const host = process.argv[2];
  if (isNaN(port)) {
    error('El puerto debe ser un número.');
  }
  port = Number(port);

  connectToSocket(host, port);
};

const isMainFile = require.main === module;

if (isMainFile) {
  runClient();
}
