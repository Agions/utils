import { request, get, post } from '../src/request';

describe('request module', () => {
  const TEST_API = 'https://jsonplaceholder.typicode.com';

  test('GET请求正常响应', async () => {
    const data = await get<{ id: number }>(`${TEST_API}/posts/1`);
    expect(data.id).toBe(1);
  });

  test('POST请求提交数据', async () => {
    const mockData = { title: 'test', body: 'content', userId: 1 };
    const res = await post(`${TEST_API}/posts`, mockData);
    expect(res.id).toBeGreaterThan(0);
  });

  test('超时异常处理', async () => {
    await expect(request(`${TEST_API}/posts/1`, {
      timeout: 10
    })).rejects.toThrow('请求失败');
  });

  test('HTTP错误状态码', async () => {
    await expect(get(`${TEST_API}/404`))
      .rejects
      .toThrow('HTTP error! status: 404');
  });
});