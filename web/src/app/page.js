"use client";
import { fetchRules } from "@/store/features/rules";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchRules("1182765847962464276"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <w3m-button />
    </main>
  );
}
