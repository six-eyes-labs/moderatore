import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getServers } from "./contract-helpers";
import { Server } from "../types";

export const fetchServers = createAsyncThunk(
  "servers/fetchServers",
  async () => {
    const response = await getServers();

    return response as Server[];
  }
);

export interface ServerState {
  entities: Server[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  entities: [],
  loading: "idle",
} as ServerState;

const serverSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchServers.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});

export const serverReducers = serverSlice.reducer;
export default serverSlice.actions;
