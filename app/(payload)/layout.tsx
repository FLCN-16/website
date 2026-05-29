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
    try {
      return await handleServerFunctions({ ...args, config, importMap });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      console.error("[serverFunction] error", { name: (args as { name?: string }).name, message, stack });
      throw err;
    }
  }

  return RootLayout({ children, config, importMap, serverFunction });
}
