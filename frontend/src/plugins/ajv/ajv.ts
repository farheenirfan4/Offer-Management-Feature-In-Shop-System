// plugins/ajv.ts (or utils/validator.ts)
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // ✅ register formats right away

export default ajv;
