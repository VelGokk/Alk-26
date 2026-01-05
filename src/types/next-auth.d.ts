import type { DefaultSession, DefaultUser } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      roles: Role[];
      isActive?: boolean;
      pendingLegalUpdate?: boolean;
      signedLegalDocumentId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    roles?: Role[];
    userId?: string;
    isActive?: boolean;
    pendingLegalUpdate?: boolean;
    signedLegalDocumentId?: string | null;
  }
}
