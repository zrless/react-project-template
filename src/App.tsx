import React from 'react';
import BasicLayout from './layout';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <BasicLayout />
    </BrowserRouter>
  );
}

export default App;
