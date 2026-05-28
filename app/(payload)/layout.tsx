import React from "react";
import type { ServerFunctionClientArgs } from "payload";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import "@payloadcms/next/css";
import config from "@payload-config";
import { importMap } from "./admin/importMap.js";

type Args = {
  children: React.ReactNode;
};

export { metadata } from "@payloadcms/next/layouts";

export default function Layout({ children }: Args) {
  async function serverFunction(args: ServerFunctionClientArgs) {
    "use server";
    return handleServerFunctions({ ...args, config, importMap });
  }

  return RootLayout({ children, config, importMap, serverFunction });
}
