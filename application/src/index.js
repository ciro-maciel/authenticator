import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { mfaService } from "./services/mfa-service";
import { db } from "./db";
import { companies, tokens, members, memberTokens } from "./db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "secret_key",
    }),
  )
  .group("/api", (app) =>
    app
      // Middleware to check auth (simple mock for now)
      .derive(async ({ jwt, cookie: { auth } }) => {
        const user = await jwt.verify(auth.value);
        return { user };
      })

      .get("/tokens", async ({ user }) => {
        // For now, let's assume all tokens belong to company '1'
        // In a real app, user.companyId would be used
        const results = await db
          .select()
          .from(tokens)
          .where(eq(tokens.companyId, "1"));
        return results;
      })

      .get("/tokens/:id/code", async ({ params: { id } }) => {
        const [token] = await db.select().from(tokens).where(eq(tokens.id, id));
        if (!token) throw new Error("Token not found");

        const decryptedSecret = mfaService.decryptSecret(token.encryptedSecret);
        return mfaService.generateCode(decryptedSecret);
      })

      .post(
        "/tokens",
        async ({ body, set }) => {
          try {
            const { companyId, label, secret } = body;
            const encrypted = mfaService.encryptSecret(secret);

            await db.insert(tokens).values({
              id: crypto.randomUUID(),
              companyId,
              label,
              encryptedSecret: encrypted,
              issuer: body.issuer || "Manual",
            });

            return { success: true };
          } catch (error) {
            set.status = 400;
            return { success: false, message: error.message };
          }
        },
        {
          body: t.Object({
            companyId: t.String(),
            label: t.String(),
            secret: t.String(),
            issuer: t.Optional(t.String()),
          }),
        },
      )

      .get("/members", async ({ query }) => {
        const { tokenId } = query;
        // Assume company '1' for now
        let queryBuilder = db
          .select({
            id: members.id,
            name: members.name,
            email: members.email,
            token: members.token,
            role: members.role,
            createdAt: members.createdAt,
          })
          .from(members);

        if (tokenId) {
          queryBuilder = queryBuilder
            .innerJoin(memberTokens, eq(members.id, memberTokens.memberId))
            .where(
              and(
                eq(members.companyId, "1"),
                eq(memberTokens.tokenId, tokenId),
              ),
            );
        } else {
          queryBuilder = queryBuilder.where(eq(members.companyId, "1"));
        }

        return await queryBuilder;
      })

      .post(
        "/members",
        async ({ body, set }) => {
          try {
            const { companyId, name, email, role, tokenId } = body;
            const token = crypto.randomBytes(4).toString("hex").toUpperCase();
            const memberId = crypto.randomUUID();

            await db.transaction(async (tx) => {
              await tx.insert(members).values({
                id: memberId,
                companyId,
                name,
                email,
                token,
                role: role || "member",
              });

              if (tokenId) {
                await tx.insert(memberTokens).values({
                  memberId,
                  tokenId,
                });
              }
            });

            return { success: true };
          } catch (error) {
            set.status = 400;
            return { success: false, message: error.message };
          }
        },
        {
          body: t.Object({
            companyId: t.String(),
            name: t.String(),
            email: t.String(),
            role: t.Optional(t.String()),
            tokenId: t.Optional(t.String()),
          }),
        },
      )

      .delete("/members/:id", async ({ params: { id }, set }) => {
        try {
          await db.transaction(async (tx) => {
            await tx.delete(memberTokens).where(eq(memberTokens.memberId, id));
            await tx.delete(members).where(eq(members.id, id));
          });
          return { success: true };
        } catch (error) {
          set.status = 400;
          return { success: false, message: error.message };
        }
      }),
  )
  .listen(3000);

console.log(
  `🚀 Shared Authenticator API is running at ${app.server?.hostname}:${app.server?.port}`,
);
