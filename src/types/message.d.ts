export interface MessageInterface {
  _id?: string
  content: string
  date: Date | null
  senderId: string
  receiverId: string
}