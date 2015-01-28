// define(['modules/jquery-mozu', 'modules/api', 'hyprlive'], function ($, api, Hypr) {

//     var GetSegments = function(accountId) {
//           return api
//             .request('GET', {
//               url: '/api/commerce/customer/accounts/' + accountId + '/segments/',
//               iframeTransportUrl: 'https://' + window.location.host + '/receiver'
//             })
//             ;
//         };


//     $(document).ready(function () {

//         var user      = require.mozuData('user'),
//             template  = Hypr.getTemplate('pages/protectedContent')
//             ;

//         //If user has an account, load the segments
//         if (!user.isAnonymous) {

//           GetSegments(user.accountId)
//             .then(function (json) {

//               // ... do your data validation/parsing here 
              
//               return segmentData; // this is a JSON object/object literal
//             })
//             .done(function (segmentData) {
//               $('[data-dj-pc-authentication]').html(template.render(segmentData));
//             })
//             ;
//         }
//     });
// });

// This obtains the customer API data. Sadly, it doesn't contain the segment data

// define(['modules/jquery-mozu', 'modules/api'], function ($, api) {

//     function GetCustomerData(accountId) {
//         return api.get('customer', accountId).then(function(customer) {
//             return customer.data;
//         });
//     }

//     $(document).ready(function () {

//         var user = require.mozuData('user');

//         //If user has an account, load the segments
//         if (!user.isAnonymous) {

//             GetCustomerData(user.accountId).then(function (json) {

//                 //load segments and log to make sure things are working
//                 var segmentArray = json.segments;

//                 console.log(segmentArray);

//                 for(var i = 0; i < segmentArray.length; i++) {
//                     var obj = segmentArray[i];

//                     console.log(obj.id); //Don't want to log this, want to do something with it
//                 }
//             });
//         }
//     });
// });


// This is a test of using Backbone to modify the page model. Not working.

// define(['modules/backbone-mozu', 'modules/api', 'underscore', 'modules/jquery-mozu', 'hyprlive'], function (Backbone, api, _, $, Hypr) {

//     var Customer = Backbone.MozuModel.extend({
//         mozuType: 'customer',
//         helpers: ['getCustomerSegments'],
//         getCustomerSegments: function() {
//             return api.get('customer', { id: require.mozuData('user').accountId }).then(function(customer) {
//                 console.log(customer.data.segments);
//                 return customer.data.segments;
//             });
//         }
//     });

//     return {
//         Customer: Customer
//     };
// });