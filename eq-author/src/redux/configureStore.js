import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  routerMiddleware as createRouterMiddleware,
  routerReducer as router,
} from "react-router-redux";
import toasts from "redux/toast/reducer";
import saving from "redux/saving/reducer";
import tabs from "redux/tabs/reducer";
import authReducer from "redux/auth/reducer";
import auth from "components/Auth";
import sharing from "redux/sharing";
import homepage from "redux/homepage";

import persistState from "redux-localstorage";

const configureStore = (history, client, preloadedState) =>
  createStore(
    combineReducers({
      router,
      saving,
      tabs,
      toasts,
      sharing,
      homepage,
      auth: authReducer,
    }),
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        createRouterMiddleware(history),
        thunk.withExtraArgument({ auth, client })
      ),
      persistState(["sharing", "homepage", "tabs"])
    )
  );

export default configureStore;
