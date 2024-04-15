"use client";

import { useRouter } from "next/navigation";
import deleteProductAction from "./delete.actions";

type Props = {
  productId: number;
};

export default function ProductDeleteButton({ productId }: Props) {
  const router = useRouter();
  async function handleDelete() {
    const res = await deleteProductAction(productId);

    if (res) {
      alert("삭제되었습니다");
      router.replace("/home");
    } else {
      alert("실패했습니다");
    }
  }

  return (
    <button
      className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white"
      onClick={handleDelete}
    >
      Delete product
    </button>
  );
}