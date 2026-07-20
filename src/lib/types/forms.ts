export interface IFormField {
    name: string
    label: string
    type?: 'text' | 'textarea' | 'email' | 'password'
    placeholder?: string
    required?: boolean
}

export interface IFormProps {
    fields: IFormField[]
    submitText?: string
    onSubmit: (data: Record<string, string>) => Promise<void>
}