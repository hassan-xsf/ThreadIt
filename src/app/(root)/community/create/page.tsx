'use client'

import React, { useState } from 'react'
import { X, Upload, Users } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const schema = z.object({
    communityName: z.string().min(3, { message: "Community name must be at least 3 characters long" } , ).max(15, { message: "Community name must not be greater than 15" } , ),
    bannerImage: z.any().optional(),
    profileImage: z.any().optional(),
})

type FormData = z.infer<typeof schema>

export default function page() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true)
    const [bannerImage, setBannerImage] = useState<string | null>(null)
    const [profileImage, setProfileImage] = useState<string | null>(null)

    const { control, handleSubmit, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            communityName: '',
        },
    })

    const communityName = watch('communityName')

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'profile') => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (type === 'banner') {
                    setBannerImage(reader.result as string)
                } else {
                    setProfileImage(reader.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }
    const closeModal = () => {
        if(isOpen) {
            setIsOpen(false)
            router.back();
        }
    }
    const onSubmit = (data: FormData) => {
        console.log('Form Data:', data)
        console.log('Banner Image:', bannerImage)
        console.log('Profile Image:', profileImage)
        // setIsOpen(false)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center  justify-center z-50">
            <div className="bg-white dark:bg-primary-black shadow-xl w-full rounded-xl max-w-4xl overflow-hidden flex">
                <div className="flex-1 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Community</h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="communityName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Community Name
                            </label>
                            <Controller
                                name="communityName"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <div>
                                        <input
                                            {...field}
                                            type="text"
                                            id="communityName"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-primary-black dark:border-gray-600 dark:text-white"
                                            placeholder="Enter community name"
                                            maxLength={15}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <ImageUploadBox
                                type="banner"
                                image={bannerImage}
                                onUpload={(e) => handleImageUpload(e, 'banner')}
                            />
                            <ImageUploadBox
                                type="profile"
                                image={profileImage}
                                onUpload={(e) => handleImageUpload(e, 'profile')}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Create Community
                            </button>
                        </div>
                    </form>
                </div>
                <div className="w-80 bg-gray-100 dark:bg-primary-black p-6 border-l border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                    <div className="bg-white dark:bg-primary-black rounded-lg shadow overflow-hidden">
                        <div className="h-24 bg-blue-500 relative">
                            {bannerImage && (
                                <img src={bannerImage} alt="Community banner" className="w-full h-full object-contain" />
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-primary-black overflow-hidden border-4 border-white dark:border-gray-800">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Community profile" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Users size={32} className="text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {communityName || 'Community Name'}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">r/{communityName.toLowerCase().replace(/\s+/g, '') || 'communityname'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ImageUploadBoxProps {
    type: 'banner' | 'profile'
    image: string | null
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function ImageUploadBox({ type, image, onUpload }: ImageUploadBoxProps) {
    return (
        <div>
            <label htmlFor={`${type}Upload`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {type === 'banner' ? 'Banner Image (Optional)' : 'Profile Image (Optional)'}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor={`${type}Upload`}
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                            <span className = "dark:bg-primary-black block">Upload a file</span>
                            <input id={`${type}Upload`} name={`${type}Upload`} type="file" className="sr-only" onChange={onUpload} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
        </div>
    )
}