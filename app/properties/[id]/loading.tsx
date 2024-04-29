import { PhotoIcon } from "@heroicons/react/20/solid";

export default function Loading() {
    return (
        <div className="animate-pulse p-5 flex flex-col gap-5">
            <div className="aspect-square text-neutral-700 border-neutral-700 border-4 border-dashed
            rounded-md flex justify-center items-center">
                <PhotoIcon className="h-28" />
            </div>
            <div>

            </div>
            <div>

            </div>
        </div>
    )
}