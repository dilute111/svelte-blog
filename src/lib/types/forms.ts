export interface IFormField {
    name: string
    label: string
    type?: 'text' | 'textarea' | 'email' | 'password'
    placeholder?: string
    required?: boolean
}

export interface IFormSubmitResult {
    success: boolean;
    error?: string;
    message?: string;
}


export interface IFormProps {
    fields: IFormField[]
    submitText?: string
    endpoint: string
    onSubmit: (data: Record<string, string>, result?: IFormSubmitResult) => Promise<void> | void
}