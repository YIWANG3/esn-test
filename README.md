[![BCH compliance](https://bettercodehub.com/edge/badge/cmusv-fse/f19-ESN-SB2?branch=master&token=ec3c9a3d44156002dd5e4debeec0dbbf05bebdbb)](https://bettercodehub.com/)

[![Maintainability](https://api.codeclimate.com/v1/badges/dac6b348ac82979bd235/maintainability)](https://codeclimate.com/repos/5d9be414914c0a01790082c9/maintainability)

# FSE SB2 ESN Project
## About
* A Single Page Application based on hash
* Vanilla JS(No Vue, Angular, React, JQuery)

## Documents
* [Architecture Haiku](https://drive.google.com/open?id=1XvmNesWl7x0G3_e_yFWfrFfvacbbHwhM)
* [OOA/UML Diagram](https://drive.google.com/drive/folders/1JonuDBP1Gf3wSTkMVeVivOKOA34FsPI0?usp=sharing)
* [Rest API](https://documenter.getpostman.com/view/3161844/SVn2PbnT?version=latest) 
* [Quality Report](https://docs.google.com/spreadsheets/d/10x1RHufcKx3DV2VFiztSRqnD0doYwRJ4EzPV5T2iI8Q/edit?usp=sharing)

## How to run the project
Install all packages
```
npm install
```
Start express server
```
npm run watch
```
Start front-end resource server (support hot module reload)
```
npm start
```
Build front-end resource to deploy (no need when develop)
```
npm run build
```
Open localhost:3000 in browser

## Code Structure
```
.
├── README.md
├── dist
│   ├── app.js
│   └── index.html
├── index.html              Main Page
├── package-lock.json
├── package.json
├── server                  Express Server
│   └── index.js
├── src                     All Front-end Resource
│   ├── index.js            Front-end main 
│   ├── index.less          All Style
│   ├── js                  js functions
│   │   ├── serverInfo.js
│   │   ├── initRouter.js
│   │   └── register.js
│   └── view                Different Pages
│       ├── about.html
│       ├── chatList.html
│       ├── error.html
│       ├── login.html
│       └── register.html
├── webpack-dev-server.js   Webpack dev server config
└── webpack.config.js       Webpack config
```

## Notes
1. Keep *.html pure, do not bind eventListener in *.html or add stylesheet, the webpack loader do not support this, please refer to js/register.js to see how to bind eventListener
2. You can use Less (http://lesscss.org/) to write stylesheet:
3. We use Navigo (https://github.com/krasimir/navigo#readme) as our router library, if you want to add a new page, please see examples in index.js
4. You can use import and require in front-end, in node server side, you can only use require.
5. If you want to learn more about webpack, you can read the guides (https://webpack.js.org/guides/)
