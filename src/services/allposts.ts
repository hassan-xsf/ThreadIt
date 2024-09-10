
import axios from 'axios'


export const allPosts = ({ feed, skip, take }: { feed: string, skip: number, take: number }) => {
    return axios.get(`/api/allposts?feed=${feed}&skip=${skip}&take=${take}`)
}
