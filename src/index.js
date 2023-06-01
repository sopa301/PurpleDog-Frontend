import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { 
  ChakraProvider, 
  extendTheme as chakraExtendTheme,
  createStandaloneToast,
} from '@chakra-ui/react';
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme as muiCreateTheme,
  THEME_ID,
} from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const chakraTheme = chakraExtendTheme();
const materialTheme = muiCreateTheme();
const root = ReactDOM.createRoot(document.getElementById('root'));
const {ToastContainer, toast} = createStandaloneToast();
root.render(
  <ChakraProvider theme={chakraTheme} resetCSS>
    <React.StrictMode>
      <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <App toast={toast}/>
          <ToastContainer />
        </LocalizationProvider>
      </MaterialThemeProvider>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
