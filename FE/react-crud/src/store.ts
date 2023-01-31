import rootReducer from './reducers/rootReducer';
import {combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { applyMiddleware } from 'redux';

// in page refresh redux data will be cleared, so to solve that issue we will use redux-persist
// so instead of sving states data in ram, it will store them in localstorage so it will be persists even if tab closed.
import {persistStore, persistReducer, FLUSH, REHYDRATE, PERSIST, PAUSE, PURGE, REGISTER} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persisConfig = {
    // key could be anything
    key:'main-root',
    storage,
}
const persistReducers = persistReducer(persisConfig, rootReducer);


const reducer = combineReducers({
    // similary we can specify multiple reducers
    // incase you don't want persist store then replace below persistReducers with rootRedcuer
    loginReducer: persistReducers
});

// in case we have only one reducer, then we can pass directly to below function.
const store = configureStore({reducer:reducer,

    // we can append middleware to defaultMiddlewares
    // in case we don't want ersistance storge, we can ignore serializableCheck: 
middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
})});

// incase you don't want persist store then remove below 2 lines
const Persistore = persistStore(store);
export{Persistore}


export default store;


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch