import { isEmail, isURL, isPhoneNumber, isIDCard, isIPv4, isEmpty, isNumeric } from '../src/validator';

describe('validator module', () => {
  describe('isEmail function', () => {
    test('应该正确验证有效邮箱', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('应该正确验证无效邮箱', () => {
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
    });
  });

  describe('isURL function', () => {
    test('应该正确验证有效URL', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://localhost:3000')).toBe(true);
    });

    test('应该正确验证无效URL', () => {
      expect(isURL('invalid-url')).toBe(false);
      expect(isURL('http://')).toBe(false);
    });
  });

  describe('isPhoneNumber function', () => {
    test('应该正确验证有效手机号', () => {
      expect(isPhoneNumber('13812345678')).toBe(true);
      expect(isPhoneNumber('15912345678')).toBe(true);
    });

    test('应该正确验证无效手机号', () => {
      expect(isPhoneNumber('1381234567')).toBe(false); // 少一位
      expect(isPhoneNumber('138123456789')).toBe(false); // 多一位
      expect(isPhoneNumber('12345678901')).toBe(false); // 不是1开头
    });
  });

  describe('isIDCard function', () => {
    test('应该正确验证有效身份证号', () => {
      expect(isIDCard('110101199001011234')).toBe(true); // 18位
      expect(isIDCard('11010119900101123X')).toBe(true); // 末尾带X
      expect(isIDCard('110101990101123')).toBe(true); // 15位
    });

    test('应该正确验证无效身份证号', () => {
      expect(isIDCard('1101011990010')).toBe(false); // 少位
      expect(isIDCard('11010119900101123Y')).toBe(false); // 末尾非法字符
    });
  });

  describe('isIPv4 function', () => {
    test('应该正确验证有效IPv4地址', () => {
      expect(isIPv4('192.168.1.1')).toBe(true);
      expect(isIPv4('127.0.0.1')).toBe(true);
      expect(isIPv4('0.0.0.0')).toBe(true);
      expect(isIPv4('255.255.255.255')).toBe(true);
    });

    test('应该正确验证无效IPv4地址', () => {
      expect(isIPv4('256.0.0.1')).toBe(false); // 超过255
      expect(isIPv4('192.168.1')).toBe(false); // 少一段
      expect(isIPv4('192.168.1.1.1')).toBe(false); // 多一段
    });
  });

  describe('isEmpty function', () => {
    test('应该正确验证空值', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    test('应该正确验证非空值', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('isNumeric function', () => {
    test('应该正确验证数字字符串', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('12.34')).toBe(true);
      expect(isNumeric('-12.34')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    test('应该正确验证非数字字符串', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('12a')).toBe(false);
      expect(isNumeric('12.34.56')).toBe(false);
    });
  });
});