// components/SearchComponent.tsx

"use client"

import { useState } from 'react';
import { searchProducts } from '../lib/searchProduct';
import { $Enums } from '@prisma/client';
import Link from 'next/link';
import Input from './input';

type Product = {
    id: number;
    title: string;
    price: number;
    photo: string;
    description: string;
    created_At: Date;
    updated_At: Date;
    userId: number;
    status: $Enums.Status;
    categoryId: number;
};

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        const data = await searchProducts(query);
        setResults(data);
        setLoading(false);
        console.log(data);
    };

    // 키보드 입력을 처리하는 함수
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <div className="sticky top-0 shadow-md z-10">
                <div className="max-w-md mx-auto p-3.5">
                    <div className="flex">
                        <input
                            name='search'
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown} // 이벤트 핸들러 추가
                            className="flex-grow border p-2 bg-transparent rounded-md text-white"
                            placeholder="Searching for..."
                        />
                        <button onClick={handleSearch} className="ml-2 bg-emerald-600 rounded-lg text-white p-2">
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-16">
                <div className="max-w-md mx-auto pt-16 overflow-auto" style={{ maxHeight: '500px' }}>
                    {results.map(product => (
                        <Link href={`/products/${product.id}`} key={product.id} className="p-2 flex border-b justify-first rounded-md bg-neutral-700">
                            <div className="text-lg text-white">{product.title}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
