/**
 * 表单验证工具函数
 */

/**
 * 验证规则类型
 */
export type ValidationRule = {
  /** 验证器函数 */
  validator: (value: any, formData?: Record<string, any>) => boolean;
  /** 错误消息 */
  message: string;
  /** 是否为必填项 */
  required?: boolean;
};

/**
 * 表单字段验证规则
 */
export type FormRules = Record<string, ValidationRule | ValidationRule[]>;

/**
 * 验证结果类型
 */
export type ValidationResult = {
  /** 是否验证通过 */
  valid: boolean;
  /** 错误信息 */
  errors: Record<string, string[]>;
};

/**
 * 表单验证器
 * @param data 表单数据
 * @param rules 验证规则
 * @returns 验证结果
 * @example
 * const validator = formValidator(
 *   { name: '张三', age: 17, email: 'invalid-email' },
 *   {
 *     name: { validator: (v) => v.length >= 2, message: '姓名至少2个字符', required: true },
 *     age: [
 *       { validator: (v) => v >= 18, message: '年龄必须大于等于18岁' },
 *       { validator: (v) => v <= 100, message: '年龄必须小于等于100岁' }
 *     ],
 *     email: { validator: (v) => /^.+@.+\..+$/.test(v), message: '邮箱格式不正确' }
 *   }
 * );
 * 
 * console.log(validator.validate());
 * // { valid: false, errors: { age: ['年龄必须大于等于18岁'], email: ['邮箱格式不正确'] } }
 */
export function formValidator(data: Record<string, any>, rules: FormRules) {
  /**
   * 验证表单
   * @returns 验证结果
   */
  function validate(): ValidationResult {
    const errors: Record<string, string[]> = {};
    let valid = true;
    
    // 遍历所有规则
    for (const field in rules) {
      const fieldRules = Array.isArray(rules[field]) ? rules[field] as ValidationRule[] : [rules[field]] as ValidationRule[];
      const fieldErrors: string[] = [];
      
      // 获取字段值
      const value = data[field];
      
      // 检查必填项
      const isRequired = fieldRules.some(rule => rule.required);
      const isEmpty = value === undefined || value === null || value === '';
      
      if (isRequired && isEmpty) {
        fieldErrors.push('此字段为必填项');
        errors[field] = fieldErrors;
        valid = false;
        continue;
      }
      
      // 跳过空值的非必填项验证
      if (isEmpty && !isRequired) {
        continue;
      }
      
      // 应用所有验证规则
      for (const rule of fieldRules) {
        const isValid = rule.validator(value, data);
        
        if (!isValid) {
          fieldErrors.push(rule.message);
        }
      }
      
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        valid = false;
      }
    }
    
    return { valid, errors };
  }
  
  /**
   * 验证特定字段
   * @param field 字段名
   * @returns 验证结果
   */
  function validateField(field: string): { valid: boolean; errors: string[] } {
    if (!rules[field]) {
      return { valid: true, errors: [] };
    }
    
    const fieldRules = Array.isArray(rules[field]) ? rules[field] as ValidationRule[] : [rules[field]] as ValidationRule[];
    const fieldErrors: string[] = [];
    
    // 获取字段值
    const value = data[field];
    
    // 检查必填项
    const isRequired = fieldRules.some(rule => rule.required);
    const isEmpty = value === undefined || value === null || value === '';
    
    if (isRequired && isEmpty) {
      fieldErrors.push('此字段为必填项');
      return { valid: false, errors: fieldErrors };
    }
    
    // 跳过空值的非必填项验证
    if (isEmpty && !isRequired) {
      return { valid: true, errors: [] };
    }
    
    // 应用所有验证规则
    for (const rule of fieldRules) {
      const isValid = rule.validator(value, data);
      
      if (!isValid) {
        fieldErrors.push(rule.message);
      }
    }
    
    return {
      valid: fieldErrors.length === 0,
      errors: fieldErrors
    };
  }
  
  return {
    validate,
    validateField
  };
}

/**
 * 常用验证规则
 */
export const validators = {
  /**
   * 必填项验证
   * @param message 错误消息
   * @returns 验证规则
   */
  required(message = '此字段为必填项'): ValidationRule {
    return {
      validator: (value) => {
        if (value === undefined || value === null) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      },
      message,
      required: true
    };
  },
  
  /**
   * 最小长度验证
   * @param min 最小长度
   * @param message 错误消息
   * @returns 验证规则
   */
  minLength(min: number, message = `长度不能少于${min}个字符`): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return false;
        return String(value).length >= min;
      },
      message
    };
  },
  
  /**
   * 最大长度验证
   * @param max 最大长度
   * @param message 错误消息
   * @returns 验证规则
   */
  maxLength(max: number, message = `长度不能超过${max}个字符`): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return true;
        return String(value).length <= max;
      },
      message
    };
  },
  
  /**
   * 长度范围验证
   * @param min 最小长度
   * @param max 最大长度
   * @param message 错误消息
   * @returns 验证规则
   */
  length(min: number, max: number, message = `长度必须在${min}-${max}个字符之间`): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return false;
        const length = String(value).length;
        return length >= min && length <= max;
      },
      message
    };
  },
  
  /**
   * 最小值验证
   * @param min 最小值
   * @param message 错误消息
   * @returns 验证规则
   */
  min(min: number, message = `不能小于${min}`): ValidationRule {
    return {
      validator: (value) => {
        if (value === undefined || value === null || value === '') return true;
        return Number(value) >= min;
      },
      message
    };
  },
  
  /**
   * 最大值验证
   * @param max 最大值
   * @param message 错误消息
   * @returns 验证规则
   */
  max(max: number, message = `不能大于${max}`): ValidationRule {
    return {
      validator: (value) => {
        if (value === undefined || value === null || value === '') return true;
        return Number(value) <= max;
      },
      message
    };
  },
  
  /**
   * 数值范围验证
   * @param min 最小值
   * @param max 最大值
   * @param message 错误消息
   * @returns 验证规则
   */
  range(min: number, max: number, message = `必须在${min}-${max}之间`): ValidationRule {
    return {
      validator: (value) => {
        if (value === undefined || value === null || value === '') return true;
        const num = Number(value);
        return num >= min && num <= max;
      },
      message
    };
  },
  
  /**
   * 邮箱验证
   * @param message 错误消息
   * @returns 验证规则
   */
  email(message = '邮箱格式不正确'): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return true;
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message
    };
  },
  
  /**
   * 手机号验证
   * @param message 错误消息
   * @returns 验证规则
   */
  phone(message = '手机号格式不正确'): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return true;
        return /^1[3-9]\d{9}$/.test(value);
      },
      message
    };
  },
  
  /**
   * URL验证
   * @param message 错误消息
   * @returns 验证规则
   */
  url(message = 'URL格式不正确'): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message
    };
  },
  
  /**
   * 正则表达式验证
   * @param pattern 正则表达式
   * @param message 错误消息
   * @returns 验证规则
   */
  pattern(pattern: RegExp, message = '格式不正确'): ValidationRule {
    return {
      validator: (value) => {
        if (!value) return true;
        return pattern.test(value);
      },
      message
    };
  },
  
  /**
   * 自定义验证
   * @param validator 验证函数
   * @param message 错误消息
   * @returns 验证规则
   */
  custom(validator: (value: any, formData?: Record<string, any>) => boolean, message = '验证失败'): ValidationRule {
    return {
      validator,
      message
    };
  },
  
  /**
   * 两字段值相等验证
   * @param field 比较字段
   * @param message 错误消息
   * @returns 验证规则
   */
  equals(field: string, message = '两次输入不一致'): ValidationRule {
    return {
      validator: (value, formData) => {
        if (!formData) return true;
        return value === formData[field];
      },
      message
    };
  }
}; 