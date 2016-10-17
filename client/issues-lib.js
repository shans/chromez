(function() {
'use strict';

if (window.Issue && window.IssueList) {
  return;
}

// Colours are copied from:
// https://www.google.com/design/spec/style/color.html#color-color-palette
var _reviewLevelMetadata = {
  'daily': {
    query: {label: 'Update-Daily'},
    outOfSLOColor: '#B71C1C',  // Red 900
  },
  'weekly': {
    query: {label: 'Update-Weekly'},
    outOfSLOColor: '#C62828',  // Red 800
  },
  'fortnightly': {
    query: {label: 'Update-Fortnightly'},
    outOfSLOColor: '#D32F2F',  // Red 700
  },
  'monthly': {
    query: {label: 'Update-Monthly'},
    outOfSLOColor: '#E53935',  // Red 600
  },
  'quarterly': {
    query: {label: 'Update-Quarterly'},
    outOfSLOColor: '#F44336',  // Red 500
  },
  'none (P0)': {
    query: {label: 'Pri-0', '-has': 'Update'},
  },
  'none (P1)': {
    query: {label: 'Pri-1', '-has': 'Update'},
  },
  'none (P2)': {
    query: {label: 'Pri-2', '-has': 'Update'},
  },
  'none (P3)': {
    query: {label: 'Pri-3', '-has': 'Update'},
  },
};
var _defaultReviewLevel = 'none';
var _inSLOColor = '#4CAF50';  // Green 500
var _noSLOColor = '#757575';  // Grey 600

class Issue {
  constructor(params) {
    // Copy constructor
    if (params instanceof Issue) {
      Object.assign(this, params);
      this.labels = Array.from(this.labels);
      return;
    }

    // Regular constructor.
    var {id, owner, summary, lastUpdatedString, labels} = params;
    Object.assign(this, {
      id,
      owner,
      summary,
      labels,
      priority: undefined,
      _lastUpdatedMS: Date.parse(lastUpdatedString),
      _reviewLevel: _defaultReviewLevel,
    });

    console.assert(!isNaN(this._lastUpdatedMS), lastUpdatedString + ' invalid format');

    for (var label of this.labels) {
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
  }

  clone() {
    return new Issue(this);
  }

  daysSinceUpdate() {
    return Math.floor((Date.now() - this._lastUpdatedMS) / (1000 * 60 * 60 * 24));
  }

  reviewLevelWithBackoff() {
    var result = this._reviewLevel;
    if (result == _defaultReviewLevel) {
      result += ' (P' + this.priority + ')';
    }
    return result;
  }
}

class IssueList {
  constructor(issues = []) {
    for (var issue of issues) {
      console.assert(issue instanceof Issue);
    }
    this._issues = issues;
  }

  clone() {
    return new IssueList(this._issues.map(issue => issue.clone()));
  }

  push(issue) {
    console.assert(issue instanceof Issue);
    this._issues.push(issue);
  }

  get length() {
    return this._issues.length;
  }

  [Symbol.iterator]() {
    return this._issues[Symbol.iterator]();
  }

  _reviewLevelCounts() {
    var result = {};
    for (var issue of this._issues) {
      var reviewLevel = issue.reviewLevelWithBackoff(issue);
      if (reviewLevel in result) {
        result[reviewLevel]++;
      } else {
        result[reviewLevel] = 1;
      }
    }
    return result;
  }

  _outOfUpdateSLOCounts(updateSLO) {
    var result = {};
    for (var reviewLevel in updateSLO) {
      result[reviewLevel] = 0;
    }
    for (var issue of this._issues) {
      var reviewLevel = issue.reviewLevelWithBackoff();
      if (reviewLevel in updateSLO && issue.daysSinceUpdate() >= updateSLO[reviewLevel]) {
        result[reviewLevel]++;
      }
    }
    return result;
  }

  summary(updateSLO) {
    var totals = this._reviewLevelCounts(this._issues);
    var outOfSLO = this._outOfUpdateSLOCounts(this._issues, updateSLO);
    var results = [];
    for (var level in _reviewLevelMetadata) {
      var metadata = _reviewLevelMetadata[level];
      if (level in totals) {
        var color = (level in updateSLO) ? _inSLOColor : _noSLOColor;
        var levelSummary = totals[level].toString();
        if (level in outOfSLO && outOfSLO[level] > 0) {
          color = metadata.outOfSLOColor;
          levelSummary += ' (' + outOfSLO[level] + ' out of SLO)';
        }
        results.push({
          level: level,
          color: color,
          query: metadata.query,
          summary: levelSummary,
        });
      }
    }
    return results;
  }
}

window.Issue = Issue;
window.IssueList = IssueList;

})();
