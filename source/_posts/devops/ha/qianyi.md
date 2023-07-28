---
title: pgsql单机数据迁移到Citus构建的集群中
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2023-07-21 22:30:34
---


要将单机的 PostgreSQL 数据库迁移到 Citus 构建的集群中，你可以使用以下步骤：

1. **备份你的 PostgreSQL 数据库**

    在开始之前，你需要备份你的 PostgreSQL 数据库。使用 `pg_dump` 命令可以轻松完成这个任务：

    ```bash
    pg_dump -U [username] -d [database] -f [output file]
    ```

    请将 `[username]`, `[database]` 和 `[output file]` 替换为你的 PostgreSQL 用户名，数据库名和你想要的输出文件名。

2. **在 Citus 中创建新数据库**

    接下来，你需要在 Citus 集群中创建一个新的数据库。你可以使用以下命令：

    ```sql
    CREATE DATABASE [new_database];
    ```

    请将 `[new_database]` 替换为你新的数据库名。

3. **在新数据库中创建表结构**

    使用 `pg_dump` 生成的备份文件中的表结构在新创建的数据库中创建表。你可以使用 `psql` 命令完成这个任务：

    ```bash
    psql -U [username] -d [new_database] -f [output file]
    ```

    请将 `[username]`, `[new_database]` 和 `[output file]` 替换为你的 PostgreSQL 用户名，新数据库名和你的输出文件名。

4. **将数据导入到新的表中**

    现在你已经创建了表，你可以使用 `COPY` 命令将数据导入到新的表中。首先，你需要使用 `pg_dump` 命令创建一个只包含数据的备份文件：

    ```bash
    pg_dump -U [username] -d [database] --data-only -f [output file]
    ```

    然后，你可以使用 `psql` 命令将数据导入到新的表中：

    ```bash
    psql -U [username] -d [new_database] -f [output file]
    ```

5. **分布式你的表**

    最后，你需要使用 Citus 的 `create_distributed_table` 函数分布式你的表。例如，如果你的表名是 `my_table` 并且你要根据 `id` 列进行分布，你可以使用以下命令：

    ```sql
    SELECT create_distributed_table('my_table', 'id');
    ```

注意：这些步骤假设你的单机 PostgreSQL 数据库和 Citus 集群在同一网络环境中。如果它们在不同的网络环境中，你可能还需要考虑数据传输的问题。
