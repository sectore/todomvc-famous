#TodoMVC + Famo.us

[![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

Unofficial part of <a href="http://todomvc.com">TodoMVC</a> built with <a href="http://famo.us">Famo.us</a>.


##Demo

[Live Demo](http://websector.de/demo/todomvc-famous/)


##Architecture
 
The application is structured using a simple MV* architecture, but without any MV* frameworks and without any DOM library 
such as jQuery. Just "pure" JavaScript.

The communication between all actors (views, models etc.) is based on a simple Pub/Sub (or Observer) pattern using 
the core [Event handling](https://www.famo.us/guides/events) of Famo.us.


##Installation

```bash
git clone https://github.com/sectore/todomvc-famous
cd todomvc-famous
npm install
bower install
```

##Build

The application is built by using [webpack](http://webpack.github.io/).


### Development

For continuous incremental build run:
 
```bash
npm run dev
```

Open [Chrome](https://www.google.com/chrome/browser/):

[http://localhost:8080/webpack-dev-server/index.html](http://localhost:8080/webpack-dev-server/index.html)



### Production

For building a production (minification) version run:

```bash
npm run prod
```


## Contributors

Any contribution are very welcome! Let's change this unofficial part of TodoMVC to an official ;)


## Credits:

- [famous-webpack-seed](https://github.com/AdrianRossouw/famous-webpack-seed) (by [AdrianRossouw](https://github.com/AdrianRossouw/)): Seed project for running webpack + Famo.us 
- [famous-webpack-seed](https://github.com/markmarijnissen/famous-webpack-seed) (by [markmarijnissen](https://github.com/markmarijnissen)): Another - more complex - seed project for running webpack + Famo.us


## Changelog

Check [CHANGELOG.md](./CHANGELOG.md)


## License

Copyright (c) 2014 Jens Krause. Licensed under the [MIT license](./LICENSE.md).

[travis-url]: https://travis-ci.org/sectore/todomvc-famous
[travis-image]: https://travis-ci.org/sectore/todomvc-famous.svg?branch=master
[daviddm-url]: https://david-dm.org/sectore/todomvc-famous.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/sectore/todomvc-famous