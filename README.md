# vue3-sketch-ruler

<p align="center">
  <a href="https://www.npmjs.com/package/@kangwuyi/vue3-sketch-ruler"><img src="https://img.shields.io/npm/dm/@kangwuyi/vue3-sketch-ruler.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@kangwuyi/vue3-sketch-ruler"><img src="https://img.shields.io/npm/v/@kangwuyi/vue3-sketch-ruler.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@kangwuyi/vue3-sketch-ruler"><img src="https://img.shields.io/npm/l/@kangwuyi/vue3-sketch-ruler.svg?sanitize=true" alt="License"></a>
</p>

<p align="center">
  <a href="https://orcid.org/0009-0009-0993-7629"><img src="https://img.shields.io/badge/iD-0009--0009--0993--7629-f5f5f5" alt="Orcid"></a>
  <a href="https://ko-fi.com/kwy"><img src="https://badgen.net/badge/icon/kofi?icon=kofi&label=kwy&color=F16061" alt="Kwy"></a>

<!-- [![iD: 0009-0009-0993-7629](https://img.shields.io/badge/0009--0009--0993--7629-blue.svg?style=for-the-badge&logo=orcid)](https://orcid.org/0009-0009-0993-7629) [![Ko-fi](https://img.shields.io/badge/ko--fi-F16061?style=for-the-badge&logo=kofi&logoColor=f5f5f5)](https://ko-fi.com/kwy) -->

</p>

<p align="center">

![Depfu](https://img.shields.io/depfu/kangwuyi/vue3-sketch-ruler) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kangwuyi/vue3-sketch-ruler) [![Code Coverage](https://img.shields.io/codecov/c/github/kangwuyi/vue3-sketch-ruler)](https://codecov.io/github/kangwuyi/vue3-sketch-ruler) [![Code Coverage](https://github.com/kangwuyi/vue3-sketch-ruler/actions/workflows/node.js.yml/badge.svg)](https://github.com/kangwuyi/kangwuyi/vue3-sketch-ruler)


</p>

## Installation

```bash
# use yarn
yarn add @kwy/vue3-sketch-ruler
# use npm
npm install --save @kwy/vue3-sketch-ruler
```

## How to use
```js
import { createApp } from 'vue'
import Ruler from '@kwy/vue3-sketch-ruler'
import 'vue3-sketch-ruler/build/vue3-sketch-ruler.css'
import App from './App.vue'

const app = createApp(App)
app.use(Spinner)
app.mount('#app')
```

## In file vue
```html
<imp-sketch-ruler name="circle" color="red" />
```

## 参数配置等

详见 vue3-ruler/src/App.vue 文件