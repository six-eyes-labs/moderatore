import { Rule, RuleStatus } from "@/store/types";
import React from "react";

const RuleInfo = ({ rule, index }: { rule: Rule; index: number }) => {
  return (
    <div className="flex justify-between items-center content-center border-b  py-4 ">
      <div className="text-lg md:text-xl font-medium text-text">
        {`${index + 1}. ${rule.description}`}
      </div>
      {rule.status == RuleStatus.Disputed && (
        <div className=" text-red-500">Disputed </div>
      )}
    </div>
  );
};

export default RuleInfo;
