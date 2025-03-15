import { trim, capitalize, camelCase, kebabCase, snakeCase, truncate, parseTemplate } from '../src/string';

describe('string module', () => {
  describe('trim function', () => {
    test('应该去除字符串两端空格', () => {
      expect(trim('  Hello World  ')).toBe('Hello World');
      expect(trim('Hello World')).toBe('Hello World');
    });

    test('应该处理空字符串', () => {
      expect(trim('')).toBe('');
    });
  });

  describe('capitalize function', () => {
    test('应该将首字母大写', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('hello world')).toBe('Hello world');
    });

    test('应该处理空字符串', () => {
      expect(capitalize('')).toBe('');
    });

    test('应该处理已经大写的字符串', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('camelCase function', () => {
    test('应该转换短横线命名为驼峰命名', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
    });

    test('应该转换下划线命名为驼峰命名', () => {
      expect(camelCase('hello_world')).toBe('helloWorld');
    });

    test('应该处理空格分隔的字符串', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
    });

    test('应该处理首字母大写的情况', () => {
      expect(camelCase('Hello-World')).toBe('helloWorld');
    });
  });

  describe('kebabCase function', () => {
    test('应该转换驼峰命名为短横线命名', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
    });

    test('应该处理下划线命名', () => {
      expect(kebabCase('hello_world')).toBe('hello-world');
    });

    test('应该处理空格分隔的字符串', () => {
      expect(kebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('snakeCase function', () => {
    test('应该转换驼峰命名为下划线命名', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
    });

    test('应该处理短横线命名', () => {
      expect(snakeCase('hello-world')).toBe('hello_world');
    });

    test('应该处理空格分隔的字符串', () => {
      expect(snakeCase('hello world')).toBe('hello_world');
    });
  });

  describe('truncate function', () => {
    test('应该截断超出长度的字符串', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    test('应该使用自定义后缀', () => {
      expect(truncate('Hello World', 5, '***')).toBe('Hello***');
    });

    test('不应截断未超出长度的字符串', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('parseTemplate function', () => {
    test('应该解析模板字符串', () => {
      expect(parseTemplate('Hello, ${name}!', { name: 'World' })).toBe('Hello, World!');
    });

    test('应该处理多个占位符', () => {
      expect(parseTemplate('${greeting}, ${name}!', { greeting: 'Hello', name: 'World' }))
        .toBe('Hello, World!');
    });

    test('应该保留未匹配的占位符', () => {
      expect(parseTemplate('Hello, ${name}!', {})).toBe('Hello, ${name}!');
    });
  });
});