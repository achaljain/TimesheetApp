import React from 'react';
import Calender from './components/calender'
import Appbar from './components/appbar'

function App() {
  return (
    <div className="App">
      <div className="appbarContainer">
        <Appbar />
      </div>
      <div className="calenderRoot">
        <Calender />
      </div>
    </div>
  );
}

export default App;
