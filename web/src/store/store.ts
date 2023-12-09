import { configureStore } from "@reduxjs/toolkit";
import { ruleReducers } from "./features/rules";
import { proposalReducers } from "./features/proposals";
import { serverReducers } from "./features/server";

export const store = configureStore({
  reducer: {
    rules: ruleReducers,
    proposals: proposalReducers,
    servers: serverReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
