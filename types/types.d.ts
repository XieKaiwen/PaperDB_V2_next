declare interface AuthFormProps {
    type: 'sign-up' | 'login'
}

declare interface LoginProps {
    email: string
    password: string
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

declare type ParsedMapObject = {
    [key: string]: string | boolean;
};

declare interface signUpUserMetadataProps{
    email: string
    educationLevel: string
    email_verified: boolean
    phoneNumber: string
    phone_verified: boolean
    sub: string
    username: string
}