"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect } from "react";
import {  getUploadUrl, updateProfile } from "./actions";
import { useFormState } from "react-dom";
import getSession from "@/lib/session";
import { getUser } from "@/app/(tabs)/profile/page";

export default function updatePersonalInfo() {
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
        return updateProfile(_, formData);
    };

    const [state, action] = useFormState(interceptAction, null);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <form action={action} className="space-y-6 bg-transparent p-6 rounded-lg shadow">
                <div className="border-2 aspect-square w-full flex items-center justify-center flex-col
                text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer relative overflow-hidden">
                    <input onChange={onImageChange} type="file" id="photo" name="photo" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {preview ? (
                        <img src={preview} alt="Profile" className="object-cover w-full h-full" />
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <PhotoIcon className="w-12 h-12 text-neutral-400" />
                            <span>Add Photo</span>
                        </div>
                    )}
                </div>

                <Input name="username" required placeholder="Username" type="text" errors={state?.fieldErrors.username} />
                <Input name="password" required type="password" placeholder="New Password (optional)" errors={state?.fieldErrors.password} />
                <Input name="confirmPassword" required type="password" placeholder="Confirm New Password (optional)" errors={state?.fieldErrors.confirmPassword} />
                <Button text="Update Profile" />
            </form>
        </div>
    )
}