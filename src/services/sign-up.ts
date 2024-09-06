import { signUpSchema } from '@/schemas/signUpSchema'
import axios from 'axios'
import {z} from 'zod'


export const signup = (values : z.infer<typeof signUpSchema>) => {
    return axios.post('/api/sign-up', values)
}
