import webapp2
from google.appengine.api import urlfetch

class MainPage(webapp2.RequestHandler):
  def get(self):
      if self.request.get('site') == 'issues':
          url = "http://code.google.com/p/chromium/issues/csv?"
          for item in self.request.GET.items():
              if item[0] != 'site':
                  url += item[0] +'=' + item[1] + '&'
          result = urlfetch.fetch(url[:-1]);
          self.response.write(result.content);
      else:
          self.response.write('no');
app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
