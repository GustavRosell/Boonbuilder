import React from 'react';
import BoonBuilder from './components/BoonBuilder';
import HealthCheck from './components/HealthCheck';
import './App.css';

function App() {
  return (
    <div className="App">
      <HealthCheck />
      <BoonBuilder />
    </div>
  );
}

export default App;
