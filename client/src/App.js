import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  const url = "http://localhost:3001/stream"
  //url can be your server url

  

  React.useEffect(() => {
    if ('EventSource' in window) {
      let source = new EventSource(url)
      source.addEventListener('message', function(e) {     
        setData(JSON.parse(e.data).navn);
      }, false);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
      
    </div>
  );
}

export default App;