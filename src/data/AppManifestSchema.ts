import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { AppId, PlatformType, RouteKind } from "@/app/types";

const AppIdSchema: z.Schema<AppId, z.ZodTypeDef, string> = z
  .string()
  .min(3)
  .max(16)
  .regex(/^[a-z][a-z0-9]+$/i)
  .transform((value) => value as AppId);

const ProfileUrlSchema = z.object({
  url: z.string().url().includes(":handle"),
});

const PublicationUrlSchema = z.object({
  url: z.string().url().includes(":id"),
});

const PlatformTypeSchema = z.nativeEnum(PlatformType);

const RoutesSchema = z.object({
  [RouteKind.Home]: z.string().url(),
  [RouteKind.Profile]: ProfileUrlSchema.optional(),
  [RouteKind.Publication]: PublicationUrlSchema.optional(),
});

export const AppManifestSchema = z.object({
  appId: AppIdSchema,
  name: z.string().min(3).max(36),
  description: z.string().min(20).max(200),
  platform: PlatformTypeSchema,
  icon: z.string().url(),
  image: z.string().url().optional(),
  routes: RoutesSchema,
});

export type AppManifest = z.infer<typeof AppManifestSchema>;

export const AppManifestJsonSchema = zodToJsonSchema(AppManifestSchema, {
  definitions: { AppIdSchema, ProfileUrlSchema, PublicationUrlSchema },
});
