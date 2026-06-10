import React from "react";
import { RootLayout } from "@payloadcms/next/layouts";
// @ts-expect-error TS 6 flags side-effect imports without type declarations (TS2882); this resolves to CSS at build time
import "@payloadcms/next/css";
import config from "@payload-config";
import { importMap } from "./admin/importMap.js";
import { serverFunction } from "./server-functions";

type Args = {
  children: React.ReactNode;
};

export { metadata } from "@payloadcms/next/layouts";

export default function Layout({ children }: Args) {
  return RootLayout({ children, config, importMap, serverFunction });
}
