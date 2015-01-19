define([
    'modules/jquery-mozu'
  , 'modules/api'
  ]
, function ($, api) {

    function GetSegments(accountId) {
        return api.request('GET', {
            url: '/api/commerce/customer/accounts/' + accountId
        });
    }

    $(document).ready(function () {

        var user = require.mozuData('user');

        //If user has an account, load the segments
        if (!user.isAnonymous) {

            GetSegments(user.accountId).then(function (json) {

                var segmentId = json.segments;

                for(var i = 0; i < json.segments.length; i++) {
                    var obj = json[i];

                    console.log(obj.id); //Don't want to log this, want to do something with it
                }
            });
        }
    });
});