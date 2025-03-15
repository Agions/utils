import { debounce, throttle, sleep, retry, memoize, findNode, TreeNode } from '../src/misc';

describe('misc module', () => {
  describe('debounce function', () => {
    test('应该在指定时间后只执行一次', () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // 多次调用
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // 验证尚未执行
      expect(mockFn).not.toBeCalled();

      // 快进时间
      jest.advanceTimersByTime(100);

      // 验证只执行一次
      expect(mockFn).toBeCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('throttle function', () => {
    test('应该在指定时间内最多执行一次', () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      // 第一次调用应该立即执行
      throttledFn();
      expect(mockFn).toBeCalledTimes(1);

      // 重置mock
      mockFn.mockReset();

      // 多次调用
      throttledFn();
      throttledFn();
      throttledFn();

      // 验证未执行
      expect(mockFn).not.toBeCalled();

      // 快进时间
      jest.advanceTimersByTime(100);

      // 验证执行一次
      expect(mockFn).toBeCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('sleep function', () => {
    test('应该延迟指定时间', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();

      const promise = sleep(100).then(mockFn);

      // 验证尚未执行
      expect(mockFn).not.toBeCalled();

      // 快进时间
      jest.advanceTimersByTime(100);

      // 等待Promise解析
      await promise;

      // 验证已执行
      expect(mockFn).toBeCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('retry function', () => {
    test('应该在成功时返回结果', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const result = await retry(mockFn, { retries: 3 });

      expect(result).toBe('success');
      expect(mockFn).toBeCalledTimes(1);
    });

    test('应该在失败后重试', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const result = await retry(mockFn, { retries: 3, delay: 0 });

      expect(result).toBe('success');
      expect(mockFn).toBeCalledTimes(3);
    });

    test('应该在超过重试次数后抛出错误', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(retry(mockFn, { retries: 2, delay: 0 }))
        .rejects
        .toThrow('fail');

      expect(mockFn).toBeCalledTimes(3); // 初始 + 2次重试
    });
  });

  describe('memoize function', () => {
    test('应该缓存函数结果', () => {
      const mockFn = jest.fn((a, b) => a + b);
      const memoizedFn = memoize(mockFn);

      // 第一次调用
      expect(memoizedFn(1, 2)).toBe(3);
      expect(mockFn).toBeCalledTimes(1);

      // 相同参数再次调用
      expect(memoizedFn(1, 2)).toBe(3);
      expect(mockFn).toBeCalledTimes(1); // 不应再次调用原函数

      // 不同参数调用
      expect(memoizedFn(2, 3)).toBe(5);
      expect(mockFn).toBeCalledTimes(2);
    });
  });

  describe('findNode function', () => {
    test('应该找到符合条件的节点', () => {
      const tree: TreeNode = {
        id: 1,
        name: 'Root',
        children: [
          { id: 2, name: 'Child 1' },
          { 
            id: 3, 
            name: 'Child 2',
            children: [{ id: 4, name: 'Grandchild' }]
          }
        ]
      };

      // 查找根节点
      const rootNode = findNode(tree, node => node.id === 1);
      expect(rootNode).toBe(tree);

      // 查找子节点
      const childNode = findNode(tree, node => node.id === 3);
      expect(childNode).toEqual({
        id: 3,
        name: 'Child 2',
        children: [{ id: 4, name: 'Grandchild' }]
      });

      // 查找孙节点
      const grandchildNode = findNode(tree, node => node.id === 4);
      expect(grandchildNode).toEqual({ id: 4, name: 'Grandchild' });

      // 查找不存在的节点
      const nonExistentNode = findNode(tree, node => node.id === 999);
      expect(nonExistentNode).toBeUndefined();
    });

    test('应该处理没有子节点的情况', () => {
      const node: TreeNode = { id: 1, name: 'Single Node' };
      
      // 查找当前节点
      const foundNode = findNode(node, n => n.id === 1);
      expect(foundNode).toBe(node);
      
      // 查找不存在的节点
      const notFoundNode = findNode(node, n => n.id === 2);
      expect(notFoundNode).toBeUndefined();
    });

    test('应该处理空子节点数组的情况', () => {
      const tree: TreeNode = {
        id: 1,
        name: 'Root',
        children: []
      };
      
      // 查找当前节点
      const rootNode = findNode(tree, node => node.id === 1);
      expect(rootNode).toBe(tree);
      
      // 查找不存在的节点
      const nonExistentNode = findNode(tree, node => node.id === 2);
      expect(nonExistentNode).toBeUndefined();
    });
  });
});