
import { type PostResponse } from '@/types/PostResponse'
import axios, { AxiosResponse } from 'axios'


type AllPostResponse = {
    nextPage: boolean,
    data: PostResponse[]
}

export const allPosts = ({ feed, skip, take }: { feed: string, skip: number, take: number }) : Promise<AxiosResponse<AllPostResponse>> => {
    return axios.get(`/api/allposts?feed=${feed}&skip=${skip}&take=${take}`)
}
