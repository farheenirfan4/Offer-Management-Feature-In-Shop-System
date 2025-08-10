import Ajv from "ajv"
import addFormats from "ajv-formats"
import { offersSchema, Offer } from "../../schemas/offerSchema"

const ajv = new Ajv({ allErrors: true })
addFormats(ajv) // adds "date-time", "email", etc.

const validateOffer = ajv.compile(offersSchema)

const sample: Offer = {
  id: "0058954e-c3af-421c-806e-01274f00f780",
  title: "Special Discount",
  description: "50% off",
  price: "19.99",
  discountPercentage: "50",
  promotionalTags: ["hot", "sale"],
  product: "Product 123",
  personasId: 1,
  displayConfigureId: "abc123",
  repeatPatterns: "none",
  repeatDetails: [],
  createdBy: "admin",
  updatedBy: "admin",
  startDateUTC: new Date().toISOString(),
  endDateUTC: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

if (!validateOffer(sample)) {
  console.log(validateOffer.errors)
} else {
  console.log("✅ Valid offer")
}
