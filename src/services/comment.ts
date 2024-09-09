
import { commentSchema } from '@/schemas/commentSchema'
import axios from 'axios'
import {z} from 'zod'


export const comment = (values : z.infer<typeof commentSchema>) => {
    return axios.post('/api/comment', values)
}
