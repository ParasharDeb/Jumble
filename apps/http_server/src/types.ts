import z from "zod"
export const SignupSchema=z.object({
    username:z.string().max(50),
    password:z.string(),
    email:z.email(),
    resume:z.string()
})
export const SinginSchema=z.object({
    email:z.email(),
    password:z.string()
})
export const updatePasswordSchema=z.object({
    oldpassword:z.string(),
    newpassword:z.string()
})