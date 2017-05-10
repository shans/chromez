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
      if self.request.get('site') == 'issues':
          urlfetch.set_default_fetch_deadline(10)
          startIndex = self.request.get('start')
          try:
            startIndex = int(startIndex)
          except:
            startIndex = 0
          self.response.headers.add_header("Access-Control-Allow-Origin", "*")
          result = monorail.issues().list(projectId='chromium', q=self.request.get('q'), can='open',
                                          startIndex=startIndex).execute()
          self.response.write(json.dumps(result))
      elif self.request.get('site') == 'issue':
          urlfetch.set_default_fetch_deadline(10)
          self.response.headers.add_header("Access-Control-Allow-Origin", "*")
          result = monorail.issues().get(projectId='chromium', issueId=self.request.get('issueId')).execute()
          self.response.write(json.dumps(result))
      elif self.request.get('site') == 'comments':
          urlfetch.set_default_fetch_deadline(10)
          self.response.headers.add_header("Access-Control-Allow-Origin", "*")
          result = monorail.issues().comments().list(projectId='chromium', issueId=self.request.get('issueId')).execute()
          self.response.write(json.dumps(result))

app = webapp2.WSGIApplication([
    ('/.*', MainPage),
], debug=True)
