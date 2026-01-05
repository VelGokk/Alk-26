import type { Role } from "@prisma/client";
import type { LearningProfileId } from "@/config/learning-profile";
import type { LearningPathId } from "@/config/learning-paths";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      roles: Role[];
      isActive?: boolean;
      pendingLegalUpdate?: boolean;
      signedLegalDocumentId?: string | null;
      learningProfile?: LearningProfileId;
      learningPath?: LearningPathId;
      referralPoints?: number;
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
    learningProfile?: LearningProfileId;
    learningPath?: LearningPathId;
    referralPoints?: number;
  }
}
