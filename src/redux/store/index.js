import { combineReducers, configureStore } from "@reduxjs/toolkit"
import recipesReducer from "../reducers/recipesReducer.js"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"

// Persist only the query field of tracksSearch
// const tracksSearchPersistConfig = {
//   key: "tracksSearch",
//   storage,
//   whitelist: ["query"], // only state.tracksSearch.query
// }

const bigReducer = combineReducers({
  // tracksSearch: persistReducer(tracksSearchPersistConfig, tracksSearchReducer),
  recipes: recipesReducer,
})

const store = configureStore({
  reducer: bigReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

const persistedStore = persistStore(store)

export { store, persistedStore }
