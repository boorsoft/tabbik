import { ApiError } from "./apiError";

export function checkOwnership(userId: number, ownerId: number): void {
  if (userId !== ownerId) {
    throw new ApiError("You are not allowed to perform this action", 403);
  }
}
