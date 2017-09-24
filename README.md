Boilerplate and guide for a React with TypeScript.

**Lay out the project**

Let’s start out with a new directory. We’ll name it react-typescript-sample for now, but you can change it to whatever you want.

    mkdir react-typescript-sample
    cd react-typescript-sample

To start, we’re going to structure our project in the following way:

    react-typescript-sample/
    ├─ dist/
    └─ src/
       └─ components/

TypeScript files will start out in your src folder, run through the TypeScript compiler, then webpack, and end up in a bundle.js file in dist. Any components that we write will go in the src/components folder.

Webpack will eventually generate the dist directory for us.

**Initialize the project**

Now we’ll turn this folder into an npm package.

    npm init

You’ll be given a series of prompts. You can use the defaults except for your entry point. You can always go back and change these in the package.json file that’s been generated for you.

**Install our dependencies**

First ensure Webpack is installed globally.

    npm install -g webpack

Webpack is a tool that will bundle your code and optionally all of its dependencies into a single .js file.

Let’s now add React and React-DOM, along with their declaration files, as dependencies to your package.json file:

    npm install --save react react-dom @types/react @types/react-dom

    npm install --save webpack webpack-dev-server @types/node @types/webpack @types/webpack-env


That @types/ prefix means that we also want to get the declaration files for React and React-DOM. Usually when you import a path like "react", it will look inside of the react package itself; however, not all packages include declaration files, so TypeScript also looks in the @types/react package as well. You’ll see that we won’t even have to think about this later on.

Next, we’ll add development-time dependencies on awesome-typescript-loader and source-map-loader.

    npm install --save-dev typescript awesome-typescript-loader source-map-loader

Both of these dependencies will let TypeScript and webpack play well together. awesome-typescript-loader helps Webpack compile your TypeScript code using the TypeScript’s standard configuration file named tsconfig.json. source-map-loader uses any sourcemap outputs from TypeScript to inform webpack when generating its own sourcemaps. This will allow you to debug your final output file as if you were debugging your original TypeScript source code.

**Add a TypeScript configuration file**

You’ll want to bring your TypeScript files together - both the code you’ll be writing as well as any necessary declaration files.

To do this, you’ll need to create a tsconfig.json which contains a list of your input files as well as all your compilation settings. Simply create a new file in your project root named tsconfig.json and fill it with the following contents:

    {
        "compilerOptions": {
            "outDir": "./dist/",
            "sourceMap": true,
            "noImplicitAny": true,
            "module": "commonjs",
            "target": "es5",
            "jsx": "react"
        },
        "include": [
            "./src/**/*"
        ]
    }

**Write some sample code**

Let’s write our first TypeScript file using React. First, create a file named Hello.tsx in src/components and write the following:

      import * as React from "react";

      export interface HelloProps { compiler: string; framework: string; }

      // 'HelloProps' describes the shape of props.
      // State is never set so we use the 'undefined' type.
      export class Hello extends React.Component<HelloProps, undefined> {
          render() {
              return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
          }
      }

We’ll also need a page to display our Hello component. Create a file at the dist of react-typescript-sample named index.html with the following contents:

      <!DOCTYPE html>
      <html>
        <head>
          <meta charset=utf-8>
          <title>React-Typescript-Application</title>
        </head>
        <body>
          <div id=root></div>
          <script type="text/javascript" src="/bundle.js"></script>
        </body>
      </html>

**Create a webpack configuration file**

Create a webpack.config.js file at the root of the project directory.

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};

**Build Application**

    npm run-script build;

**Run Application**

    npm start

Browse the following url in Browser

http://localhost:7000/


----------
