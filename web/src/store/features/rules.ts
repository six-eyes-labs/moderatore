import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRules } from "./contract-helpers";
import { Rule } from "../types";

export const fetchRules = createAsyncThunk(
  "rules/fetchRules",
  async (guildId: string) => {
    const response = await getRules(guildId);
    console.log(response, guildId);

    return response as Rule[];
  }
);

export interface RulesState {
  entities: Rule[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  entities: [],
  loading: "idle",
} as RulesState;

const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRules.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});

export const ruleReducers = rulesSlice.reducer;
export default rulesSlice.actions;
