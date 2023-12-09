import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProposals } from "./contract-helpers";
import { Proposal } from "../types";

export const fetchProposals = createAsyncThunk(
  "proposals/fetchProposals",
  async (guildId: string) => {
    const response = await getProposals(guildId);
    return response as Proposal[];
  }
);

export interface ProposalState {
  entities: Proposal[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  entities: [],
  loading: "idle",
} as ProposalState;

const proposalsSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProposals.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});

export const proposalReducers = proposalsSlice.reducer;
export default proposalsSlice.actions;
