

Install [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python)

Install npm

Install [Bower](http://bower.io/#install-bower)
> npm install -g bower

Install [Polymer](https://www.polymer-project.org/1.0/docs/start/getting-the-code.html)
> bower install --save Polymer/polymer

To run a local instance, from checked out directory:
> dev_appserver.py .

[Additional instructions](https://cloud.google.com/appengine/docs/python/tools/using-local-server)

Make changes, commit, push to origin, create pull request to
[shans/chromez](https://github.com/shans/chromez) and get it merged.

To upload to [App Engine](https://cloud.google.com/appengine/):

 * From the checked out directory run:
   > google_appengine/appcfg.py update -A [you project name].

 * Consoles
   - Project - http://console.developers.google.com/
   - Dashboard - https://console.cloud.google.com/home/dashboard?project=[your project name]

