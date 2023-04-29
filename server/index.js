const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// enable CORS
app.use(cors());

// store data from POST request
let data = {};

// POST endpoint to receive data
app.post('/data', (req, res) => {
  data = req.body;
  res.send('Data received!');
});

// GET endpoint to send event stream
app.get('/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const id = (new Date()).toLocaleTimeString();

  // send the data in event stream format
  const eventData = `id: ${id}\ndata: ${JSON.stringify(data)}\n\n`;
  res.write(eventData);

  // keep the connection open and send SSE every 5 seconds
  const intervalId = setInterval( async () => {
    const newId = (new Date()).toLocaleTimeString();
    const newData = `id: ${newId}\ndata: ${JSON.stringify(data)}\n\n`;
    res.write('event: message\n');  // message event
    res.write(newData);
  }, 5000);

  // end the connection when client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
