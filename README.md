# Elovalo Webide

Elovalo Webide makes it possible to write effects for the [Elovalo](http://www.elovalo.org) led cube using a simple web based interface. It provides WebGL based visualization and an interactive editor. There is also a Git based revisioning system.

[Demo](https://www.youtube.com/watch?v=p4sAIj8a5V4)

## Dependencies

You'll need a recent version of [Node.js](http://nodejs.org/), [Git](http://gitscm.org/) and [Bower](https://github.com/twitter/bower) at least. Once you have these installed follow the instructions below:

1. `git clone git@github.com:elovalo/webidefx.git` to parent directory
2. `sudo npm install`
3. `bower install`
4. copy `example.conf.json` as `conf.json` and adjust accordingly
5. `grunt` at project root

Make sure you have installed [LiveReload browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) to get most benefit out of the setup!

## Authentication

The system uses GitHub OAuth. If you want to give it a go, [register your application](https://github.com/settings/applications) and update the GitHub configuration at `conf.json` accordingly.

If you enable `dev` at configuration it will use a very simple "authentication" scheme suitable for testing.

## Deployment

Fill in conf.json (do not commit!) and add necessary details there.

## License

Elovalo Webide is available under MIT. See LICENSE for more details.
