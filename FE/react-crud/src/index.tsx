import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Persistore } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>  
    {/* if we don't want persistance storage then remove below PersistGate tag */}
    <PersistGate loading={null} persistor={Persistore}>   
    {/* browserrouter is for routes tags we used inside our apps and components from react-router-dom lib */ }
    <App />
    </PersistGate>
    </Provider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);


// types of storage:
// 1.localstorage: it's data stored  in client local mahcine, we can store max 10mb, it's data won't be deleted, even if 
// we close tab or browser, we can use it's data in multiple tabs.
// 2. session storage: it's same like localstorage only difference is, its limit is  5mb and it will be delete when current tab closed.
// we can't use it's data in other tab.
// so both local and session storage is vulnerable to cross site scripting attack, so it's bteer if we always use secre third partylibs
// and valide user inputs.
// 3. cookies:here we store token with http-only flag True, so that only servers can access that cookie.
// cookie are more secure way than local and session storage, but here we can store only few kb's, also it is vulnerable for csrf attacks
// but we can use anti csrf tokens to fix it.but still we need to do server side changes as well, which makes process more complex.
// 4. Redux: redux is used to manage all states in place, which is used to store in-memory data, but it will be lost once page-refreshed or closed and won't work on another tabs like session data.
// plus using redux we can share same state with multiple componenets ,which was impossible with only states earlies, also using props, we
// can send data from parent to child, to update parent state from child we have to send state with its callback as prop to child, so that it can update it,
// but it will be tedious way if e are doing for multi level nested comps, this struture will like callback hell and debuggin wil; be difficult.
// so to avoid that we have redux

// localStorage.setItem('variableName', data);
// localStorage.getItem('variableName');
// localStorage.removeItem('variableName');

// sessionStorage.setItem("jwt", token)

// in conclusion we can store token in localstorage as it simple approach, in case attackers get token using xss attack we
// can  add a foot print in cookie, so that a particular token can be used with that cookie only. so even if attacker got the 
// token it will be of no use without cookie. similar thing is anti CSRF token also as no other client interface can use backend API's 
// apart from which who has valid CSRF token. in this case backend creates a CSRF token and send it to front end, then front end sends
// same token back to server with post request.

//CORS is nothing but corss origin policy, bydefualt browsers only allows request from same origin (same domain), so to fx this
// we can define in ur server from which others servers we can accepts requests, then our server will add a header(which will be something like
// access control allowed  origin). then we won't get cors error.