/**
 * 网络请求工具模块
 */

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: BodyInit
  timeout?: number
}

export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 5000, ...restOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...restOptions,
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('未知网络错误')
  } finally {
    clearTimeout(timeoutId)
  }
}

// 便捷方法
export const get = <T = any>(url: string) => request<T>(url)

export const post = <T = any>(
  url: string,
  body: Record<string, any>,
  options?: Omit<RequestOptions, 'method' | 'body'>
) => request<T>(url, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    ...options?.headers
  },
  ...options
})