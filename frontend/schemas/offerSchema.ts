import Ajv from "ajv"

export interface Offer {
  //[x: string]: any
  id: string
  title: string
  description: string
  price: string // e.g. "19.99"
  discountPercentage: string // e.g. "10"
  promotionalTags: string | string[] ;
  product: string
  personasId: number ;
  displayConfigureId: number
  repeatPatterns: "none" | "daily" | "weekly" | "monthly"
  repeatDetails: string[]
  //createdBy: string
  //updatedBy: string
  //isDeleted?: boolean
  startDateUTC: string 
  endDateUTC: string 
 // createdAt: string
  //updatedAt: string
}

export const offersSchema = {
  //$id: "Offers",
  //type: "object",
  additionalProperties: true,
  required: [
    "title", "description", "price", "discountPercentage",
    "promotionalTags", "product", "personasId", "displayConfigureId",
    "repeatPatterns", "repeatDetails",
    "startDateUTC", "endDateUTC"
  ],
  properties: {
    id: { type: "string", minLength: 1 }, // ✅ added
    title: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    price: { type: "string", pattern: "^[0-9]+(\\.[0-9]{1,2})?$" },
    discountPercentage: { type: "string", pattern: "^[0-9]{1,3}$" },
    promotionalTags: {
      type: "array",
      items: { type: "string", minLength: 1 },
      minItems: 1
    },
    product: { type: "string", minLength: 1 },
    personasId: { type: "number", minimum: 1 },
    displayConfigureId: { type: "number", minimum: 1 },
    repeatPatterns: { type: "string", enum: ["none", "daily", "weekly", "monthly"] },
    repeatDetails: {
      type: "array",
      items: {
        type: "string", enum: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday","null","january","february","march","april","may","june","july","august","september","october","november","december"] 
      },
      minItems: 0
    },
    //isDeleted: { type: "boolean", nullable: true },
    startDateUTC: { type: "string", format: "date-time" },
    endDateUTC: { type: "string", format: "date-time" },
  }
}
