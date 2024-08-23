# 第一阶段：构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 将package.json和package-lock.json复制到容器中
COPY package*.json ./

# 安装生产环境依赖
RUN npm ci
# RUN npm install 
#--production

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
COPY --from=builder /app/package.json ./

COPY --from=builder /app/osd.traineddata ./
COPY --from=builder /app/chi_sim.traineddata ./
COPY --from=builder /app/chi_tra.traineddata ./
COPY --from=builder /app/eng.traineddata ./

# COPY --from=builder /app/npm-shrinkwrap.json ./npm-shrinkwrap.json 
# RUN npm install --production
# 确保生产环境依赖已正确安装（这一步在第二阶段其实是多余的，因为已经复制了node_modules）
# 但如果需要进一步清理，可以使用npm prune --production

# 暴露端口
EXPOSE 3000

# 设置环境变量
# ENV OCR_VERSION=0.0.2

# 启动应用
# 注意：这里需要根据你的NestJS项目配置来设置正确的启动命令
# 假设你的NestJS项目使用了Nest CLI生成的默认启动脚本，并且编译后的入口是dist/main.js
# 或者，如果你使用了NestFactory.create()并直接运行了某个模块，你可能需要自定义这个命令
# CMD ["node", "dist/main.js"]  # 这是Nest CLI生成的默认启动方式
# 或者，如果你使用了NestJS的内置命令来启动（如npm run start:prod），你可能需要这样做：
# 但通常不推荐在生产环境中使用npm run来启动应用，因为它会增加启动时间和复杂性
# 更好的做法是直接运行编译后的JavaScript文件
# 假设你的入口文件是dist/src/main.js（这取决于你的项目结构）
CMD ["node", "dist/main.js"]

