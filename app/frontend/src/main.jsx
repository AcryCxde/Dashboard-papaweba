import React from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App/>
        </ErrorBoundary>
    </React.StrictMode>
);
