import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { PaginationParams } from "../types/pagination";

export default function paginate({
  page = 1,
  size = DEFAULT_PAGE_SIZE,
}: PaginationParams) {
  const offset = (page - 1) * size;
  const limit = size;

  return { offset, limit };
}
