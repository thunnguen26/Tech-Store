import { User } from "@/models/User.model"
import type { ILoginCredentials, IRegisterData, IUser } from "@/types/user.types"

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  private constructor() {
    this.loadUserFromStorage()
  }

  // Singleton pattern
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Storage operations
  private loadUserFromStorage(): void {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("user")
    if (stored) {
      const userData: IUser = JSON.parse(stored)
      this.currentUser = new User(userData)
    }
  }

  private saveUserToStorage(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem("user", JSON.stringify(user))
  }

  private removeUserFromStorage(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("user")
  }

  // Auth operations (mock implementation)
  async login(credentials: ILoginCredentials): Promise<User> {
    // Mock login - in real app, this would call API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: IUser = {
      id: "1",
      email: credentials.email,
      name: "Người dùng",
      phone: "0123456789",
    }

    this.currentUser = new User(mockUser)
    this.saveUserToStorage(this.currentUser)
    return this.currentUser
  }

  async register(data: IRegisterData): Promise<User> {
    // Mock register - in real app, this would call API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: IUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
    }

    this.currentUser = new User(mockUser)
    this.saveUserToStorage(this.currentUser)
    return this.currentUser
  }

  logout(): void {
    this.currentUser = null
    this.removeUserFromStorage()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }
}
