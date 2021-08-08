const { Socket } = require('net');
const EXIT_SOCKET = 'exit';

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const error = (msg) => {
  console.log(msg);
  process.exit(1);
};

const connectToSocket = (host, port) => {
  console.log(`Conecting to server ${host}:${port}...`);
  const socket = new Socket();
  
  socket.connect({
    host,
    port,
  });
  socket.on('connect', () => {
    socket.setEncoding('utf-8');
    console.log('Connected successfully!');
    // Set username of cliente and send to server
    readline.question('Write your username: ', (questionData) => {
      socket.write(questionData);
      console.log('Type "exit" to quit.');
    });

    // Listening for type of client...
    readline.on('line', (msgToSend)=>{
        socket.write(msgToSend)
        msgToSend === EXIT_SOCKET && socket.end()
    })
  });
  socket.on('data', (data) => {
    console.log(data);
  });
  socket.on('error', (e) => error(e.message));
  socket.on('close', () => {
    console.log('Client disconnected');
    process.exit(0);
  });
};
const runClient = () => {
  if (process.argv.length !== 4) {
    error(
      `Wrong arguments. Must send the host and port of socket server listening`
    );
  }
  let port = process.argv[3];
  const host = process.argv[2];
  if (isNaN(port)) {
    error('The port must be number type.');
  }
  port = Number(port);

  connectToSocket(host, port);
};

const isMainFile = require.main === module;

if (isMainFile) {
  runClient();
}
