import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { RuleStatus } from "./types";

const selectRules = (state: RootState) => state.rules.entities;

export const makeGetOpposableRulesSelector = createSelector(
  selectRules,
  (rules) => {
    return rules.filter((rule) => rule.status == RuleStatus.Initial);
  }
);
