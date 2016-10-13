(function() {
'use strict';

if (window.Issue) {
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
var _inSLOColor = '#4CAF50';  // Green 500
var _noSLOColor = '#757575';  // Grey 600

// This class uses C style programming with JSON objects (representing issues)
// and static methods.
// This is to maintain the ability to clone the object in chromez-behaviours.js.
class Issue {
  static create({id, owner, summary, lastUpdatedString, labels}) {
    var issue = {
      id,
      owner,
      summary,
      labels,
      priority: undefined,
      _lastUpdatedMS: Date.parse(lastUpdatedString),
      _reviewLevel: _defaultReviewLevel,
    };

    console.assert(!isNaN(issue._lastUpdatedMS), lastUpdatedString + ' invalid format');

    for (var label of labels) {
      if (label.substring(0, 4) == 'Pri-') {
        issue.priority = Number(label.substring(4));
      }
      if (label.substring(0, 7) == 'Update-') {
        var reviewLevel = label.substring(7).toLowerCase();
        if (reviewLevel in _reviewLevelMetadata) {
          issue._reviewLevel = reviewLevel;
        }
      }
    }

    return issue;
  }

  static daysSinceUpdate(issue) {
    return Math.floor((Date.now() - issue._lastUpdatedMS) / (1000 * 60 * 60 * 24));
  }

  static reviewLevelWithBackoff(issue) {
    var result = issue._reviewLevel;
    if (result == _defaultReviewLevel) {
      result += ' (P' + issue.priority + ')';
    }
    return result;
  }

  static summarizeList(issues, updateSLO) {
    var totals = Issue._reviewLevelCounts(issues);
    var outOfSLO = Issue._outOfUpdateSLOCounts(issues, updateSLO);
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

  static _reviewLevelCounts(issues) {
    var result = {};
    for (var issue of issues) {
      var reviewLevel = Issue.reviewLevelWithBackoff(issue);
      if (reviewLevel in result) {
        result[reviewLevel]++;
      } else {
        result[reviewLevel] = 1;
      }
    }
    return result;
  }

  static _outOfUpdateSLOCounts(issues, updateSLO) {
    var result = {};
    for (var reviewLevel in updateSLO) {
      result[reviewLevel] = 0;
    }
    for (var issue of issues) {
      var reviewLevel = Issue.reviewLevelWithBackoff(issue);
      if (reviewLevel in updateSLO && Issue.daysSinceUpdate(issue) >= updateSLO[reviewLevel]) {
        result[reviewLevel]++;
      }
    }
    return result;
  }
}

window.Issue = Issue;

})();
