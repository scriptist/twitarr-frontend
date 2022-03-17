import React from 'react';
import ReactDOM from 'react-dom';
import App from './react/App';
import { Global, css } from '@emotion/react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.render(
  <React.StrictMode>
    <Global
      styles={css`
        :root {
          font-family: Roboto, sans-serif;
        }
      `}
    />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);