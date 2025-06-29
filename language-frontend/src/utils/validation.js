export const isValidEmail = (email) =>
  /^\S+@\S+\.\S+$/.test(email);

export const isValidPhone = (phone) =>
  /^\+?[0-9]{7,15}$/.test(phone);

export const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

export const validateField = (fieldName, value, allValues = {}) => {
  let error = "";
  switch (fieldName) {
    case "name":
      if (!value.trim()) error = "Full name is required";
      break;
    case "email":
      if (!value.trim()) error = "Email is required";
      else if (!isValidEmail(value)) error = "Invalid email address";
      break;
    case "phone":
      if (!value.trim()) error = "Phone number is required";
      else if (!isValidPhone(value)) error = "Invalid phone number";
      break;
    case "username":
      if (!value.trim()) error = "Username is required";
      break;
    case "password":
      if (!value) error = "Password is required";
      else if (value.length < 8) error = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(value)) error = "Must contain at least one uppercase letter";
      else if (!/[a-z]/.test(value)) error = "Must contain at least one lowercase letter";
      else if (!/[0-9]/.test(value)) error = "Must contain at least one number";
      break;
    case "confirmPassword":
    case "password_confirmation":
      if (!value) error = "Please confirm your password";
      else if (value !== allValues.password) error = "Passwords do not match";
      break;
    default:
      break;
  }
  return error;
};