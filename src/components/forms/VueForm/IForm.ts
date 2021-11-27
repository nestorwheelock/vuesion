export interface IValidationRules {
  required?: boolean; // field value required
  min?: number; // field value needs minimum number of characters
  max?: number; // field value needs maximum number of characters
  email?: boolean; // field value must be in the email format
  integer?: boolean; // field value must be number
  regex?: RegExp; // field value needs to pass custom regex
  custom?: (value: unknown) => boolean; // field value must pass custom validation function
}

export interface IField {
  id: string; // id of the input field
  rules: IValidationRules; // assigned validation ruled
  value: unknown; // field value
  valid: boolean; // field is valid
  changed: boolean; // fields value has changed
  touched: boolean; // field has been focused
  required: boolean; // field is required
  validated: boolean; // has been validated
}
