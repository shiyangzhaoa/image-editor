## image-editor

[![Build Status](https://travis-ci.org/shiyangzhaoa/image-editor.svg?branch=master)](https://travis-ci.org/shiyangzhaoa/image-editor) ![npm](https://img.shields.io/npm/dm/image-editor-little?style=flat-square) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/image-editor-little?style=flat-square) ![NPM](https://img.shields.io/npm/l/image-editor-little?style=flat-square)

这是一个`React`截图工具的组件, 基本功能和微信截图相似, 因为使用了`React Hooks`, 所以对`React`的版本有一定要求，支持的功能：

1. 截取图片，下载处理好的图片
2. 矩形和圆形标注功能
3. 手写功能
4. 马赛克功能
5. 撤销操作

后续看情况拓展功能和优化

## install

```shell
yarn add image-editor-little
```

or

```shell
npm install -S image-editor-little
```

## example

```js
import ImageEditor from 'image-editor-little';

<ImageEditor
  width={500}
  height={500}
  src="https://miro.medium.com/max/3200/1*hLM2qGfy0VOTiyuyE3pOBA.png"
/>
```

## online

[![image-editor-little-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/keen-wildflower-8rrwt)

⚠️ [Iframes 禁止下载](https://www.chromestatus.com/feature/5706745674465280)

## 网页截图

给网页添加截图功能, 目前不会加这个功能, 不想依赖 html2canvas

[![image-editor-little-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/falling-dream-6vwqt)

## api

| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | --- |
| src | 图片的 src | `string` | - | 是 |
| width| 宽度 | `number` | - | 否 |
| height| 高度 | `number` | - | 否 |
| className| 自定义类名 | `string` | - | 否 |
| imageType | 下载图片格式类型 | `string` | `png` | 否 |
| locSize| 放大镜大小(x 10) | `number` | `10` | 否 |
| holdSize| 图片加载时, 占位 svg 宽高 | `object` | `{ w: '100vw', h: '100vh' }` | 否 |
| onClose | 点击 X 触发 | `(close: () => void) => void` | - | 否 |
| onDownload | 点击下载触发 | `(close: () => void) => void` | - | 否 |
| onConfirm| 点击确认触发 | `(url?: string, close?: () => void) => void` | - | 否 |
