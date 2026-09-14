import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './reducer/AuthReducer';
import MainReducer from './reducer/MainReducer';
import logger from 'redux-logger';
import RootSaga from './reduxSaga/RootSaga';
const createSagaMiddleware = require('redux-saga').default;

let sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, logger];

export default configureStore({
  reducer: {
    AuthReducer: AuthReducer,
    MainReducer: MainReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(middleware),
});

sagaMiddleware.run(RootSaga);
