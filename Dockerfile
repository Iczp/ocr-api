# 使用官方 Node.js 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到容器中
COPY . .

# 编译 NestJS 项目
RUN npm run build

# 暴露应用运行的端口（通常是3000）
EXPOSE 3000

# 定义环境变量（可选，这里用于演示）
ENV OCR_VERSION=0.0.2

# 启动应用
CMD ["npm", "run", "start:prod"]
