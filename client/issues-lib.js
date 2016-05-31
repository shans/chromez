(function() {

if (window.Issue && window.IssueList) {
  return;
}

var _reviewLevelMetadata = {
  'daily': {
    query: {label: 'Update-daily'},
    color: '#F44336',  // red
  },
  'weekly': {
    query: {label: 'Update-weekly'},
    color: '#FF9800',  // orange
  },
  'fortnightly': {
    query: {label: 'Update-fortnightly'},
    color: '#FFD54F',  // yellow
  },
  'monthly': {
    query: {label: 'Update-monthly'},
    color: '#4CAF50',  // green
  },
  'quarterly': {
    query: {label: 'Update-quarterly'},
  },
  'none (P0)': {
    query: {label: 'Pri-0', '-has': 'update'},
  },
  'none (P1)': {
    query: {label: 'Pri-1', '-has': 'update'},
  },
  'none (P2)': {
    query: {label: 'Pri-2', '-has': 'update'},
  },
  'none (P3)': {
    query: {label: 'Pri-3', '-has': 'update'},
  },
};
var _defaultReviewLevel = 'none';
var _defaultReviewLevelColor = '#999999';  // gray

var Issue = function(monorailIssue) {
  this._rawData = monorailIssue;

  this.id = monorailIssue.id;
  this.summary = monorailIssue.summary;
  this.priority = undefined;
  this._reviewLevel = _defaultReviewLevel;

  this._lastUpdatedString = monorailIssue.updated;
  this._lastUpdatedMS = Date.parse(this._lastUpdatedString);

  for (var i = 0; i < monorailIssue.labels.length; i++) {
    var label = monorailIssue.labels[i];
    if (label.substring(0, 4) == 'Pri-') {
      this.priority = Number(label.substring(4));
    }
    if (label.substring(0, 7) == 'Update-') {
      var reviewLevel = label.substring(7).toLowerCase();
      if (reviewLevel in _reviewLevelMetadata) {
        this._reviewLevel = reviewLevel;
      }
    }
  }
};

Issue.prototype = {
  daysSinceUpdate: function() {
    return Math.floor((Date.now() - this._lastUpdatedMS) / (1000 * 60 * 60 * 24));
  },

  lastUpdated: function() {
    var result = new Date(this._lastUpdatedMS);
    return result.toDateString();
  },

  reviewLevelWithBackoff: function() {
    var result = this._reviewLevel;
    if (result == _defaultReviewLevel) {
      result += ' (P' + this.priority + ')';
    }
    return result;
  },
};

var IssueList = function() {
  this._data = [];
};

IssueList.prototype = {
  append: function(issue) {
    this._data.push(issue);
  },

  length: function() {
    return this._data.length;
  },

  _reviewLevelCounts: function() {
    var result = {};
    for (var i = 0; i < this._data.length; i++) {
      var reviewLevel = this._data[i].reviewLevelWithBackoff();
      if (reviewLevel in result) {
        result[reviewLevel]++;
      } else {
        result[reviewLevel] = 1;
      }
    }
    return result;
  },

  _outOfUpdateSLOCounts: function(updateSLO) {
    var result = {};
    for (var reviewLevel in updateSLO) {
      result[reviewLevel] = 0;
    }
    for (var i = 0; i < this._data.length; i++) {
      var issue = this._data[i];
      var reviewLevel = issue.reviewLevelWithBackoff();
      if (reviewLevel in updateSLO && issue.daysSinceUpdate() >= updateSLO[reviewLevel]) {
        result[reviewLevel]++;
      }
    }
    return result;
  },

  summary: function(updateSLO) {
    var totals = this._reviewLevelCounts();
    var outOfSLO = this._outOfUpdateSLOCounts(updateSLO);
    var results = [];
    for (var level in _reviewLevelMetadata) {
      var metadata = _reviewLevelMetadata[level];
      if (level in totals) {
        var levelSummary = totals[level].toString();
        if (level in outOfSLO && outOfSLO[level] > 0) {
          levelSummary += ' (' + outOfSLO[level] + ' out of SLO)';
        }
        results.push({
          level: level,
          color: metadata.color || _defaultReviewLevelColor,
          query: metadata.query,
          summary: levelSummary,
        });
      }
    }
    return results;
  },
};

window.Issue = Issue;
window.IssueList = IssueList;

})();
