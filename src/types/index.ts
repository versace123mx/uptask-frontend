import { z } from 'zod'

//El schema es de zod y se pueden poner validaciones para los tipos de datos etc
/**Auth & Users */
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string(),
    current_password: z.string()
})

/**
 * Para no volver a reescribir la interface y tengamos la misma definicion que tiene zod, con infer
 * le decimos a typescript que infiera estos tipos de zod, es como hacer un extend de zod a typescript
 */
type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'email' | 'password' | 'name' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth,'password'>

/**Users, se expande el schema principal para agregarle el _id */

export const userSchema = authSchema.pick({
    name:true,
    email:true
}).extend({
    _id: z.string()
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User,'name' | 'email'>

/**Notes */
const noteSchema = z.object({
    _id: z.string(),
    content:z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})

export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note,'content'>



/** Task **/
export const taskStatusSchema = z.enum(["inProgress", "pending", "onHold", "underReview", "completed"])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskShema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    createdAt:z.string(),
    updatedAt:z.string(),
    completeBy: z.array(z.object({
        _id: z.string(),
        user:userSchema,
        status: taskStatusSchema
    })),
    notes:z.array(
        noteSchema.extend({
            createdBy:userSchema
        })
    )
})

export const taskProjectSchema = taskShema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskShema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>



/** Projects **/
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientenName: z.string(),
    description: z.string(),
    manger: z.string(),
    task: z.array(taskProjectSchema),
    team: z.array(z.string())
})

//la respuesta del API es un array y no un objeto como projectSchema a un que trae sus datos como projectSchema pero devuelve un array de objetos por eso se crea un nuevo schema
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientenName: true,
        description: true,
        manger:true
    })
)

export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientenName: true,
    description: true,
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'clientenName' | 'description' | 'projectName'>


/**Team */
//zod
const teamMemberSchema = userSchema.pick({
    name:true,
    email:true,
    _id:true
})
//ts
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>