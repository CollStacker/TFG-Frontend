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