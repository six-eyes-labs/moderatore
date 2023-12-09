import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { makeGetOpposableRulesSelector } from "./selectors";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetOpposableRules = () => {
  return useSelector(makeGetOpposableRulesSelector);
};
