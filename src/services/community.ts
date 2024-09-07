
import { communitySchema } from '@/schemas/communitySchema'
import { postSchema } from '@/schemas/postSchema'
import axios from 'axios'
import { z } from 'zod'

export const createCommunity = (values: z.infer<typeof communitySchema>) => {
    return axios.post('/api/community', values, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const createPost = (data: z.infer<typeof postSchema>) => {
    return axios.post('/api/post', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}


export const getCommunity = (cid: string) => {
    return axios.get(`/api/community/${cid}`)
}


export const joinCommunity = (cid: string) => {
    return axios.post('/api/community/join', { communityId: cid })
}



