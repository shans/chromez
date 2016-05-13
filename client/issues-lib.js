var priorityString = function(priority) {
  return 'P' + priority;
}

var priorityColor = function(priority) {
  if (priority == 0)
    return '#F44336';
  if (priority == 1)
    return '#FF9800';
  if (priority == 2)
    return '#FFD54F';
  return '#4CAF50';
}

var Issue = function(monorailIssue) {
  this._rawData = monorailIssue;

  this.id = monorailIssue.id;
  this.summary = monorailIssue.summary;
  this.priority = undefined;

  this._lastUpdatedString = monorailIssue.updated;
  this._lastUpdatedMS = Date.parse(this._lastUpdatedString);

  for (var i = 0; i < monorailIssue.labels.length; i++) {
    var label = monorailIssue.labels[i];
    if (label.substring(0, 4) == 'Pri-') {
      this.priority = Number(label.substring(4));
      break;
    }
  }
};

Issue.prototype = {
  daysSinceUpdate: function() {
    return Math.round((Date.now() - this._lastUpdatedMS) / (1000 * 60 * 60 * 24));
  },

  lastUpdated: function() {
    var result = new Date(this._lastUpdatedMS);
    return result.toDateString();
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

  minPriority: function() {
    var minPriority = undefined;
    for (var i = 0; i < this._data.length; i++) {
      var priority = this._data[i].priority;
      if (minPriority == undefined || priority < minPriority) {
        minPriority = priority;
      }
    }
    return minPriority;
  },

  priorityCounts: function() {
    var result = {};
    for (var i = 0; i < this._data.length; i++) {
      var priority = this._data[i].priority
      if (priority in result) {
        result[priority]++;
      } else {
        result[priority] = 1;
      }
    }
    return result;
  },

  outOfUpdateSLOCounts: function(updateSLO) {
    var result = {};
    for (var priority in updateSLO) {
      result[priority] = 0;
    }
    for (var i = 0; i < this._data.length; i++) {
      var issue = this._data[i];
      if (issue.priority in updateSLO && issue.daysSinceUpdate() > updateSLO[issue.priority]) {
        result[issue.priority]++;
      }
    }
    return result;
  },
};
