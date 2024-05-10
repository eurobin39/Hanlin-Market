"use client";

import React, { forwardRef, useState } from "react";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/20/solid";
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS file to apply default styling
import { CalendarIcon } from "@heroicons/react/20/solid"; // Assuming you have a CalendarIcon
import DatePicker from 'react-datepicker';
import { getUploadUrls, uploadProperties } from "./actions";

export default function AddMultipleProducts() {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadUrls, setUploadUrls] = useState<string[]>([]);
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [contractStart, setContractStart] = useState<Date | null>(null);
    const [contractEnd, setContractEnd] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);  // State to manage loading during upload

    const onImagesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { files } } = event;
        if (!files) return;

        const newFiles = Array.from(files);
        const validNewFiles = newFiles.slice(0, 4 - selectedFiles.length);
        if (validNewFiles.length === 0) return;

        const newPreviews = validNewFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        setSelectedFiles(prev => [...prev, ...validNewFiles]);

        const uploadData = await getUploadUrls(validNewFiles.length);
        if (uploadData.success) {
            setUploadUrls(prev => [...prev, ...uploadData.results.map(r => r.uploadURL)]);
            setImageIds(prev => [...prev, ...uploadData.results.map(r => r.id)]);
        }
    };

    interface CustomInputProps {
        value?: string;
        onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    }

    const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
        <button className="date-picker-input" onClick={onClick} ref={ref}>
            <CalendarIcon className="inline-block w-5 h-5 text-neutral-700 mr-2" />
            {value || "Choose Date"}
        </button>
    ));

    CustomInput.displayName = "CustomInput"; 

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);  // Start loading before the operation

        const photoUrls = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const uploadUrl = uploadUrls[i];
            if (!uploadUrl) {
                console.error(`No upload URL for file ${i + 1}`);
                continue;
            }

            const cloudflareForm = new FormData();
            cloudflareForm.append("file", file);

            try {
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: cloudflareForm,
                });

                if (!response.ok) throw new Error(`Upload failed: ${await response.text()}`);
                const photoUrl = `https://imagedelivery.net/OQw6SyHmncm3MEfwgepYnw/${imageIds[i]}`;
                photoUrls.push(photoUrl);
            } catch (error) {
                console.error("Upload error:", error);
            }
        }

        if (photoUrls.length > 0) {
            const formData = new FormData();
            formData.append("photoUrls", JSON.stringify(photoUrls));
            formData.append("title", title);
            formData.append("price", price);
            formData.append("location", location);
            formData.append("contractStart", contractStart?.toISOString() ?? "");
            formData.append("contractEnd", contractEnd?.toISOString() ?? "");
            formData.append("description", description);
            await uploadProperties(null, formData);  // Ensure uploadProperties is awaited
        }

        setLoading(false);  // End loading after the operation is complete
    };

    return (
        <div>
            <form onSubmit={handleUpload} className="pt-10 flex flex-col gap-5">
                <div className="flex gap-2">
                    {previews.map((preview, index) => (
                        <div key={index} className="border-2 aspect-square w-24 h-24 flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
                            style={{ backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                    ))}
                    {previews.length < 4 && (
                        <label htmlFor="photos" className="border-2 aspect-square w-24 h-24 flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer">
                            <PhotoIcon className="w-6 h-6" />
                            <div className="text-neutral-400 text-sm">Add Photos</div>
                        </label>
                    )}
                </div>
                <input onChange={onImagesChange} type="file" id="photos" name="photos" accept="image/*" className="hidden" />
                <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" type="text" />
                <Input name="price" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="Price/Month" type="number" />
                <Input name="location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Location" type="text" />
                <div className="ml-48 flex items-center gap-3">
                    <div>
                        <label htmlFor="contractStart" className="block text-sm font-medium text-neutral-700">Contract Start Date</label>
                        <DatePicker
                            selected={contractStart}
                            onChange={setContractStart}
                            customInput={<CustomInput />}
                        />
                    </div>
                    <div>
                        <label htmlFor="contractEnd" className="block text-sm font-medium text-neutral-700">Contract End Date</label>
                        <DatePicker
                            selected={contractEnd}
                            onChange={setContractEnd}
                            customInput={<CustomInput />}
                        />
                    </div>
                </div>
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-transparent rounded-md w-full h-48 focus:outline-none
               ring-1 focus:ring-2 ring-neutral-200 focus:ring-emerald-500 border-none
               placeholder:text-neutral-400 pl-3 resize-none" // Added resize-none to disable resizing
                    placeholder="Description"
                    style={{ paddingTop: '10px', textAlign: 'start', verticalAlign: 'top' }} // Styles to start text from top
                />
                <Button text={loading ? "Loading..." : "Upload"} disabled={loading} />
            </form>
        </div>
    );
}
