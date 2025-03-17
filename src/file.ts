/**
 * 文件处理工具函数
 */

/**
 * 文件大小单位
 */
export type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';

/**
 * 文件大小信息
 */
export type SizeInfo = {
  value: number;
  unit: SizeUnit;
  text: string;
};

/**
 * 文件类型映射
 */
export const fileTypes = {
  // 图片
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'],
  // 文档
  document: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'md', 'rtf'],
  // 视频
  video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
  // 音频
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma'],
  // 压缩文件
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
  // 代码
  code: ['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml', 'yaml', 'yml', 'php', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rb', 'swift']
};

/**
 * 文件信息类型
 */
export type FileInfo = {
  name: string;
  size: number;
  formattedSize: SizeInfo;
  extension: string;
  type: string;
  lastModified?: Date;
  dataUrl?: string;
};

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名（小写）
 * @example
 * getExtension('file.jpg'); // 'jpg'
 * getExtension('file.tar.gz'); // 'gz'
 */
export function getExtension(filename: string): string {
  if (!filename) return '';
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * 根据扩展名判断文件类型
 * @param filename 文件名或扩展名
 * @returns 文件类型
 * @example
 * getFileType('image.jpg'); // 'image'
 * getFileType('document.pdf'); // 'document'
 * getFileType('unknown.xyz'); // 'unknown'
 */
export function getFileType(filename: string): string {
  const extension = filename.includes('.') ? getExtension(filename) : filename.toLowerCase();
  
  if (!extension) return 'unknown';
  
  for (const [type, extensions] of Object.entries(fileTypes)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  
  return 'unknown';
}

/**
 * 格式化文件大小
 * @param bytes 文件字节大小
 * @param decimals 小数位数
 * @returns 格式化后的文件大小信息
 * @example
 * formatSize(1024); // { value: 1, unit: 'KB', text: '1 KB' }
 * formatSize(1536, 2); // { value: 1.5, unit: 'KB', text: '1.5 KB' }
 */
export function formatSize(bytes: number, decimals: number = 1): SizeInfo {
  if (bytes === 0) {
    return { value: 0, unit: 'B', text: '0 B' };
  }
  
  const k = 1024;
  const units: SizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB'];
  
  // 计算单位
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  const unit = units[i];
  
  return {
    value,
    unit,
    text: `${value} ${unit}`
  };
}

/**
 * 生成文件信息对象
 * @param file 文件对象
 * @returns 文件信息
 * @example
 * getFileInfo(fileObject);
 * // { name: 'image.jpg', size: 1024, formattedSize: { value: 1, unit: 'KB', text: '1 KB' }, extension: 'jpg', type: 'image', lastModified: Date }
 */
export function getFileInfo(file: File): FileInfo {
  const extension = getExtension(file.name);
  
  return {
    name: file.name,
    size: file.size,
    formattedSize: formatSize(file.size),
    extension: extension,
    type: getFileType(extension),
    lastModified: new Date(file.lastModified)
  };
}

/**
 * 将文件转换为Base64字符串
 * @param file 文件对象
 * @returns Promise，解析为Base64字符串
 * @example
 * fileToBase64(imageFile).then(base64 => {
 *   console.log(base64); // data:image/jpeg;base64,...
 * });
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 从Base64字符串创建Blob对象
 * @param base64 Base64字符串
 * @param mimeType MIME类型
 * @returns Blob对象
 * @example
 * const blob = base64ToBlob('data:image/jpeg;base64,...', 'image/jpeg');
 * const url = URL.createObjectURL(blob);
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  // 移除"data:image/jpeg;base64,"前缀
  const base64Data = base64.includes(';base64,') 
    ? base64.split(';base64,')[1] 
    : base64;
  
  // 解码Base64
  const byteString = atob(base64Data);
  
  // 创建ArrayBuffer
  const buffer = new ArrayBuffer(byteString.length);
  const view = new Uint8Array(buffer);
  
  // 填充数据
  for (let i = 0; i < byteString.length; i++) {
    view[i] = byteString.charCodeAt(i);
  }
  
  // 创建Blob
  return new Blob([buffer], { type: mimeType });
}

/**
 * 从文件URL创建文件下载
 * @param url 文件URL
 * @param filename 下载的文件名
 * @example
 * downloadFile('https://example.com/file.pdf', 'document.pdf');
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // 清理
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 100);
}

/**
 * 从Blob对象创建文件下载
 * @param blob Blob对象
 * @param filename 下载的文件名
 * @example
 * downloadBlob(new Blob(['文本内容'], { type: 'text/plain' }), 'file.txt');
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
}

/**
 * 获取文件的MIME类型
 * @param filename 文件名
 * @returns MIME类型
 * @example
 * getMimeType('file.jpg'); // 'image/jpeg'
 * getMimeType('file.pdf'); // 'application/pdf'
 */
export function getMimeType(filename: string): string {
  const extension = getExtension(filename);
  
  const mimeTypes: Record<string, string> = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    
    // 文档
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    md: 'text/markdown',
    rtf: 'application/rtf',
    
    // 视频
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    
    // 音频
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    aac: 'audio/aac',
    wma: 'audio/x-ms-wma',
    
    // 压缩文件
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    bz2: 'application/x-bzip2',
    
    // 代码和数据
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ts: 'application/typescript',
    json: 'application/json',
    xml: 'application/xml',
    yaml: 'text/yaml',
    yml: 'text/yaml'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

/**
 * 检查文件是否为图片
 * @param file 文件对象或文件名
 * @returns 是否为图片
 * @example
 * isImage('photo.jpg'); // true
 * isImage(imageFileObject); // true
 */
export function isImage(file: File | string): boolean {
  const filename = typeof file === 'string' ? file : file.name;
  const type = getFileType(filename);
  return type === 'image';
}

/**
 * 限制文件上传大小
 * @param file 文件对象
 * @param maxSize 最大字节数
 * @returns 是否满足大小限制
 * @example
 * if (!checkFileSize(file, 1024 * 1024)) {
 *   alert('文件不能超过1MB');
 * }
 */
export function checkFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * 检查文件类型是否在允许的范围内
 * @param file 文件对象或文件名
 * @param allowedTypes 允许的类型数组
 * @returns 是否为允许的类型
 * @example
 * checkFileType('document.pdf', ['document', 'image']); // true
 * checkFileType(imageFile, ['image']); // true
 */
export function checkFileType(file: File | string, allowedTypes: string[]): boolean {
  const filename = typeof file === 'string' ? file : file.name;
  const type = getFileType(filename);
  return allowedTypes.includes(type);
}

/**
 * 创建文件预览URL
 * @param file 文件对象
 * @returns 预览URL
 * @example
 * const previewUrl = createFilePreview(imageFile);
 * imageElement.src = previewUrl;
 * 
 * // 使用完毕后释放
 * URL.revokeObjectURL(previewUrl);
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
} 