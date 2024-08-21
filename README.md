

# ocr-api

ocr-api is API for OCR service with Tesseract

## Description

ocr-api is API for OCR service with Tesseract

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



## Docker

### docker build

```bash
docker build -t ocr-api .
```



### docker run

```bash
docker run -p 3008:3000 ocr-api
```

## docker-compose

```bash
docker-compose up --build
```

更新镜像后重启服务，以使用新版本的镜像。

```bash
docker-compose up -d
```



## Support

ocr-api is an MIT-licensed open source project. 

## Stay in touch

- Author - iczp.net
- Website - vvll.net

## License

Nest is [MIT licensed](LICENSE).
