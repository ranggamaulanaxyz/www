import z from "zod";

export const POST_STATUS = ["draft", "published", "archived"];

export const POST_VISIBILITY = ["public", "private", "unlisted"];

export const PostSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().nonempty("Title is required."),
  slug: z
    .string()
    .nonempty("Slug is required.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Slug can only contain alphanumeric characters, dashes, and underscores.",
    ),
  excerpt: z.string().optional().nullable(),
  content: z.string(),
  contentHtml: z.string(),
  coverImageUrl: z.string().optional().nullable(),
  status: z.enum(POST_STATUS).default("draft"),
  visibility: z.enum(POST_VISIBILITY).default("public"),
  publishedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export type PostSchema = z.infer<typeof PostSchema>;
