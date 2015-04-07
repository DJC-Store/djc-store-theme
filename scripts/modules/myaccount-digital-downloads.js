require([
  'modules/jquery-mozu'
, 'underscore'
, 'hyprlive'
, 'modules/api'
], function($, _, Hypr, api) {

  var user      = require.mozuData('user')
    , endpoint  = {
        // segments: 'https://integrations1-hp.mozu.com/customersegmentation/api/asset/list?tenantId={{TENANTID}}&siteId={{SITEID}}&accountId={{ACCOUNTID}}'
        segments: 'https://int1qacs.mozu-qa.com/customersegmentation/api/asset/list?tenantId={{TENANTID}}&siteId={{SITEID}}&accountId={{ACCOUNTID}}'
      }
    ;


  // update segments endpoint with correct data
  endpoint.segments = endpoint.segments
    .replace(/{{ACCOUNTID}}/, user.accountId)
    .replace(/{{TENANTID}}/, api.context.tenant)
    .replace(/{{SITEID}}/, api.context.site)
    ;


  // issue the request
  api
    .request('GET', {
      url: endpoint.segments,
      userClaims: api.context.UserClaims()
    })
    .then(function(data) {
      // console.log('before render...');
      $('[data-mz-container="digital-products"]')
        .html(
          Hypr.engine.renderFile('modules/my-account/my-account-digital-downloads', {
            model: {
              digitalProducts: data
            }
          })
        );
    });

});
