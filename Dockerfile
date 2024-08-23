# 第一阶段：构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 将package.json和package-lock.json复制到容器中
COPY package*.json ./

# 安装生产环境依赖
RUN npm ci
# RUN npm install --production

# 将项目文件复制到容器中
COPY . .

# 编译NestJS项目
RUN npm run build

# 第二阶段：运行环境
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/traineddata ./traineddata

# 暴露端口
EXPOSE 3000


CMD ["node", "dist/main.js"]

