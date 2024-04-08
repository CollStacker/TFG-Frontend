import { type CategoryInterface }  from "./category.d";
import { type ProductInterface } from "./product";
import { type UserInterface } from "./user";
import { type CollectionInterface }  from "./collection";
import { type FriendInterface } from "./friend";
import { type ProducFieldInterface }  from "./product-field";
import { type MessageInterface } from "./message";

export const Category: CategoryInterface = {
  name: "",
  description: "",
  collectionId: "",
  parentId: "",
}

export const Product: ProductInterface = {
  name: "",
  description: "",
  collectionId: "",
  brand: "",
  image: "",
  releaseYear: ""
}

export const User: UserInterface = {
  username: "",
  email: "",
  name: "",
  surnames: "",
  profilePhoto: "",
  biography: "",
}

export const Collection: CollectionInterface = {
  title: "",
  description: "", 
  tag: "",
  frontPage: "", 
  ownerId: "",
}

export const Friend: FriendInterface = {
  userId: "",
  friends: null,
  friendRequestList:null
}

export const ProductField: ProducFieldInterface = {
  key: "",
  value: "",
  type: "",
  productId: "",
}

export const Message: MessageInterface = {
  content: "",
  date: null,
  senderId: "",
  receiverId: "",
}