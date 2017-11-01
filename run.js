var steem = require('steem');
var follower_count, totalSP = 0;

function getSPFollower(name) {
  steem.api.getDynamicGlobalProperties(function(err, result) {
    spv = result.total_vesting_fund_steem.replace(" STEEM", "") / result.total_vesting_shares.replace(" VESTS", "");
    steemPower = spv;
  });

  followers = [];
  steem.api.getFollowCount(name, function(err, result) {
    follower_count = result.follower_count;

    steem.api.getFollowers(name, 0, 'blog', follower_count, function(err, result) {
      for (var j = 0; j < result.length; j++) {
        followers[j] = result[j]['follower'];
      }
      steem.api.getAccounts(followers, function(err, res) {
        for (var j = 0; j < result.length; j++) {
          userTotalVest = parseInt(res[j].vesting_shares.replace(" VESTS", ""))
          - parseInt(res[j].delegated_vesting_shares.replace(" VESTS", ""))
          + parseInt(res[j].received_vesting_shares.replace(" VESTS", ""));

          accountSP = userTotalVest * steemPower;
          console.log(res[j].name, accountSP);

          totalSP += accountSP;
        }

        console.log('Total Follower SP:', totalSP);
        process.exit(1);
      });
    });
  });
}

var myArgs = process.argv.slice(2);
console.log('Getting SP Followers of', myArgs[0]);
getSPFollower(myArgs[0]);
