import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppContainer } from './components/AppContainer';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<AppContainer />);
