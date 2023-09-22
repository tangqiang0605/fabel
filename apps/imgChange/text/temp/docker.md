## docker构成

1. client 客户端
2. host 核心
3. registries 仓库

三类命令

1. deamon 进程管理
2. image 镜像管理
3. container 容器管理

## 镜像

docker run
参数
-d 后台
-p 映射端口
-name 容器名、镜像源
-v：目录挂载，宿主机目录映射到容器内，格式，宿主目录: 容器目录

## dockerfile 制作自己的镜像

docker bulid
-t：tag 名字: 版本
位置：一个句点

```
# linux+nodejs
docker pull node
# 复制文件到/app
add . /app
# 设置运行目录
workdir /app
# 创建镜像时执行的命令
run
# 容器创建后执行的命令
cmd
```

## 目录挂载

1. 宿主机目录映射到容器内。run 时，添加参数 -v 宿主目录: 容器目录
2. volume 卷，容器创建在宿主机用于保存运行后的数据 -v 命名: 容器目录
   区别是，一个是路径，一个是名字

## 多容器通信（放在同一虚拟网络中）

1. docker network create xxx
2. run 时指定网络 --net work
   这样容器在同一网络下就可以通过端口通信

## Docker-compose 一次创建多个容器

1. docker-compose. yml

```
service 容器 1
	build（dockerfile目录）/image
	ports 端口映射
	volumes 目录映射
	environment = TZ=Asia/Shanghai 时区
```

2. docker-compose up -d --build
3. docker-compose dowm -v

## vscode 插件

1. docker 插件
   支持运行命令、语法高亮

## 启动 shell

exec -it id /bin/bash
