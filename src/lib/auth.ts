// src/lib/auth.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
            // TAMBAHAN: Masukkan role ke dalam session
            role: attributes.role 
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
    // TAMBAHAN: Definisikan tipe datanya
    role: string;
}