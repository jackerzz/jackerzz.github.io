---
title: 持续集成
tags:
  - 测试平台构建
categories:
  - 自动化测试 
date: 2022-05-30 22:30:34
---
# super-linter

在 GitLab 中运行 super-linter Action

- [super-linter](https://github.com/github/super-linter)
- .gitlab-ci.yml
```yml
superlinter:
  image: github/super-linter:latest
  script: [ "true" ]
  variables: { RUN_LOCAL: "true", DEFAULT_WORKSPACE: $CI_BUILDS_DIR }
```

# [sonarqube](https://github.com/SonarSource/sonarqube)