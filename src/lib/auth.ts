import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { LogLevel, type Role } from "@prisma/client";
import { prisma } from "./prisma";
import { logEvent } from "./logger";
import { ROLE_HOME } from "@/config/roles";
import { DEFAULT_LOCALE, isLocale } from "@/config/i18n";
import { auditEvent } from "./audit";
import {
  LearningProfileId,
  LEARNING_PROFILE_DEFAULT,
} from "@/config/learning-profile";
import {
  LearningPathId,
  LEARNING_PATH_DEFAULT,
} from "@/config/learning-paths";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (!user.isActive) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        await logEvent({
          action: "auth.login",
          message: `Login de ${user.email}`,
          userId: user.id,
        });

        return user;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  events: {
    async signIn({ user, account, isNewUser }) {
      await auditEvent({
        action: "auth.signIn",
        userId: user?.id,
        source: account?.provider,
        metadata: {
          provider: account?.provider,
          isNewUser,
        },
      });
    },
    async signOut({ session }) {
      await auditEvent({
        action: "auth.signOut",
        userId: session?.user?.id,
        metadata: {
          email: session?.user?.email,
        },
      });
    },
    async error({ error }) {
      await auditEvent({
        action: "auth.error",
        status: "failure",
        level: LogLevel.ERROR,
        metadata: {
          message: error?.message,
          stack: error?.stack,
        },
      });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as {
          id: string;
          role?: string;
          isActive?: boolean;
          pendingLegalUpdate?: boolean;
          signedLegalDocumentId?: string | null;
          learningProfile?: LearningProfileId;
          learningPath?: LearningPathId;
        };
        token.role = typedUser.role ?? "USER";
        token.userId = typedUser.id;
        token.isActive = typedUser.isActive ?? true;
        const storedRoles = await prisma.userRole.findMany({
          where: { userId: typedUser.id },
          select: { role: true },
        });
        const assignedRoles = storedRoles.map((entry) => entry.role);
        token.roles =
          assignedRoles.length > 0
            ? assignedRoles
            : [typedUser.role ?? (Role.USER as Role)];
        token.pendingLegalUpdate = Boolean(typedUser.pendingLegalUpdate);
        token.signedLegalDocumentId = typedUser.signedLegalDocumentId ?? null;
        token.learningProfile =
          typedUser.learningProfile ?? LEARNING_PROFILE_DEFAULT;
        token.learningPath = typedUser.learningPath ?? LEARNING_PATH_DEFAULT;
        token.referralPoints = typedUser.referralPoints ?? 0;
      }
      if (!token.roles?.length) {
        token.roles = [(token.role as Role) ?? Role.USER];
      }
      if (!user && token.userId) {
        const persistedUser = await prisma.user.findUnique({
          where: { id: token.userId as string },
        select: {
          pendingLegalUpdate: true,
          signedLegalDocumentId: true,
          learningProfile: true,
          learningPath: true,
          referralPoints: true,
        },
        });
        if (persistedUser) {
          token.pendingLegalUpdate = Boolean(
            persistedUser.pendingLegalUpdate
          );
          token.signedLegalDocumentId =
            persistedUser.signedLegalDocumentId ?? null;
        token.learningProfile =
          persistedUser.learningProfile ?? LEARNING_PROFILE_DEFAULT;
        token.learningPath =
          persistedUser.learningPath ?? LEARNING_PATH_DEFAULT;
        token.referralPoints = persistedUser.referralPoints ?? 0;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.roles = (token.roles as Role[]) ?? [
          (token.role as Role) ?? Role.USER,
        ];
        session.user.pendingLegalUpdate = Boolean(token.pendingLegalUpdate);
        session.user.signedLegalDocumentId =
          token.signedLegalDocumentId as string | undefined;
        session.user.isActive = Boolean(token.isActive);
        session.user.learningProfile =
          (token.learningProfile as LearningProfileId) ?? LEARNING_PROFILE_DEFAULT;
        session.user.learningPath =
          (token.learningPath as LearningPathId) ?? LEARNING_PATH_DEFAULT;
        session.user.referralPoints = (token.referralPoints as number) ?? 0;
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      try {
        const resolvedUrl = new URL(url, baseUrl);
        const [, candidateLocale] = resolvedUrl.pathname.split("/");
        const locale = isLocale(candidateLocale) ? candidateLocale : DEFAULT_LOCALE;
        const role = (token?.role as Role) ?? "USER";
        const isAuthFlow =
          resolvedUrl.pathname === "/" ||
          resolvedUrl.pathname.startsWith("/auth") ||
          resolvedUrl.pathname.startsWith("/api/auth");

        if (isAuthFlow) {
          const rolePath = ROLE_HOME[role] ?? ROLE_HOME.USER;
          return `${baseUrl}/${locale}${rolePath}`;
        }
      } catch {
        // Fallback to default on invalid URLs.
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
