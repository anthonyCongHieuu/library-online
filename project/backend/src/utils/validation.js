const Joi = require('joi');

// Validation cho đăng ký
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.max': 'Tên không được vượt quá 50 ký tự',
        'any.required': 'Tên là bắt buộc'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Mật khẩu là bắt buộc'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Mật khẩu xác nhận không khớp',
        'any.required': 'Xác nhận mật khẩu là bắt buộc'
      })
  });

  return schema.validate(data);
};

// Validation cho đăng nhập
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Mật khẩu là bắt buộc'
      })
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation
};