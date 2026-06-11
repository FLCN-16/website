"use server"

import type { ServerFunctionClientArgs } from "payload";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import config from "@payload-config";
import { importMap } from "./admin/importMap.js";

export async function serverFunction(args: ServerFunctionClientArgs) {
  return handleServerFunctions({ ...args, config, importMap });
}
