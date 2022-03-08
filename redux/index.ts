import { createStore, applyMiddleware, StoreEnhancer, Store } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const initialState = {};
const is_producation = process.env.NODE_ENV !== "development";

// create a makeStore function
const makeStore = () => {
  const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

  // create Enhancer from Middlewares
  let storeEnhancer: StoreEnhancer = applyMiddleware(sagaMiddleware);
  if (!is_producation) {
    storeEnhancer = composeWithDevTools(storeEnhancer);
  }

  // Create store
  const store: Store = createStore(rootReducer, initialState, storeEnhancer);

  sagaMiddleware.run(rootSaga);

  return store;
};

// export an assembled wrapper
const wrapper_config = { debug: false };
export const wrapper = createWrapper<Store>(makeStore, wrapper_config);
