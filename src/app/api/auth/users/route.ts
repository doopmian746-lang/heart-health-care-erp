import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, hashPassword } from "@/lib/auth";
import { createUserSchema } from "@/lib/validations";
import { generateUserId, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireRole(request, "Admin");
    const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
    const safe = users.map(({ passwordHash, ...u }) => u);
    return NextResponse.json(safe);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, "Admin");
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, username, role, password } = parsed.data;
    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        id: generateUserId(),
        username,
        name,
        role,
        passwordHash,
        active: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "User Created",
        entityType: "User",
        entityId: newUser.id,
        details: `Created user ${newUser.name} with role ${newUser.role}`,
      },
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
