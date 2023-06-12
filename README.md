# Solid CSR Template

## 创建 Vanilla 项目

用 Vite 创建一个 Vanilla 项目

```
pnpm create vite
```

安装 Solid

```
pnpm add solid-js
```

安装 Solid 的 Vite 插件

```
pnpm add -D vite-plugin-solid
```

创建 Vite 的配置文件 vite.config.ts

```
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
});
```

在 tsconfig.json 添加如下两行

```
{
  "compilerOptions": {
    ...
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

index.html 文件中的 main.ts 改为 main.tsx

```
<script type="module" src="/src/main.tsx"></script>
```

删除 src 下的所有文件，创建 src/main.tsx

```
import { render } from "solid-js/web";

import App from "./App";

const app = document.getElementById("app");

if (!app) throw new Error("No #app element found in the DOM.");

render(() => <App />, app);
```

创建 src/App.tsx

```
import { Component } from "solid-js";

const App: Component = () => {
  return <h1>Hello Solid</h1>;
};

export default App;
```

## 添加 Tailwind CSS

安装 Tailwind CSS

```
pnpm add -D tailwindcss postcss autoprefixer
```

创建 PostCSS 配置文件 postcss.config.js

```
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

创建 Tailwind CSS 配置文件 tailwind.config.ts

```
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

创建 src/index.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

把 index.css 引入到 src/main.tsx 中

```
import "./index.css";
```

## 添加 ESLint 和 Prettier

配合编辑器插件，用 Prettier 格式化代码，用 ESLint 检测代码质量

- VS Code 需要自己安装 ESLint 和 Prettier 扩展，并配置用 Prettier 作为 formatter
- WebStorm 内置了 ESLint 和 Prettier 插件，需要自己启用它们

```
pnpm add -D prettier eslint eslint-plugin-solid eslint-config-prettier
```

生成 ESLint 配置文件

```
pnpx eslint --init
```

选 To check syntax and find problems，用 Prettier enforce code style

```
? How would you like to use ESLint?
  To check syntax only
❯ To check syntax and find problems
  To check syntax, find problems, and enforce code style
```

选 JavaScript modules (import/export)

```
? What type of modules does your project use? …
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
```

选 None of these

```
? Which framework does your project use? …
  React
  Vue.js
❯ None of these
```

选 Yes

```
? Does your project use TypeScript? › No / Yes
```

选 Browser

```
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
  Node
```

视情况而定，我选 JSON

```
? What format do you want your config file to be in? …
  JavaScript
  YAML
❯ JSON
```

选 Yes

```
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
? Would you like to install them now? › No / Yes
```

视情况而定，我用 pnpm

```
? Which package manager do you want to use? …
  npm
  yarn
❯ pnpm
```

将扩展和插件添加到 .eslintrc.json 中，注意扩展 prettier 要放到最后

```
{
  "extends": [
    ...
    "plugin:solid/recommended",
    "prettier"
  ],
  "plugins": [..., "solid"]
}
```

在 package.json 中添加 script

```
{
  "scripts": {
    ...
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --fix --ext .ts,.tsx"
  }
}
```

## 添加 Vitest

安装相关依赖

```
pnpm add -D vitest jsdom @testing-library/jest-dom @types/testing-library__jest-dom @solidjs/testing-library
```

在 vite.config.ts 中添加 Vitest 的配置

```
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    transformMode: { web: [/\.[jt]sx?$/] },
    deps: {
      inline: ["@solidjs/testing-library"],
    },
  },
});
```

在 package.json 中添加一个 script

```
{
  "scripts": {
    ...
    "test": "vitest"
  }
}
```

测试文件以 .test.ts 或 .spec.ts 为扩展，放到 tests 或 \_\_tests\_\_ 目录下

修改 tsconfig.json

```
{
  "include": ["src", "tests"]
}
```

新建一个测试用例 tests/App.test.tsx

```
import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import App from "../src/App";

describe("App", () => {
  it("should render the app", () => {
    const { getByText } = render(() => <App />);
    expect(getByText("Hello Solid")).toBeInTheDocument();
  });
});
```

## 添加 Husky

添加 Husky 之前，项目需要是一个 git 仓库

```
git init
```

添加 Husky

```
pnpx husky-init && pnpm i
```

修改 .husky/pre-commit

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint
pnpm vitest run
```

添加 commit 格式检测的 hook

```
pnpx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

添加 @commitlint/cli @commitlint/config-conventional

```
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

创建 commitlint 的配置文件 commitlint.config.js

```
export default {
  extends: ["@commitlint/config-conventional"],
};
```
