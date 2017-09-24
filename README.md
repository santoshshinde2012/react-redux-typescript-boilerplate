# React, Redux & TypeScript Boilerplate

This project was created to demonstrate how to set up and organize a project using:

- [**React**](https://facebook.github.io/react/)
- [**Redux**](http://redux.js.org/)
- [**TypeScript**](https://www.typescriptlang.org/)

# Table of Contents
- [References](#references)
- [Project Directory Structure](#project-structure)
- [Setup](#setup)
  - [Step 1. Create project](#step-1)
  - [Step 2. Install Dependencies](#step-2)
  - [Step 3. Project Configuration](#step-3)
  - [Step 4. HTML Boilerplate](#step-4)
- [Build tools](#build-tools)
- [Steps To Use Existing Repository](#use-existing-repository)


# <a name="references"></a>References

- [React & Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
- [WEBPACK DEV SERVER](https://webpack.github.io/docs/webpack-dev-server.html)
- [Using JSX with TypeScript](http://blog.mgechev.com/2015/07/05/using-jsx-react-with-typescript/)
- [Redux Usage with React](http://redux.js.org/docs/basics/UsageWithReact.html)
- [Why React? Why Redux?](https://blog.stephencleary.com/2016/02/why-react-why-redux.html)
- [How to configure custom global interfaces (.d.ts files) for TypeScript?](https://stackoverflow.com/questions/42233987/how-to-configure-custom-global-interfaces-d-ts-files-for-typescript)


# <a name="project-structure"></a>Project Directory Structure

```
|-- src/
    |-- actions/
    |-- components/
    |-- constants/
    |-- containers/
    |-- middleware/
    |-- reducers/
    |-- store/
    |-- index.html
    |-- index.tsx
|-- types/
|-- dist/
    |-- bundle.js
|-- webpack.config.js
|-- tsconfig.json
|-- package.json
|-- node_modules/
```


where the above directories and files correspond to the following:

- `src/` - Source code
  - `actions/` - Redux actions and creators
  - `components/` - React components
  - `constants/` - Redux actions constants
  - `containers/` - Redux containers for components
  - `middleware/` - Redux middleware
  - `reducers` - Redux reducers
  - `store` - Redux store
  - `index.html` - Html page served up to the client
  - `index.tsx` - Entry point for the javascript code
- `types/` - Custom global interfaces d.ts files for typescript
- `dist/` - Output directory for transpiled code
  - `dist/bundle.js` - Transpiled application
- `webpack.config.js` - Webpack configuration file
- `tsconfig.json` - TypeScript configuration file
- `package.json` - Project configuration file
- `node_modules/` - Where dependencies are installed to

# <a name="setup"></a> Setup
## <a name="step-1"></a> Step 1. Create Project

Create a new directory, `cd` into it and initialize your project via:
```
npm init
```
This will take ask your a series of questions, and will generate a `package.json` file based on how you answer them. You can always update the `package.json` file in the future, so don't feel like you have to configure everything correctly out of the box.


## <a name="step-2"></a> Step 2. Install Dependencies
This section describes how to install all of the required project dependencies using npm.

For every yarn/npm library, there are usually types defined for it in the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) project. Those type can be added by installing `@types/[normal library name]`, where `[normal library name]` is the name of the library.

### <a name="step-2-webpack"></a> [Webpack](https://webpack.js.org/)
We will use webpack to manage the compilation of our TypeScript code. Install webpack, and webpack-dev-server by running:

```
npm install --save webpack webpack-dev-server
```

### <a name="step-2-react"></a> [React](https://facebook.github.io/react/)
Install React with type definitions by running:

```
npm install --save react react-dom @types/react @types/react-dom
```

### <a name="step-2-redux"></a> [Redux](https://facebook.github.io/react/)
Install Redux for usage with react with type definitions by running:

```
npm install --save redux react-redux @types/redux @types/react-redux
```

### <a name="step-2-typescript"></a> [TypeScript](https://www.typescriptlang.org/)
Install TypeScript by running:

```
npm install --save-dev typescript awesome-typescript-loader --dev
```

This project uses `awesome-typescript-loader` for TypeScript compilation. The [TypeScript docs](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) recommend using it. However, [`ts-loader`](https://github.com/TypeStrong/ts-loader) is also mentioned as an alternative. I have not used it, but it may be worth investigating.


### Summary


```json
{
  "name": "Your Project Name",
  "version": "1.0.0",
  "description": "Your Description",
  "main": "index.tsx",
  "author": "Your Name",
  "license": "Your License",
  "scripts": {
    ...
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  }
}

```

The `dependencies` and `devDependencies` sections should be populated by the libraries we just installed.

## <a name="step-3"></a> Step 3. Add Configuration Files
The next step is to add configuration files for Webpack, TypeScript, and Jest.

### <a name="step-3-webpack"></a> Webpack Configuration
Create a `webpack.config.js` file, and update it to look something like this.

```javascript
const path = require('path');
module.exports = {
  entry: './index.tsx',
  output: {
    path: path.resolve('dist'),
    publicPath: "/dist/",
    filename: 'bundle.js'
  },
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    loaders: [
      { test: /\.tsx$/, loader: 'awesome-typescript-loader' },
    ],
  }
}
```
The `webpack.config.js` file defines the entry point for our javascript code to live in `./client/index.tsx`, and specifies that the compiled javascript be placed in `./dist/bundle.js`. The `loaders` section describes how to process different file types. We are informing webpack to use the `awesome-typescript-loader` when processing `.ts` and `.tsx` files.

### <a name="step-3-typescript"></a> TypeScript Configuration
Create a TypeScript configuration file called `tsconfig.json` with the following contents:

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react",
    "noUnusedLocals": true,
    "lib": [
      "es5",
      "es6",
      "dom"
    ]
  },
  "include": [
    "./src/**/*"
  ]
}
```

## <a name="step-4"></a> Step 4. Add HTML Boilerplate
We need to define the base HTML file that our application will live in. I recommend using something simple like the following:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React, Redux and TypeScript Boilerplate</title>
  </head>
  <body>
    <div id="app"> </div>
    <script src="./dist/bundle.js"> </script>
  </body>
</html>
```

Place the above HTML in an `index.html` file in the root of the project. This file includes a `div` where we will load our application, and the compiled `bundle.js` javascript file.

We can add the following script to our `package.json` file to allow us to start a `webpack-dev-server` pointing at the above HTML file. To do this, add the following to the `scripts` section the `package.json` file.

```json
"scripts": {
  "start": "webpack-dev-server --debug --devtool cheap-module-source-map --output-pathinfo --history-api-fallback --hot --inline --progress --colors --port 7000 --open",
  "build": "webpack -p --progress --colors"
}
```

### <a name="build-tools"></a>Build tools

- [x] [Webpack](https://webpack.github.io)
  - [x] [Tree Shaking](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
  - [x] [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- [x] [Awesome Typescript Loader](https://github.com/s-panferov/awesome-typescript-loader)
- [x] [PostCSS Loader](https://github.com/postcss/postcss-loader)
  - [x] [CSS next](https://github.com/MoOx/postcss-cssnext)
  - [x] [CSS modules](https://github.com/css-modules/css-modules)
- [x] [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [x] [ExtractText Plugin](https://github.com/webpack/extract-text-webpack-plugin)
- [x] [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin)

### <a name="use-existing-repository"></a>Steps To Use Existing Repository

## Step1 - Install Dependencies

```
$ npm install
```

## Step2 - Build

```
$ npm run-script build
```

## Step3 - Running

```
$ npm start
```
