import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './routes/App/App/App';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Login from './routes/Login/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Login />} />
        <Route path="app" element={<App />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
