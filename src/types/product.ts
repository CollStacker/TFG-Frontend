import { type ProducFieldInterface } from "./product-field"

export interface ProductInterface {
  _id?: string
  name: string
  description: string
  image?: string
  publicationDate?: Date
  collectionId: string
}

export interface WholeProductDataInterface {
  _id?: string
  name: string
  description: string
  image?: string
  publicationDate?: Date
  collectionId: string
  customFields?: ProducFieldInterface[]
}

export interface HomeViewProductDataInterface {
  _id: string, // productId
  name: string,
  description: string,
  image?: string,
  publicationDate?: Date,
  ownerId: string,
}