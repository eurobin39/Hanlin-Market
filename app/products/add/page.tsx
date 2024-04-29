"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [imageId, setImageId] = useState("");
    const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { files } } = event;
        if (!files) {
            return;
        }
        const file = files[0];

        /* // 파일 크기 확인 (2MB 이하)
        if (file.size > 2 * 1024 * 1024) {
            alert('The file size should be 2MB or less.');
            return;
        }
        */

        // 파일이 이미지이고, 크기가 2MB 이하인 경우 미리보기 설정

        const url = URL.createObjectURL(file);
        setPreview(url);
        const { success, result } = await getUploadUrl();
        if (success) {
            const { id, uploadURL } = result;
            setUploadUrl(uploadURL);
            setImageId(id);
        }

    };


    const interceptAction = async (_: any, formData: FormData) => {
        const file = formData.get("photo");
        if (!file) {
            return;
        }
        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: cloudflareForm,
        });

        if (response.status !== 200) {
            alert('Something Goes Wrong!');
            return;
        }
        const photoUrl = `https://imagedelivery.net/OQw6SyHmncm3MEfwgepYnw/${imageId}`
        formData.set("photo", photoUrl);
        return uploadProduct(_, formData);
    };

    const [state, action] = useFormState(interceptAction, null);

    return (
        <div>
            <form action={action} className="flex flex-col gap-5">
                <label htmlFor="photo" className="border-2 aspect-square flex items-center justify-center flex-col
    text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer "
                    style={{ backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {preview === "" ? <>
                        <PhotoIcon className="w-20" />
                        <div className="text-neutral-400 text-sm">
                            Add Photo
                            {state?.fieldErrors.photo}
                        </div>
                    </> : null}
                </label>

                <input onChange={onImageChange} type="file" id="photo" name="photo" accept="image/*" className="hidden" />
                <Input name="title" required placeholder="Title" type="text" errors={state?.fieldErrors.title} />
                <Input name="price" required placeholder="Price" type="number" errors={state?.fieldErrors.price} />
                <Input name="description" required placeholder="Description" type="text" errors={state?.fieldErrors.description} />
                <Button text="Upload" />
            </form>
        </div>
    )
}