const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require("ajv-errors")(ajv);

function validateSchema(schema, data){
  var validate = ajv.compile(schema);
  const isValid = validate(data)
  if(isValid === false ){
    return {
      isValid,
      errors: validate.errors.map(err => err.message)
    }; 
  }
  return {isValid, errors: []}
}

module.exports = validateSchema