import { ARBITRATOR_ADDRESS, MODERATORE_ADDRESS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className=" h-fit w-full p-6 md:px-16 lg:px-40 md:py-4 md:pb-16 box-border  ">
      <div className="h-fit w-full flex flex-col rounded-lg bg-gray-100 p-4 md:p-12 pb-4 gap-2 ">
        <Link className="flex gap-1 items-center text-xl" href="/">
          Moderatore
        </Link>
        <div className="flex flex-col md:flex-row my-4">
          <div className="flex-1 ">
            <div className="text-accent text-lg md:text-xl font-semibold mt-1">
              EXPLORE
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href={"https://github.com/six-eyes-labs/moderatore"}
                target="_blank"
                rel="noreferrer"
              >
                Github
              </Link>
              <Link
                href={`https://mumbai.polygonscan.com/address/${MODERATORE_ADDRESS}#code`}
                target="_blank"
                rel="noreferrer"
              >
                Contract
              </Link>
              <Link
                href={`https://centralised-arbitrator.netlify.app/?arbitrator=${ARBITRATOR_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                Court
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full border-t text-center justify-center pt-4">
          Made with{" "}
          <Image
            className="mx-1"
            src={"images/heart.svg"}
            width={20}
            height={20}
            alt="heart"
          />{" "}
          by @Akatsuki
        </div>
      </div>
    </div>
  );
};

export default Footer;
