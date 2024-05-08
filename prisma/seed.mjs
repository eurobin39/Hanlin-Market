// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    "디지털기기", "가구/인테리어", "유아동", "여성의류", "여성잡화",
    "남성패션/잡화", "생활가전", "생활/주방", "가공식품", "스포츠/레저",
    "취미/게임", "뷰티/미용", "식물", "티켓/교환권", "도서", "기타중고물품"
  ];

  await prisma.category.createMany({
    data: categories.map(name => ({ name })),
    skipDuplicates: true // 중복된 데이터는 건너뜁니다.
  });

  const postCategories = [
    "질문", "운동", "모임", "맛집", "생활"
  ]
   

  await prisma.postCategory.createMany({
    data: postCategories.map(name => ({ name })),
    skipDuplicates: true // 중복된 데이터는 건너뜁니다.
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
