import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@adneo.cloud",
    name: "Admin ADNEO",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@adneo.cloud",
    name: "Utilisateur Test",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("auth.me", () => {
  it("retourne l'utilisateur connecté", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user?.email).toBe("admin@adneo.cloud");
    expect(user?.role).toBe("admin");
  });

  it("retourne null pour un utilisateur non connecté", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});

describe("admin.config", () => {
  it("refuse l'accès à un utilisateur non-admin", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.config.list()).rejects.toThrow();
  });
});

describe("sites.list", () => {
  it("retourne la liste des sites supportés", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const sites = await caller.sites.list();
    expect(Array.isArray(sites)).toBe(true);
    expect(sites.length).toBeGreaterThanOrEqual(4);
    const siteIds = sites.map((s) => s.id);
    expect(siteIds).toContain("paruvendu");
    expect(siteIds).toContain("topannonces");
    expect(siteIds).toContain("vivastreet");
    expect(siteIds).toContain("entreparticuliers");
  });
});

describe("auth.logout", () => {
  it("efface le cookie de session et retourne succès", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const { ctx } = createAdminContext();
    ctx.res.clearCookie = (name: string, options: Record<string, unknown>) => {
      clearedCookies.push({ name, options });
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1 });
  });
});
