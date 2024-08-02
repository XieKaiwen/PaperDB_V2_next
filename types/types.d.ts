declare interface AuthFormProps {
    type: 'sign-up' | 'login'
}

declare interface LoginProps {
    email: string
    password: string
    redirectedFrom?: string
}

declare interface SignUpProps{
    email: string
    password: string
    confirmPassword: string
    phoneNumber: string
    username: string
    educationLevel: string
    redirectedFrom?: string 
}