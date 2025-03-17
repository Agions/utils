/**
 * 数据结构转换工具函数
 */

/**
 * 转换选项类型
 */
export type TransformOptions = {
  /** 是否排除null和undefined值 */
  skipNull?: boolean;
  /** 是否深度转换 */
  deep?: boolean;
  /** 自定义键转换函数 */
  keyConverter?: (key: string) => string;
  /** 自定义值转换函数 */
  valueConverter?: (value: any, key: string) => any;
};

/**
 * 转换对象键为驼峰式命名
 * @param obj 输入对象
 * @param options 转换选项
 * @returns 转换后的对象
 * @example
 * toCamelCase({ user_id: 1, user_name: 'John' });
 * // { userId: 1, userName: 'John' }
 */
export function toCamelCase<T extends object>(obj: T, options: TransformOptions = {}): Record<string, any> {
  const { skipNull = false, deep = true, valueConverter } = options;
  
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (item && typeof item === 'object') {
        return toCamelCase(item, options);
      }
      return item;
    }) as any;
  }
  
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof T];
      
      // 跳过空值
      if (skipNull && (value === null || value === undefined)) {
        continue;
      }
      
      // 转换键名
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      // 递归转换对象和数组
      let newValue = value;
      if (deep && value && typeof value === 'object') {
        newValue = toCamelCase(value, options);
      }
      
      // 应用值转换器
      if (valueConverter) {
        newValue = valueConverter(newValue, camelKey);
      }
      
      result[camelKey] = newValue;
    }
  }
  
  return result;
}

/**
 * 转换对象键为蛇形命名
 * @param obj 输入对象
 * @param options 转换选项
 * @returns 转换后的对象
 * @example
 * toSnakeCase({ userId: 1, userName: 'John' });
 * // { user_id: 1, user_name: 'John' }
 */
export function toSnakeCase<T extends object>(obj: T, options: TransformOptions = {}): Record<string, any> {
  const { skipNull = false, deep = true, valueConverter } = options;
  
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (item && typeof item === 'object') {
        return toSnakeCase(item, options);
      }
      return item;
    }) as any;
  }
  
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof T];
      
      // 跳过空值
      if (skipNull && (value === null || value === undefined)) {
        continue;
      }
      
      // 转换键名
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      // 递归转换对象和数组
      let newValue = value;
      if (deep && value && typeof value === 'object') {
        newValue = toSnakeCase(value, options);
      }
      
      // 应用值转换器
      if (valueConverter) {
        newValue = valueConverter(newValue, snakeKey);
      }
      
      result[snakeKey] = newValue;
    }
  }
  
  return result;
}

/**
 * 转换对象键为短横线命名
 * @param obj 输入对象
 * @param options 转换选项
 * @returns 转换后的对象
 * @example
 * toKebabCase({ userId: 1, userName: 'John' });
 * // { 'user-id': 1, 'user-name': 'John' }
 */
export function toKebabCase<T extends object>(obj: T, options: TransformOptions = {}): Record<string, any> {
  const { skipNull = false, deep = true, valueConverter } = options;
  
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (item && typeof item === 'object') {
        return toKebabCase(item, options);
      }
      return item;
    }) as any;
  }
  
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof T];
      
      // 跳过空值
      if (skipNull && (value === null || value === undefined)) {
        continue;
      }
      
      // 转换键名
      const kebabKey = key
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
      
      // 递归转换对象和数组
      let newValue = value;
      if (deep && value && typeof value === 'object') {
        newValue = toKebabCase(value, options);
      }
      
      // 应用值转换器
      if (valueConverter) {
        newValue = valueConverter(newValue, kebabKey);
      }
      
      result[kebabKey] = newValue;
    }
  }
  
  return result;
}

/**
 * 创建通用转换函数
 * @param keyConverter 键转换函数
 * @returns 转换函数
 * @example
 * const toPascalCase = createTransformer(key => key.replace(/^([a-z])|_([a-z])/g, (_, p1, p2) => (p1 || p2).toUpperCase()));
 * toPascalCase({ user_id: 1 }); // { UserId: 1 }
 */
export function createTransformer(keyConverter: (key: string) => string) {
  return <T extends object>(obj: T, options: TransformOptions = {}): Record<string, any> => {
    const { skipNull = false, deep = true, valueConverter } = options;
    
    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (item && typeof item === 'object') {
          return createTransformer(keyConverter)(item, options);
        }
        return item;
      }) as any;
    }
    
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key as keyof T];
        
        // 跳过空值
        if (skipNull && (value === null || value === undefined)) {
          continue;
        }
        
        // 转换键名
        const newKey = keyConverter(key);
        
        // 递归转换对象和数组
        let newValue = value;
        if (deep && value && typeof value === 'object') {
          newValue = createTransformer(keyConverter)(value, options);
        }
        
        // 应用值转换器
        if (valueConverter) {
          newValue = valueConverter(newValue, newKey);
        }
        
        result[newKey] = newValue;
      }
    }
    
    return result;
  };
}

/**
 * 将数组转换为对象
 * @param array 输入数组
 * @param keyField 作为键的字段名
 * @param valueField 作为值的字段名（如不提供，使用整个项）
 * @returns 转换后的对象
 * @example
 * arrayToObject([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }], 'id');
 * // { '1': { id: 1, name: 'John' }, '2': { id: 2, name: 'Jane' } }
 * 
 * arrayToObject([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }], 'id', 'name');
 * // { '1': 'John', '2': 'Jane' }
 */
export function arrayToObject<T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
  valueField?: keyof T
): Record<string, any> {
  return array.reduce((result, item) => {
    const key = String(item[keyField]);
    const value = valueField ? item[valueField] : item;
    result[key] = value;
    return result;
  }, {} as Record<string, any>);
}

/**
 * 将对象转换为数组
 * @param obj 输入对象
 * @param keyField 存储键的字段名
 * @param valueField 存储值的字段名
 * @returns 转换后的数组
 * @example
 * objectToArray({ '1': 'John', '2': 'Jane' }, 'id', 'name');
 * // [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }]
 */
export function objectToArray<T extends Record<string, any>>(
  obj: T,
  keyField: string = 'key',
  valueField: string = 'value'
): Array<Record<string, any>> {
  return Object.entries(obj).map(([key, value]) => {
    const item: Record<string, any> = {
      [keyField]: key
    };
    
    if (valueField) {
      item[valueField] = value;
    } else {
      // 如果值是对象，展开它
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(item, value);
      } else {
        item.value = value;
      }
    }
    
    return item;
  });
}

/**
 * 将树结构转换为平面数组
 * @param tree 树结构数组
 * @param childrenField 子节点字段名
 * @param parentField 父节点字段名（用于存储父节点ID）
 * @param parentId 当前父节点ID
 * @returns 平面化的数组
 * @example
 * const tree = [{ id: 1, name: 'A', children: [{ id: 2, name: 'B' }] }];
 * flattenTree(tree);
 * // [{ id: 1, name: 'A' }, { id: 2, name: 'B', parentId: 1 }]
 */
export function flattenTree<T extends Record<string, any>>(
  tree: T[],
  childrenField: string = 'children',
  parentField: string = 'parentId',
  parentId: any = null
): Array<Omit<T, 'children'> & Record<string, any>> {
  return tree.reduce((result, node) => {
    // 创建节点副本（不包含子节点）
    const { [childrenField]: children, ...nodeWithoutChildren } = node;
    
    // 添加父节点ID（如果有）
    const newNode = parentId !== null
      ? { ...nodeWithoutChildren, [parentField]: parentId }
      : { ...nodeWithoutChildren };
    
    result.push(newNode as Omit<T, 'children'> & Record<string, any>);
    
    // 递归处理子节点
    if (children && Array.isArray(children) && children.length > 0) {
      const childrenItems = flattenTree(
        children,
        childrenField,
        parentField,
        node.id || parentId
      );
      result.push(...childrenItems);
    }
    
    return result;
  }, [] as Array<Omit<T, 'children'> & Record<string, any>>);
}

/**
 * 将平面数组转换为树结构
 * @param items 平面数组
 * @param options 转换选项
 * @returns 树结构数组
 * @example
 * const items = [
 *   { id: 1, name: 'A' },
 *   { id: 2, name: 'B', parentId: 1 },
 *   { id: 3, name: 'C', parentId: 1 }
 * ];
 * arrayToTree(items); 
 * // [{ id: 1, name: 'A', children: [
 * //   { id: 2, name: 'B', parentId: 1 },
 * //   { id: 3, name: 'C', parentId: 1 }
 * // ]}]
 */
export function arrayToTree<T extends Record<string, any>>(
  items: T[],
  options: {
    idField?: string;
    parentField?: string;
    childrenField?: string;
    rootParentValue?: any;
    transform?: (item: T) => any;
  } = {}
): Array<T & Record<string, any>> {
  const {
    idField = 'id',
    parentField = 'parentId',
    childrenField = 'children',
    rootParentValue = null,
    transform
  } = options;
  
  // 创建ID到节点的映射
  const itemMap: Record<string, T & Record<string, any>> = {};
  
  // 复制所有项（避免修改原始数据）
  const mappedItems = items.map(item => {
    const newItem = transform ? transform(item) : { ...item };
    const id = newItem[idField];
    if (id !== undefined) {
      itemMap[id] = newItem;
    }
    return newItem;
  });
  
  // 构建树
  const tree: Array<T & Record<string, any>> = [];
  
  mappedItems.forEach(item => {
    const parentId = item[parentField];
    
    // 如果是根节点
    if (parentId === rootParentValue) {
      tree.push(item);
      return;
    }
    
    // 将节点添加到父节点的children数组
    const parentItem = itemMap[parentId];
    if (parentItem) {
      if (!parentItem[childrenField]) {
        parentItem[childrenField] = [];
      }
      parentItem[childrenField].push(item);
    } else {
      // 如果找不到父节点，作为根节点处理
      tree.push(item);
    }
  });
  
  return tree;
}

/**
 * 将对象的值类型转换为期望的类型
 * @param obj 输入对象
 * @param schema 类型模式
 * @returns 转换后的对象
 * @example
 * const data = { id: '123', active: 'true', count: '5' };
 * const schema = { id: 'number', active: 'boolean', count: 'number' };
 * convertTypes(data, schema);
 * // { id: 123, active: true, count: 5 }
 */
export function convertTypes<T extends Record<string, any>>(
  obj: T,
  schema: Record<string, 'string' | 'number' | 'boolean' | 'date' | 'array'>
): Record<string, any> {
  const result: Record<string, any> = { ...obj };
  
  for (const [key, targetType] of Object.entries(schema)) {
    if (!(key in obj)) continue;
    
    const value = obj[key];
    if (value === null || value === undefined) continue;
    
    switch (targetType) {
      case 'string':
        result[key] = String(value);
        break;
      case 'number':
        result[key] = Number(value);
        break;
      case 'boolean':
        if (typeof value === 'string') {
          result[key] = value.toLowerCase() === 'true' || value === '1';
        } else {
          result[key] = Boolean(value);
        }
        break;
      case 'date':
        result[key] = new Date(value);
        break;
      case 'array':
        if (typeof value === 'string') {
          result[key] = value.split(',').map(item => item.trim());
        } else if (!Array.isArray(value)) {
          result[key] = [value];
        }
        break;
    }
  }
  
  return result;
} 