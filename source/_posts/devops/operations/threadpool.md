
---
title: 基于队列的并发线程池
tags:
  - python
categories:
  - 开发笔记 
date: 2022-02-05 22:30:34
---

## 背景
做一个记录，在对python 自带的 `multiprocessing.pool` 下的 `ThreadPool` 及 `Pool`实现原理学习后简单弄一下
```python
from  multiprocessing.pool  import ThreadPool,Pool
```

## 线程池核心  
```python
# encoding: utf-8
import threading
import contextlib
import time,random

try:
    import queue #兼容python3
    rest = queue.Queue()
except:
    import Queue #兼容python2
    rest = Queue.Queue()

class ThreadPoolManager:
    def __init__(self, max_num, max_task_num=None):
        '''
        :param max_num: 设置线程池最多可实例化的线程数
        :param max_task_num: 设置最多任务数量
        '''
        # 创建字典，用于存储回调函数处理结果
        self.result = {}
        # 创建空对象，用于停止线程
        self.StopEvent = object()
        if max_task_num:
            try:
                self.q = queue.Queue(max_task_num)
            except:
                self.q = Queue.Queue(max_task_num)  # 对于python2的支持
        else:
            try:
                self.q = queue.Queue()
            except:
                self.q = Queue.Queue()  # 对于python2的支持

        self.max_num = max_num
        # 任务取消标识
        self.cancel = False
        # 任务中断标识
        self.terminal = False
        # 已实例化的线程列表
        self.generate_list = []
        # 处于空闲状态的线程列表
        self.free_list = []
        # 已完成的任务id
        self.done = []

    def put(self, func, *args):
        '''
        往任务队列放入一个任务
        :param func:
        :param args:
        :return:
        '''
        # 判断任务是否被取消
        if self.cancel:
            return
        # 如果没有空闲的线程，并且已创建的线程数量小于预定义的最大线程数，则创建新的线程
        if len(self.free_list) == 0 and len(self.generate_list) < self.max_num:
            self.generate_thread()
        w = (func, args[0],args[1:])
        self.q.put(w)

    def generate_thread(self):
        '''
        创建一个线程
        :return:
        '''
        t = threading.Thread(target=self.call)
        t.start()


    def call(self):
        '''
        循环获取任务函数并执行任务,
        正常情况下,每个线程保存生存状态,直至获取线程终止的flag
        :return:
        '''
        # 获取当前线程的名称
        current_thread = threading.currentThread().getName()
        # 将当前线程的名称加入已实例化的线程列表中
        self.generate_list.append(current_thread)
        # 从任务队列中获取一个任务
        event = self.q.get()
        while event != self.StopEvent:
            # 解析任务中封装的3个参数
            func, tags, arguments = event
            try:
                print "run taskid: %s"%(arguments[0])
                result = func(arguments)
            except Exception as e:
                print("thread run error:task_id:%s,error message: %s"%(arguments[0],e))
                result = None
            try:
                rest.put({tags:result})
            except Exception as e:
                print(e)
            # 当某个线程正常执行完一个任务时,先执行work_state()
            with self.worker_state(self.free_list, current_thread):
                # 强制终止线程
                if self.terminal:
                    event = self.StopEvent
                else:
                    # 从这里开始又一个正常的任务循环
                    event = self.q.get()
        else:
            self.generate_list.remove(current_thread)


    def close(self):
        '''
        执行完所有任务后,让所有的线程都停止
        :return:
        '''
        self.cancel = True
        full_size = len(self.generate_list)
        while full_size:
            self.q.put(self.StopEvent)
            full_size -= 1

    def terminate(self):
        '''
        在任务执行过程中,终止线程,提前退出
        :return:
        '''
        self.terminal = True
        while self.generate_list:
            self.q.put(self.StopEvent)

    @contextlib.contextmanager
    def worker_state(self, start_list, worker_thread):
        '''
        用于记录空闲的线程,或从空闲列表中取出线处理任务
        :param start_list:
        :param worker_thread:
        :return:
        '''
        start_list.append(worker_thread)
        try:
            yield
        finally:
            start_list.remove(worker_thread)

    def callback(self,tags=None):
        '''
        等待回收处理完成的数据
        :return:
        '''
        if tags in self.result:
            df = self.result.pop(tags)
            return df
        while self.q.qsize() != 0 or self.generate_list:
            df = rest.get()
            if tags in df:
                return df.pop(tags)
            self.result.update(df)
        return self.result
```

## 测试类
```python
class Reat:
    def __init__(self, a, b, c):
        self.a = a
        self.b = b
        self.c = c

    def test_ceng(self,args):
        timesleep = int(random.random()*10)
        time.sleep(timesleep)
        return {"fdsa":"fdsaf"},["fdsa","fdsaf"]
```

## 测试函数
```python
def test_ceng2(id,d=[]):
    timesleep = int(random.random()*10)
    time.sleep(timesleep)
    return {"fdsa2":"fdsaf"}

```

## 测试
```python
def Test_run():
    pool = ThreadPoolManager(10)
    try:
        t1 = time.time()
        t = Reat(1, 3, 4)
        pool.put(t.test_ceng,"test_ceng996",['1','23','132','3213'],['1','23','132','3213'])
        pool.put(t.test_ceng, "test_ceng997",{"df":"hh"})
        pool.put(t.test_ceng, "test_ceng998",{"df":"hh"})
        print time.time() - t1
        pool.close()
    finally:
        # pool.callback()
        print pool.callback("test_ceng998")
        print pool.callback("test_ceng997")
        print pool.callback("test_ceng996")
        # print pool.callback()

if __name__ == "__main__":
    Test_run()
```