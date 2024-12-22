import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "../constants/common";

const paginationValidationSchema = z.object({
  page: z.number().positive("Page number has to be positive").default(1),
  size: z
    .number()
    .positive("Page size has to be positive")
    .max(30, "Page size has to be less than 30")
    .default(DEFAULT_PAGE_SIZE),
});

export default paginationValidationSchema;
