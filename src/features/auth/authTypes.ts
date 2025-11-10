export interface ILoginData {
    email: string;
    password: string;
}

export interface IRegisterData extends ILoginData {
    role: 'candidate' | 'recruiter';
}