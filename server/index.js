// server/index.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = process.env.PORT || 3001;

const app = express();

const emitSSE= (res, id, data) =>{
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
  //res.flush();
}

const handleSSE = (req, res) =>{
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  const id = (new Date()).toLocaleTimeString();
  // Sends a SSE every 3 seconds on a single connection.
  setInterval(function() {
    emitSSE(res, id, (new Date()).toLocaleTimeString());
  }, 3000);

  emitSSE(res, id, (new Date()).toLocaleTimeString());
}

app.get("/stream", handleSSE)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true})); 
 app.use(cors())
 

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.post("/api", (req, res) => {
  
  res.json({requestBody: req.body})
});

//Route that handles login logic
app.post('/login', (req, res) =>{
  console.log(req.body.username) 
  console.log(req.body.password) 
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});