import z from "zod"
export const SignupSchema=z.object({
    username:z.string().max(50),
    password:z.string(),
    email:z.email(),
    resume:z.string().optional(),
    phoneNumber:z.string().optional(),
    location:z.string().optional(),
    linkedIn:z.string().optional(),
    github:z.string().optional(),
    consent:z.boolean().default(false)
})
export const SinginSchema=z.object({
    email:z.email(),
    password:z.string()
})
export const updatePasswordSchema=z.object({
    oldpassword:z.string(),
    newpassword:z.string()
})

// Type for external job data from arbeitnow.com API
export interface ExternalJob {
  title: string;
  company_name: string;
  location: string;
  remote: boolean;
  url: string;
  tags: string[];
  created_at: string;
}

export interface FormattedJob {
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  applyUrl: string;
  tags: string[];
  datePosted: string;
}