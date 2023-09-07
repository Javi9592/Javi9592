import React from 'react';
import ReactDOM from 'react-dom/client';
import { StateProvider } from './state/state';
import { reducer } from './state/reducer';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>,
);
