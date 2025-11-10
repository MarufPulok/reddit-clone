import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f(["image"])
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async () => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
