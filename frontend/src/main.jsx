import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './Responsive.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './redux/reduxStore.js';




ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App/>
    </Provider>

)
