from apiclient.discovery import build
import logging
import webapp2
from google.appengine.api import urlfetch
from google.appengine.api import app_identity
from oauth2client.contrib.appengine import AppAssertionCredentials
from httplib2 import Http
import json

class MainPage(webapp2.RequestHandler):
  def get(self):
      if self.request.get('site') == 'issues':
          url = "https://bugs.chromium.org/p/chromium/issues/csv?"
          for item in self.request.GET.items():
              if item[0] != 'site':
                  url += item[0] +'=' + item[1] + '&'
          scope = 'https://www.googleapis.com/auth/userinfo.email'
          credentials = AppAssertionCredentials(scope)
          http = credentials.authorize(Http())

          DISCOVERY_URL = (
            'https://monorail-prod.appspot.com/_ah/api/discovery/v1/apis/'
            '{api}/{apiVersion}/rest'
          )

          monorail = build(
            'monorail', 'v1',
            discoveryServiceUrl=DISCOVERY_URL,
            http=http
          )

          urlfetch.set_default_fetch_deadline(10)
          self.response.headers.add_header("Access-Control-Allow-Origin", "*")
          result = monorail.issues().list(projectId='chromium', owner=self.request.get('q')[6:], can='open').execute()
          self.response.write(json.dumps(result))

app = webapp2.WSGIApplication([
    ('/.*', MainPage),
], debug=True)
