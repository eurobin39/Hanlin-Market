import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getIsLiked(productId: number) {
    const session = await getSession();
    const like = await db.like.findUnique({
      where: {
        id: {
          productId,
          userId: session.id!,
        },
      },
    });
    return Boolean(like);
  }

export async function getIsHomeSaved(homeId: number){
  const session = await getSession();
  const saved = await db.saved.findUnique({
    where: {
      id: {
        homeId,
        userId: session.id!,
      },
    },
  });
  return Boolean(saved);

}