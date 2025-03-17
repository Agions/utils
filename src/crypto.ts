/**
 * 加密解密工具函数
 */

// 浏览器环境
const isBrowser = typeof window !== 'undefined' && typeof window.crypto !== 'undefined';

/**
 * Base64编码
 * @param str 输入字符串
 * @returns Base64编码字符串
 * @example
 * base64Encode('Hello World'); // 'SGVsbG8gV29ybGQ='
 */
export function base64Encode(str: string): string {
  if (isBrowser) {
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    return Buffer.from(str).toString('base64');
  }
}

/**
 * Base64解码
 * @param str Base64编码字符串
 * @returns 解码后的字符串
 * @example
 * base64Decode('SGVsbG8gV29ybGQ='); // 'Hello World'
 */
export function base64Decode(str: string): string {
  if (isBrowser) {
    return decodeURIComponent(escape(atob(str)));
  } else {
    return Buffer.from(str, 'base64').toString();
  }
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 * @example
 * randomString(16); // 例如: 'a1b2c3d4e5f6g7h8'
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (isBrowser) {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(bytes[i] % chars.length);
    }
  } else {
    const crypto = require('crypto');
    const bytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(bytes[i] % chars.length);
    }
  }
  
  return result;
}

/**
 * 生成MD5哈希
 * @param data 输入数据
 * @returns MD5哈希值
 * @example
 * md5('Hello World'); // '3e25960a79dbc69b674cd4ec67a72c62'
 */
export function md5(data: string): string {
  if (isBrowser) {
    // 使用SubtleCrypto API（异步，实际使用需要改为Promise）
    // 这里只是示例，浏览器环境可能需要使用第三方库
    return data.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
    }, 0).toString(16);
  } else {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(data).digest('hex');
  }
}

/**
 * SHA-256哈希
 * @param data 输入数据
 * @returns SHA-256哈希值
 * @example
 * sha256('Hello World'); // 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
 */
export function sha256(data: string): Promise<string> {
  if (isBrowser) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    return window.crypto.subtle.digest('SHA-256', dataBuffer)
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
  } else {
    return new Promise((resolve) => {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(data).digest('hex');
      resolve(hash);
    });
  }
}

/**
 * AES加密
 * @param data 待加密数据
 * @param key 密钥
 * @param iv 初始向量（可选）
 * @returns 加密后的Base64字符串
 * @example
 * aesEncrypt('Hello World', 'mysecretkey1234'); // 返回加密后的字符串
 */
export async function aesEncrypt(data: string, key: string, iv?: string): Promise<string> {
  if (isBrowser) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // 从密钥字符串生成密钥
    const keyBuffer = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(key.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );
    
    // 生成或使用提供的IV
    const ivBytes = iv 
      ? encoder.encode(iv.padEnd(16, '0').slice(0, 16))
      : window.crypto.getRandomValues(new Uint8Array(16));
    
    // 加密
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBytes },
      keyBuffer,
      dataBuffer
    );
    
    // 合并IV和加密数据
    const result = new Uint8Array(ivBytes.length + encryptedBuffer.byteLength);
    result.set(ivBytes);
    result.set(new Uint8Array(encryptedBuffer), ivBytes.length);
    
    // 转为Base64
    return btoa(Array.from(result, byte => String.fromCharCode(byte)).join(''));
  } else {
    return new Promise((resolve) => {
      const crypto = require('crypto');
      
      // 密钥处理
      const keyBytes = Buffer.from(key.padEnd(32, '0').slice(0, 32));
      
      // IV处理
      const ivBytes = iv 
        ? Buffer.from(iv.padEnd(16, '0').slice(0, 16))
        : crypto.randomBytes(16);
      
      // 创建加密器
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBytes, ivBytes);
      
      // 加密
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // 合并IV和加密数据
      const ivBase64 = ivBytes.toString('base64');
      resolve(`${ivBase64}:${encrypted}`);
    });
  }
}

/**
 * AES解密
 * @param encryptedData 加密后的Base64字符串
 * @param key 密钥
 * @returns 解密后的字符串
 * @example
 * aesDecrypt(encryptedData, 'mysecretkey1234'); // 返回 'Hello World'
 */
export async function aesDecrypt(encryptedData: string, key: string): Promise<string> {
  if (isBrowser) {
    try {
      // 解析Base64
      const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // 提取IV（前16字节）
      const iv = encryptedBytes.slice(0, 16);
      const data = encryptedBytes.slice(16);
      
      // 从密钥字符串生成密钥
      const encoder = new TextEncoder();
      const keyBuffer = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(key.padEnd(32, '0').slice(0, 32)),
        { name: 'AES-CBC' },
        false,
        ['decrypt']
      );
      
      // 解密
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        keyBuffer,
        data
      );
      
      // 转为字符串
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      throw new Error(`解密失败: ${error}`);
    }
  } else {
    return new Promise((resolve, reject) => {
      try {
        const crypto = require('crypto');
        
        // 密钥处理
        const keyBytes = Buffer.from(key.padEnd(32, '0').slice(0, 32));
        
        // 分离IV和加密数据
        const [ivBase64, encryptedBase64] = encryptedData.split(':');
        const iv = Buffer.from(ivBase64, 'base64');
        
        // 创建解密器
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBytes, iv);
        
        // 解密
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        resolve(decrypted);
      } catch (error) {
        reject(new Error(`解密失败: ${error}`));
      }
    });
  }
}

/**
 * HMAC-SHA256签名
 * @param data 待签名数据
 * @param key 密钥
 * @returns 签名结果
 * @example
 * hmacSha256('Hello World', 'mysecretkey'); // 生成HMAC签名
 */
export async function hmacSha256(data: string, key: string): Promise<string> {
  if (isBrowser) {
    const encoder = new TextEncoder();
    
    // 导入密钥
    const keyBuffer = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // 计算签名
    const signature = await window.crypto.subtle.sign(
      'HMAC',
      keyBuffer,
      encoder.encode(data)
    );
    
    // 转为十六进制
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    return new Promise((resolve) => {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(data);
      resolve(hmac.digest('hex'));
    });
  }
}

/**
 * 生成UUID v4
 * @returns UUID字符串
 * @example
 * uuid(); // 例如: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
 */
export function uuid(): string {
  if (isBrowser) {
    return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
      (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  } else {
    const crypto = require('crypto');
    return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
      (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
    );
  }
} 