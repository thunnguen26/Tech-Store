export interface IUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

export interface IUserAddress {
  id: string
  userId: string
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  ward: string
  isDefault: boolean
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IRegisterData extends ILoginCredentials {
  name: string
  confirmPassword: string
}
