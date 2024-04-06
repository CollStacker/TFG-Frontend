export interface FriendInterface {
  _id?: string
  userId: string
  friends?: string[] | null 
  friendRequestList?: string[] | null
}