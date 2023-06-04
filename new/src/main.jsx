import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page"; 
import Root from './routes/root';
import Login from './routes/login';
import LoginComponent from './components/login/loginComponent';
import SignUpComponent from './components/login/signUpComponent';
import Projects from './routes/projects';
import ProjectPage, {loader as projLoader} from './components/projects/projectPage';
import Profile from './routes/profile';
import Home from './routes/home';
import ErrorLoading from './components/projects/errorLoading';

const chakraTheme = chakraExtendTheme();
const materialTheme = muiCreateTheme();
const root = ReactDOM.createRoot(document.getElementById('root'));
const {ToastContainer, toast} = createStandaloneToast();
export const ToastContext = createContext(toast);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root toast={toast}/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/tasks",
        element: <div>Here's your active tasks</div>,
      },
      {
        path: "/projects",
        children: [
          {
            path: "",
            element: <Projects toast={toast}/>,
          },
          {
            path: ":projName",
            element: <ProjectPage toast={toast}/>,
            loader: projLoader,
          },
          {
            path: "error",
            element: <ErrorLoading toast={toast}/>,
          },
        ],
      },
      {
        path: "/profile",
        // TODO : create a profile page or sth
        element: <Profile/>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "",
        element: <LoginComponent />,
      },
      {
        path: "signup",
        element: <SignUpComponent />,
      },
    ],
  },
]);

root.render(
  <ChakraProvider theme={chakraTheme} resetCSS>
    <React.StrictMode>
      <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ToastContext.Provider value={toast}>
            <RouterProvider router={router} />
          </ToastContext.Provider>
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
