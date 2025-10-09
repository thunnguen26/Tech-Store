import type { IUser, IUserAddress } from "@/types/user.types"

export class User implements IUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string

  constructor(data: IUser) {
    this.id = data.id
    this.email = data.email
    this.name = data.name
    this.phone = data.phone
    this.avatar = data.avatar
  }

  getDisplayName(): string {
    return this.name || this.email.split("@")[0]
  }

  getInitials(): string {
    return this.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  hasPhone(): boolean {
    return !!this.phone
  }
}

export class UserAddress implements IUserAddress {
  id: string
  userId: string
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  ward: string
  isDefault: boolean

  constructor(data: IUserAddress) {
    this.id = data.id
    this.userId = data.userId
    this.fullName = data.fullName
    this.phone = data.phone
    this.address = data.address
    this.city = data.city
    this.district = data.district
    this.ward = data.ward
    this.isDefault = data.isDefault
  }

  getFullAddress(): string {
    return `${this.address}, ${this.ward}, ${this.district}, ${this.city}`
  }
}
