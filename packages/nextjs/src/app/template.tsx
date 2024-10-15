"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const template = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default template;
