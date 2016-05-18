# chromez

Dashboard for displaying status for Chrome developers.

## Setup

Install [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python)

Install [npm and nodejs](https://nodejs.org/en/)
```shell
wget https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
tar -xvf node-v4.4.4-linux-x64.tar.xz
export PATH=$PATH:$PWD/node-v4.4.4-linux-x64/bin
```

Install [Bower](http://bower.io/#install-bower)
```shell
npm install -g bower
```

Install [Polymer](https://www.polymer-project.org/1.0/docs/start/getting-the-code.html)
```shell
bower install
```

## Running

 1) To run a local instance, go into the directory and run
([Additional instructions](https://cloud.google.com/appengine/docs/python/tools/using-local-server)):
```shell
dev_appserver.py .
```

 2) Go to http://localhost:8080/

 3) Type into the box the configuration such as `configs/animations-ave.json` or `configs/blink.json`

## Contributing

Make changes, commit, push to origin, create pull request to
[shans/chromez](https://github.com/shans/chromez) and get it merged.

## Deploying

To upload to [App Engine](https://cloud.google.com/appengine/):

 * From the checked out directory run:
   ```shell
appcfg.py update -A [you project name] .
```

 * Consoles
   - Project - http://console.developers.google.com/
   - Dashboard - https://console.cloud.google.com/home/dashboard?project=[your project name]

