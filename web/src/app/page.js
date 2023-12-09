"use client";
import { fetchRules } from "@/store/features/rules";
import { fetchServers } from "@/store/features/server";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchServers());
  }, []);

  const servers = useAppSelector((state) => state.servers.entities);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div class="w-100  bg-white rounded p-6">
        <h2 class="text-2xl font-bold mb-4">Submit a String</h2>
        <form id="myForm" class="space-y-4" action="#">
          <div>
            <label for="inputString" class="block text-sm font-semibold">
              Input String
            </label>
            <input
              id="inputString"
              type="text"
              placeholder="Enter your string"
              class="w-full border-gray-300 rounded-md
          focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none
          focus:ring-2 focus:ring-opacity-50 px-4 py-2"
            />
          </div>
          <div>
            <button
              id="submitBtn"
              type="submit"
              class="w-full bg-indigo-600 text-white rounded-md
          hover:bg-indigo-700 px-4 py-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
