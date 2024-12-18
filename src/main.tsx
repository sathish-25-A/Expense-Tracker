import React from 'react';
import ReactDOM from 'react-dom/client'; // Notice the change here
import App from './App';
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // createRoot instead of render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
