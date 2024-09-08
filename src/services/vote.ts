
import { voteSchema } from '@/schemas/voteSchema'
import axios from 'axios'
import {z} from 'zod'


export const vote = (values : z.infer<typeof voteSchema>) => {
    return axios.post('/api/vote', values)
}
