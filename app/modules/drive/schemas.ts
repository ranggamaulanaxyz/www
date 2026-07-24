import z from "zod";

export const DriveSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().nonempty("Name is required."),
  description: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export type DriveSchema = z.infer<typeof DriveSchema>;

export const DriveItemSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().nonempty("Name is required."),
  driveId: z.string().nonempty("Drive is required"),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export type DriveItemSchema = z.infer<typeof DriveItemSchema>;
