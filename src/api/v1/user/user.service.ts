import { count, eq, getTableColumns, ilike, or } from "drizzle-orm";
import { db } from "@/db/db";
import { user } from "@/db/schema/user";
import { UserInsert } from "./types";
import paginate from "@/common/utils/pagination";
import { PaginationParams } from "@/common/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { UserFilters } from "./filters";

export async function createUser(userData: UserInsert) {
  const data = await db.insert(user).values(userData).returning({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isNovice: user.isNovice,
  });

  return data[0];
}

export async function getUsers(
  { page = 1, size = DEFAULT_PAGE_SIZE }: PaginationParams = {},
  filters?: UserFilters
) {
  const { offset, limit } = paginate({ page, size });

  const data = await db.query.user.findMany({
    offset,
    limit,
    where: filters?.search
      ? or(
          ilike(user.username, `%${filters.search}%`),
          ilike(user.firstName, `%${filters.search}%`),
          ilike(user.lastName, `%${filters.search}%`)
        )
      : undefined,
    orderBy: (user, { asc }) => asc(user.id),
  });

  const dataCount = await db.select({ count: count() }).from(user);

  const totalData = dataCount[0].count;

  const paginationMetadata = {
    totalData,
    page,
    size,
    totalPages: Math.ceil(totalData / size),
  };

  return { data, paginationMetadata };
}

export async function getUserByUsername(username: string) {
  const data = await db.select().from(user).where(eq(user.username, username));

  return data[0];
}

export async function getUserById(id: number) {
  const { password, ...rest } = getTableColumns(user);

  const data = await db
    .select({ ...rest })
    .from(user)
    .where(eq(user.id, id));

  return data[0];
}
