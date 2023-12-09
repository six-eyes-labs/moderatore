"use client";
import React from "react";
import Link from "next/link";
import { m, useAnimate, useCycle } from "framer-motion";

import { arbitratorSite } from "@/constants";
import MenuToggle from "./MenuToggle";

const Appbar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [scope, animate] = useAnimate();

  return (
    <m.div className="flex flex-col md:flex-row lg:flex-row container justify-between align-middle content-center fixed bg-white  min-w-full md:w-auto border-b p-2 md:px-16 lg:px-40 md:py-4 z-50">
      <div className="flex flex-grow-0 flex-row justify-between align-middle content-center items-center  ">
        <div className=" text-black text-2xl md:text-3xl font-extrabold cursor-pointer">
          {" "}
          <Link className="flex gap-1 items-center" href="/">
            Moderatore
          </Link>
        </div>
        <m.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          className="md:hidden float-right"
        >
          <MenuToggle toggle={() => toggleOpen()} />
        </m.div>
      </div>

      <m.div
        initial={{ y: -200 }}
        animate={{ y: isOpen ? 0 : -200 }}
        className={` w-max min-w-[90%] m-auto min-h-fit ${
          isOpen ? "flex flex-col" : "hidden"
        } md:hidden lg:hidden justify-between items-center p-2 border border-b rounded border-white m-2 box-border relative`}
      >
        <div
          className="w-full flex flex-col "
          onClick={() => setTimeout(() => toggleOpen(), 500)}
        >
          <Link
            href={arbitratorSite}
            target="_blank"
            rel="noreferrer"
            className="font-semibold cursor-pointer hover:scale-110 py-1"
          >
            Disputes
          </Link>
          <div className=" self-center">
            <w3m-button size="md" />
          </div>
        </div>
      </m.div>

      {/* large screen */}
      <m.div
        className="justify-between content-center items-center gap-4 hidden md:flex md:flex-grow-1 lg:flex lg:flex-grow-1"
        ref={scope}
      >
        <Link
          href={arbitratorSite}
          target="_blank"
          rel="noreferrer"
          className="font-semibold cursor-pointer hover:scale-105 py-1"
        >
          Disputes
        </Link>
        <div>
          <w3m-button />
        </div>
      </m.div>
    </m.div>
  );
};

export default Appbar;
