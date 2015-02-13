define("modules/models-checkout",["modules/jquery-mozu","underscore","hyprlive","modules/backbone-mozu","modules/api","modules/models-customer","modules/models-address","modules/models-paymentmethods","hyprlivecontext"],function(e,t,i,n,a,r,o,s,d){var l=n.MozuModel.extend({helpers:["stepStatus","requiresFulfillmentInfo","requiresDigitalFulfillmentContact"],initStep:function(){var e=this;this.next=function(i){return t.debounce(function(){e.isLoading()||i.call(e)},750,!0)}(this.next);var i=e.getOrder();e.calculateStepStatus(),e.listenTo(i,"error",function(){e.isLoading()&&e.isLoading(!1)}),e.set("orderId",i.id),e.apiModel&&e.apiModel.on("action",function(t,n){n?n.orderId=i.id:e.apiModel.prop("orderId",i.id)})},calculateStepStatus:function(){var e=this.isValid(!this.stepStatus())?"complete":"invalid";return this.stepStatus(e)},getOrder:function(){return this.parent},stepStatus:function(e){return arguments.length>0&&(this._stepStatus=e,this.trigger("stepstatuschange",e)),this._stepStatus},requiresFulfillmentInfo:function(){return this.getOrder().get("requiresFulfillmentInfo")},requiresDigitalFulfillmentContact:function(){return this.getOrder().get("requiresDigitalFulfillmentContact")},edit:function(){this.stepStatus("incomplete")},next:function(){this.submit()&&this.isLoading(!0)}}),c=l.extend({relations:r.Contact.prototype.relations,validation:r.Contact.prototype.validation,digitalOnlyValidation:{email:{pattern:"email",msg:i.getLabel("emailMissing")}},dataTypes:{contactId:function(e){return"new"===e?e:n.MozuModel.DataTypes.Int(e)}},helpers:["contacts"],contacts:function(){var e=this.getOrder().get("customer").get("contacts").toJSON();return e&&e.length>0&&e},initialize:function(){this.on("change:contactId",function(e,t){t&&"new"!==t?e.set(e.getOrder().get("customer").get("contacts").get(t).toJSON()):(e.get("address").clear(),e.get("phoneNumbers").clear(),e.unset("id"),e.unset("firstName"),e.unset("lastNameOrSurname"))})},calculateStepStatus:function(){return!this.requiresFulfillmentInfo()&&this.requiresDigitalFulfillmentContact()&&(this.validation=this.digitalOnlyValidation),this.requiresFulfillmentInfo()||this.requiresDigitalFulfillmentContact()?l.prototype.calculateStepStatus.apply(this):this.stepStatus("complete")},getOrder:function(){return this.parent.parent},choose:function(t){var i=parseInt(e(t.currentTarget).val(),10);if(-1!==i){var n=this.get("address"),a=n.get("candidateValidatedAddresses")[i];for(var r in a)n.set(r,a[r])}},toJSON:function(){return this.requiresFulfillmentInfo()||this.requiresDigitalFulfillmentContact()?l.prototype.toJSON.apply(this,arguments):void 0},isDigitalValid:function(){var e=this.get("email");return e?!0:!1},nextDigitalOnly:function(){var e=this.getOrder(),t=this;return this.validate()?!1:(this.getOrder().apiModel.update({fulfillmentInfo:t.toJSON()}).ensure(function(){return t.provisional=!1,t.isLoading(!1),e.messages.reset(),e.syncApiModel(),t.calculateStepStatus(),e.get("billingInfo").calculateStepStatus()}),void 0)},next:function(){if(!this.requiresFulfillmentInfo()&&this.requiresDigitalFulfillmentContact())return this.nextDigitalOnly();if(this.validate())return!1;var e=this.parent,n=this.getOrder(),a=this,r=d.locals.siteContext.generalSettings.isAddressValidationEnabled,o=d.locals.siteContext.generalSettings.allowInvalidAddresses;this.isLoading(!0);var s=this.get("address"),l=function(){n.messages.reset(),n.syncApiModel(),a.isLoading(!0),n.apiModel.getShippingMethodsFromContact().then(function(t){return e.refreshShippingMethods(t)}).ensure(function(){s.set("candidateValidatedAddresses",null),a.isLoading(!1),e.isLoading(!1),a.calculateStepStatus(),e.calculateStepStatus()})},c=function(){n.syncApiModel(),a.isLoading(!1),e.isLoading(!1),a.stepStatus("invalid")};if(r)if(s.get("candidateValidatedAddresses"))l();else{var u=o?"validateAddressLenient":"validateAddress";s.apiModel[u]().then(function(e){if(e.data&&e.data.addressCandidates&&e.data.addressCandidates.length){if(t.find(e.data.addressCandidates,s.is,s))return s.set("isValidated",!0),l(),void 0;s.set("candidateValidatedAddresses",e.data.addressCandidates),c()}else l()},function(){o?(n.messages.reset(),l()):n.messages.reset({message:i.getLabel("addressValidationError")})})}else l()}}),u=l.extend({initialize:function(){var e=this;this.updateShippingMethod(this.get("shippingMethodCode")),t.defer(function(){e.refreshShippingMethods(e.get("availableShippingMethods"))}),this.on("change:availableShippingMethods",function(e){e.updateShippingMethod(e.get("shippingMethodCode")),e.refreshShippingMethods(e.get("availableShippingMethods"))})},relations:{fulfillmentContact:c},validation:{shippingMethodCode:{required:!0,msg:i.getLabel("chooseShippingMethod")}},refreshShippingMethods:function(e){e=!this.digitalOnly()&&this.getOrder()?t.reject(e,function(e){return e.shippingMethodName.match(/digital/gi)}):t.filter(e,function(e){return e.shippingMethodName.match(/digital/gi)}),t.defer(this.set({availableShippingMethods:e})),t.each(["shippingMethodCode","shippingMethodName"],this.unset,this)},calculateStepStatus:function(){var e;return this.requiresFulfillmentInfo()?this.provisional?this.stepStatus("incomplete"):"complete"!==this.get("fulfillmentContact").stepStatus()?this.stepStatus("new"):(e=this.get("availableShippingMethods"),e&&e.length&&t.findWhere(e,{shippingMethodCode:this.get("shippingMethodCode")})?this.stepStatus("complete"):this.stepStatus("incomplete")):this.stepStatus("complete")},digitalOnly:function(){return this.getOrder()?t.every(this.getOrder().get("items"),function(e){return t.some(e.product.properties,function(e){return"Tenant~digital-product"===e.attributeFQN&&e.values[0].value===!0})}):!1},updateShippingMethod:function(e){var i=this.get("availableShippingMethods"),n=t.findWhere(i,{shippingMethodCode:e});!n&&i&&i[0]&&(n=i[0],this.provisional=!0),n&&this.set(n)},next:function(){if(this.validate())return!1;var e=this;this.isLoading(!0),this.getOrder().apiModel.update({fulfillmentInfo:e.toJSON()}).ensure(function(){e.provisional=!1,e.isLoading(!1),e.calculateStepStatus(),e.parent.get("billingInfo").calculateStepStatus()})}}),g=l.extend({mozuType:"payment",validation:{paymentType:{required:!0,msg:i.getLabel("paymentTypeMissing")},"billingContact.email":{pattern:"email",msg:i.getLabel("emailMissing")}},dataTypes:{isSameBillingShippingAddress:n.MozuModel.DataTypes.Boolean,creditAmountToApply:n.MozuModel.DataTypes.Float},relations:{billingContact:r.Contact,card:s.CreditCard,check:s.Check},helpers:["acceptsMarketing","savedPaymentMethods","availableStoreCredits","applyingCredit","maxCreditAmountToApply","activeStoreCredits","nonStoreCreditTotal","activePayments","availableDigitalCredits","digitalCreditPaymentTotal","isAnonymousShopper"],acceptsMarketing:function(){return this.getOrder().get("acceptsMarketing")},activePayments:function(){return this.getOrder().apiModel.getActivePayments()},nonStoreCreditTotal:function(){var e,i=this,n=this.getOrder(),a=n.get("total"),r=this.activeStoreCredits();return r?(e=a-t.reduce(r,function(e,t){return e+t.amountRequested},0),i.roundToPlaces(e,2)):a},savedPaymentMethods:function(){var e=this.getOrder().get("customer").get("cards").toJSON();return e&&e.length>0&&e},activeStoreCredits:function(){var e=this.getOrder().apiModel.getActiveStoreCredits();return e&&e.length>0&&e},availableStoreCredits:function(){var e=this.getOrder(),i=e.get("customer"),n=i&&i.get("credits"),a=this.activeStoreCredits(),r=n&&t.compact(t.map(n.models,function(e){return"StoreCredit"!==e.creditType&&"GiftCard"!==e.creditType?!1:(e=t.clone(e),a&&t.each(a,function(t){t.billingInfo.storeCreditCode===e.code&&(e.currentBalance-=t.amountRequested)}),e.currentBalance>0?e:!1)}));return r&&r.length>0&&r},applyingCredit:function(){return this._applyingCredit},maxCreditAmountToApply:function(){var e=this.getOrder(),t=e.get("amountRemainingForPayment"),i=this.applyingCredit();return i?Math.min(i.currentBalance,t).toFixed(2):void 0},beginApplyCredit:function(){var e=this.get("selectedCredit");if(this._oldPaymentType=this.get("paymentType"),e){var i=t.findWhere(this.availableStoreCredits(),{code:e});i&&(this._applyingCredit=i,this.set("creditAmountToApply",this.maxCreditAmountToApply()))}},closeApplyCredit:function(){delete this._applyingCredit,this.unset("selectedCredit"),this.set("paymentType",this._oldPaymentType)},finishApplyCredit:function(){var e=this.getOrder(),t=e.apiModel.getCurrentPayment();return t?e.apiVoidPayment(t.id).then(this.addStoreCredit):this.addStoreCredit()},addStoreCredit:function(){var e=this,t=e.getOrder();return t.apiAddStoreCredit({storeCreditCode:this.get("selectedCredit"),amount:this.get("creditAmountToApply")}).then(function(i){return t.set(i.data),e.closeApplyCredit(),i})},onCreditAmountChanged:function(e,t){this.applyDigitalCredit(e.get("code"),t)},loadCustomerDigitalCredits:function(){var e=this,i=this.getOrder(),n=i.get("customer"),a=this.activeStoreCredits(),r=n.get("credits");if(r&&r.length>0){var o=new Date,s=new Date(2076,6,4),d=r.filter(function(e){var t=e.get("currentBalance"),i=e.get("expirationDate"),n=i?new Date(i):s;return!t||0>=t||o>n});t.each(d,function(e){r.remove(e)})}if(e._cachedDigitalCredits=r,a){var l=t.filter(a,function(t){var i=e._cachedDigitalCredits.findWhere({code:t.billingInfo.storeCreditCode});return i?(i.set("isEnabled",!0),i.set("creditAmountApplied",t.amountRequested),i.set("remainingBalance",i.calculateRemainingBalance()),!1):!0});l&&this.convertPaymentsToDigitalCredits(l,n)}},convertPaymentsToDigitalCredits:function(e,i){var n=this;t.each(e,function(e){var t=e;return n.retrieveDigitalCredit(i,t.billingInfo.storeCreditCode,n,t.amountRequested).then(function(e){return n.trigger("orderPayment",n.getOrder().data,n),e})})},availableDigitalCredits:function(){return this._cachedDigitalCredits||this.loadCustomerDigitalCredits(),this._cachedDigitalCredits&&this._cachedDigitalCredits.length>0&&this._cachedDigitalCredits},applyDigitalCredit:function(e,n,r){var o=this,s=o.getOrder(),d=null;this._oldPaymentType=this.get("paymentType");var l=this._cachedDigitalCredits.filter(function(t){return t.get("code")===e});if(!l||0===l.length)return o.deferredError(i.getLabel("digitalCodeAlreadyUsed",e),o);l=l[0];var c=l.get("creditAmountApplied"),u=l.get("isEnabled");n||0===n||(n=o.getMaxCreditToApply(l,o)),l.set("creditAmountApplied",n),l.set("remainingBalance",l.calculateRemainingBalance()),l.set("isEnabled",r),n>0&&(n=o.roundToPlaces(n,2));var g=this.activeStoreCredits();if(g){var p=t.find(g,function(t){return"Voided"!==t.status&&t.billingInfo&&t.billingInfo.storeCreditCode===e});if(p){if(this.areNumbersEqual(p.amountRequested,n)){var h=a.defer();return h.reject(),h.promise}return 0===n?s.apiVoidPayment(p.id).then(function(e){return s.set(e.data),o.trigger("orderPayment",e.data,o),e}):(d=o.getMaxCreditToApply(l,o,p.amountRequested),n>d?(l.set("creditAmountApplied",c),l.set("isEnabled",u),l.set("remainingBalance",l.calculateRemainingBalance()),o.deferredError(i.getLabel("digitalCreditExceedsBalance"),o)):s.apiVoidPayment(p.id).then(function(t){return s.set(t.data),s.apiAddStoreCredit({storeCreditCode:e,amount:n}).then(function(e){return s.set(e.data),o.trigger("orderPayment",e.data,o),e})}))}}return 0===n?this.getOrder():(d=o.getMaxCreditToApply(l,o),n>d?(l.set("creditAmountApplied",c),l.set("remainingBalance",l.calculateRemainingBalance()),l.set("isEnabled",u),o.deferredError(i.getLabel("digitalCreditExceedsBalance"),o)):s.apiAddStoreCredit({storeCreditCode:e,amount:n}).then(function(e){return s.set(e.data),o.trigger("orderPayment",e.data,o),e}))},deferredError:function(e,t){t.trigger("error",{message:e});var i=a.defer();return i.reject(),i.promise},areNumbersEqual:function(e,t){var i=.01;return Math.abs(e-t)<i},retrieveDigitalCredit:function(e,t,n,a){var r=this;return e.apiGetDigitalCredit(t).then(function(e){var o=new s.DigitalCredit(e.data);o.set("isTiedToCustomer",!1);var d=function(){var e=new Date,t=o.get("activationDate")?new Date(o.get("activationDate")):null,n=o.get("expirationDate")?new Date(o.get("expirationDate")):null;return n&&e>n?r.deferredError(i.getLabel("expiredCredit",n.toLocaleDateString()),r):t&&t>e?r.deferredError(i.getLabel("digitalCreditNotYetActive",t.toLocaleDateString()),r):!o.get("currentBalance")||o.get("currentBalance")<=0?r.deferredError(i.getLabel("digitalCreditNoRemainingFunds"),r):null},l=d();if(null!==l)return null;var c=n.getMaxCreditToApply(o,n,a);return a&&c>a&&(c=a),o.set("creditAmountApplied",c),o.set("remainingBalance",o.calculateRemainingBalance()),o.set("isEnabled",!0),n._cachedDigitalCredits.push(o),n.applyDigitalCredit(t,c,!0),n.trigger("sync",o),o})},getDigitalCredit:function(){var e=this,t=e.getOrder(),n=t.get("customer"),r=this.get("digitalCreditCode"),o=this._cachedDigitalCredits.filter(function(e){return e.get("code")===r});if(o&&o.length>0){e.trigger("error",{message:i.getLabel("digitalCodeAlreadyUsed",r)});var s=a.defer();return s.reject(),s.promise}return e.isLoading(!0),e.retrieveDigitalCredit(n,r,e).then(function(){return e.isLoading(!1),e})},getMaxCreditToApply:function(e,t,i){var n=t.nonStoreCreditTotal();i&&(n+=i);var a=n<e.get("currentBalance")?n:e.get("currentBalance");return t.roundToPlaces(a,2)},roundToPlaces:function(e,t){var i=Math.pow(10,t);return Math.round(e*i)/i},digitalCreditPaymentTotal:function(){var e=this.activeStoreCredits();return e?t.reduce(e,function(e,t){return e+t.amountRequested},0):null},addRemainingCreditToCustomerAccount:function(e,t){var n=this,a=n._cachedDigitalCredits.findWhere({code:e});return a?(a.set("addRemainderToCustomer",t),a):n.deferredError(i.getLabel("genericNotFound"),n)},getDigitalCreditsToAddToCustomerAccount:function(){return this._cachedDigitalCredits.where({isEnabled:!0,addRemainderToCustomer:!0,isTiedToCustomer:!1})},isAnonymousShopper:function(){var e=this.getOrder(),t=e.get("customer");return!t||!t.id||t.id<=1},removeCredit:function(e){var t=this.getOrder(),i=t.apiModel.getCurrentPayment();return i&&t.apiVoidPayment(i.id),this.getOrder().apiVoidPayment(e)},syncPaymentMethod:function(e,t){t&&"new"!==t?e.setSavedPaymentMethod(t):(e.get("billingContact").clear(),e.get("card").clear(),e.get("check").clear(),e.unset("paymentType"))},setSavedPaymentMethod:function(e){var t=this,i=t.getOrder().get("customer"),n=i.get("cards").get(e),a=n&&i.get("contacts").get(n.get("contactId"));n&&(t.get("billingContact").set(a.toJSON()),t.get("card").set(n.toJSON()),t.set("paymentType","CreditCard"))},getPaymentTypeFromCurrentPayment:function(){var e=this.get("paymentType"),t=this.getOrder().apiModel.getCurrentPayment(),i=t&&t.billingInfo.paymentType;i&&i!==e&&this.set("paymentType",i)},edit:function(){this.getPaymentTypeFromCurrentPayment(),l.prototype.edit.apply(this,arguments)},initialize:function(){var e=this;t.defer(function(){e.getPaymentTypeFromCurrentPayment(),e.setSavedPaymentMethod(e.get("savedPaymentMethodId"))});var i=this.get("billingContact");this.on("change:paymentType",this.selectPaymentType),this.selectPaymentType(this,this.get("paymentType")),this.on("change:isSameBillingShippingAddress",function(e,t){t&&i.set(this.parent.get("fulfillmentInfo").get("fulfillmentContact").toJSON(),{silent:!0})}),this.on("change:savedPaymentMethodId",this.syncPaymentMethod),this._cachedDigitalCredits=null,t.bindAll(this,"applyPayment","addStoreCredit")},selectPaymentType:function(e,t){e.get("check").selected="Check"===t,e.get("card").selected="CreditCard"===t},calculateStepStatus:function(){var e="complete"===this.parent.get("fulfillmentInfo").stepStatus(),i=this.activePayments(),n=i.length>0,a=i&&!!t.findWhere(i,{paymentType:"CreditCard"}),r=0===this.parent.get("amountRemainingForPayment");return a?this.stepStatus("incomplete"):e?n&&(r||"PaypalExpress"===this.get("paymentType")&&-1!==window.location.href.indexOf("PaypalExpress=complete"))?this.stepStatus("complete"):this.stepStatus("incomplete"):this.stepStatus("new")},getPaypalUrls:function(){var e=window.location.href+(-1!==window.location.href.indexOf("?")?"&":"?");return{paypalReturnUrl:e+"PaypalExpress=complete",paypalCancelUrl:e+"PaypalExpress=canceled"}},submit:function(){var e=this.getOrder();if(e.syncBillingAndCustomerEmail(),this.nonStoreCreditTotal()>0&&this.validate())return!1;var t=e.apiModel.getCurrentPayment();return t?e.apiVoidPayment(t.id).then(this.applyPayment):this.applyPayment()},applyPayment:function(){var e=this,t=this.getOrder();return"PaypalExpress"===this.get("paymentType")?this.set(this.getPaypalUrls()):(this.unset("paypalReturnUrl"),this.unset("paypalCancelUrl")),this.syncApiModel(),this.nonStoreCreditTotal()>0?t.apiAddPayment().then(function(){var i=t.apiModel.getCurrentPayment();i&&"PaypalExpress"!==i.paymentType&&e.markComplete()}):(this.markComplete(),void 0)},markComplete:function(){this.stepStatus("complete"),this.isLoading(!1),this.getOrder().isReady(!0)},toJSON:function(){var e=l.prototype.toJSON.apply(this,arguments);return 0===this.nonStoreCreditTotal()&&e.billingContact&&delete e.billingContact.address,e.billingContact&&!e.billingContact.email&&(e.billingContact.email=this.getOrder().get("customer.emailAddress")),e}}),p=n.MozuModel.extend(),h={emailAddress:{fn:function(e){return!this.attributes.createAccount||e&&e.match(n.Validation.patterns.email)?void 0:i.getLabel("emailMissing")}},password:{fn:function(e){return this.attributes.createAccount&&!e?i.getLabel("passwordMissing"):void 0}},confirmPassword:{fn:function(e){return this.attributes.createAccount&&e!==this.get("password")?i.getLabel("passwordsDoNotMatch"):void 0}}};i.getThemeSetting("requireCheckoutAgreeToTerms")&&(h.agreeToTerms={acceptance:!0,msg:i.getLabel("didNotAgreeToTerms")});var m=n.MozuModel.extend({mozuType:"order",handlesMessages:!0,relations:{fulfillmentInfo:u,billingInfo:g,shopperNotes:p,customer:r.Customer},validation:h,dataTypes:{createAccount:n.MozuModel.DataTypes.Boolean,acceptsMarketing:n.MozuModel.DataTypes.Boolean,amountRemainingForPayment:n.MozuModel.DataTypes.Float},helpers:["digitalOnly"],digitalOnly:function(){return t.every(this.get("items"),function(e){return t.some(e.product.properties,function(e){return console.log(e),"Tenant~digital-product"===e.attributeFQN&&e.values[0].value===!0})})},initialize:function(e){var n=this,a=require.mozuData("user");t.defer(function(){var e=n.apiModel.getCurrentPayment(),r=n.get("fulfillmentInfo"),o=r.get("fulfillmentContact"),s=n.get("billingInfo"),d=[r,o,s],l=e&&"PaypalExpress"===e.paymentType&&-1!==window.location.href.indexOf("PaypalExpress=canceled"),c=function(){return"completecompletecomplete"===t.reduce(d,function(e,t){return e+t.stepStatus()},"")},u=c()&&!l;n.isReady(u),t.each(d,function(e){n.listenTo(e,"stepstatuschange",function(){t.defer(function(){n.isReady(c())})})}),n.get("requiresFulfillmentInfo")||(n.validation=t.pick(n.constructor.prototype.validation,t.filter(t.keys(n.constructor.prototype.validation),function(e){return-1===e.indexOf("fulfillment")}))),n.get("billingInfo.billingContact").on("change:email",function(e,t){n.set("email",t)});var g=s.get("billingContact.email");!g&&a.email&&s.set("billingContact.email",a.email),l&&n.apiVoidPayment(e.id).then(function(e){return n.set(e.data),n.trigger("error",{message:i.getLabel("paypalExpressCancelled")}),e})}),a.isAuthenticated&&this.set("customer",{id:a.accountId}),null===e.acceptsMarketing&&n.set("acceptsMarketing",!0),t.bindAll(this,"update","onCheckoutSuccess","onCheckoutError","addNewCustomer","saveCustomerCard","finalPaymentReconcile","apiCheckout","addDigitalCreditToCustomerAccount","addCustomerContact","addBillingContact","addShippingContact","addShippingAndBillingContact")},addCoupon:function(){var e=this,n=this.get("couponCode"),r=e.get("orderDiscounts");if(r&&t.findWhere(r,{couponCode:n})){var o=a.defer();return o.reject(),o.promise.otherwise(function(){e.trigger("error",{message:i.getLabel("promoCodeAlreadyUsed",n)})}),o.promise}return this.isLoading(!0),this.apiAddCoupon(this.get("couponCode")).then(function(){e.set("couponCode","");var a=e.get("orderDiscounts").concat("shippingDiscounts").concat("handlingDiscounts").concat(t.flatten(t.pluck(e.get("items"),"productDiscounts"))).concat(t.flatten(t.pluck(e.get("items"),"shippingDiscounts"))),r=n.toLowerCase();a&&t.find(a,function(e){return e.couponCode.toLowerCase()===r})||e.trigger("error",{message:i.getLabel("promoCodeError",n)}),e.isLoading(!1)})},onCheckoutSuccess:function(){this.isLoading(!0),this.trigger("complete")},onCheckoutError:function(t){var n=this,a=!1;throw n.isLoading(!1),t&&t.items&&0!==t.items.length||(t={items:[{message:t.message||i.getLabel("unknownError")}]}),e.each(t.items,function(e,t){"ADD_CUSTOMER_FAILED"===t.name&&t.message.toLowerCase().indexOf("invalid parameter: password")&&(a=!0,n.trigger("passwordinvalid",t.message.substring(t.message.indexOf("Password")))),"ADD_CUSTOMER_FAILED"===t.errorCode&&t.message.toLowerCase().indexOf("invalid parameter: emailaddress")&&(a=!0,n.trigger("userexists",n.get("emailAddress")))}),this.trigger("error",t),a||n.messages.reset(t.items),n.isSubmitting=!1,t},addNewCustomer:function(){var e=this,t=this.get("billingInfo"),i=t.get("billingContact"),n=this.get("emailAddress"),r=function(t){if(t&&("customer"===t.type||"login"===t.type)){var i;"customer"===t.type&&(i=t.data),"login"===t.type&&(i=t.data.customerAccount),i&&i.id&&(e.set("customer",i),a.off("sync",r),a.off("spawn",r))}};return a.on("sync",r),a.on("spawn",r),this.apiAddNewCustomer({account:{emailAddress:n,userName:n,firstName:i.get("firstName")||this.get("fulfillmentInfo.fulfillmentContact.firstName"),lastName:i.get("lastNameOrSurname")||this.get("fulfillmentInfo.fulfillmentContact.lastNameOrSurname"),acceptsMarketing:e.get("acceptsMarketing")},password:this.get("password")}).then(function(t){return e.customerCreated=!0,t},function(t){throw e.customerCreated=!1,e.isSubmitting=!1,t})},addBillingContact:function(){return this.addCustomerContact("billingInfo","billingContact",[{name:"Billing"}])},addShippingContact:function(){return this.addCustomerContact("fulfillmentInfo","fulfillmentContact",[{name:"Shipping"}])},addShippingAndBillingContact:function(){return this.addCustomerContact("fulfillmentInfo","fulfillmentContact",[{name:"Shipping"},{name:"Billing"}])},addCustomerContact:function(e,i,n){var r=this.get("customer"),o=this.get(e),s=o.get(i).toJSON(),d=[function(){return(-1===s.id||1===s.id||"new"===s.id)&&delete s.id,r.apiModel.addContact(s).then(function(e){return s.id=e.data.id,e})}];this.isSavingNewCustomer()?t.each(n,function(e){e.isPrimary=!0}):d.unshift(function(){return r.apiModel.getContacts().then(function(e){t.each(n,function(i){var n=t.find(e.data.items,function(e){return t.find(e.types||[],function(e){return e.name===i.name&&e.isPrimary})});i.isPrimary=!n})})}),s.email||(s.email=this.get("emailAddress")||r.get("emailAddress")||require.mozuData("user").email);var l=s.contactId;if(l&&(s.id=l),s.id&&-1!==s.id&&1!==s.id&&"new"!==s.id){var c=a.defer();return c.resolve(),c.promise}return s.types=n,a.steps(d)},saveCustomerCard:function(){var e=this,t=this.get("customer"),i=this.get("billingInfo"),n=i.get("isSameBillingShippingAddress"),a=this.isSavingNewCustomer(),r=i.get("billingContact").toJSON(),o=i.get("card"),s=function(){e.cardsSaved=e.cardsSaved||t.get("cards").reduce(function(e,t){return e[t.id]=!0,e},{});var i=e.cardsSaved[o.get("id")||o.get("paymentServiceCardId")]?"updateCard":"addCard";return o.set("contactId",r.id),t.apiModel[i](o.toJSON()).then(function(t){return e.cardsSaved[t.data.id]=!0,t})},d=function(){return(-1===r.id||1===r.id)&&delete r.id,t.apiModel.addContact(r).then(function(e){return r.id=e.data.id,e})},l=r.contactId;return l&&(r.id=l),r.id&&-1!==r.id&&1!==r.id&&"new"!==r.id?s():(r.types=n?[{name:"Shipping",isPrimary:a},{name:"Billing",isPrimary:a}]:[{name:"Billing",isPrimary:a}],d().then(s))},setFulfillmentContactEmail:function(){var e=this.get("fulfillmentInfo.fulfillmentContact.email"),t=this.get("email");e||this.set("fulfillmentInfo.fulfillmentContact.email",t)},syncBillingAndCustomerEmail:function(){var e=this.get("billingInfo.billingContact.email"),t=this.get("emailAddress")||require.mozuData("user").email;t||this.set("emailAddress",e),e||this.set("billingInfo.billingContact.email",t)},addDigitalCreditToCustomerAccount:function(){var e=this.get("billingInfo"),i=this.get("customer"),n=e.getDigitalCreditsToAddToCustomerAccount();return n?t.each(n,function(e){return i.apiAddStoreCredit(e.get("code"))}):void 0},isSavingNewCustomer:function(){return this.get("createAccount")&&!this.customerCreated},finalPaymentReconcile:function(){var e,n,r=this,o=this.get("total"),s=this.apiModel.getActivePayments(),d=this.apiModel.getCurrentPayment(),l=Math.round(100*(t.reduce(s,function(e,t){return e+t.amountRequested},0)-o))/100;return 0===l?(n=a.defer(),n.resolve(!0),n.promise):(e=r.get("billingInfo"),!d||s.length>1||"PaypalExpress"===d.paymentType||0>l?a.all.apply(a,s.map(function(e){return r.apiVoidPayment(e.id)})).then(function(){return r.get("customer.credits").each(function(e){e.set({isEnabled:!1,creditAmountApplied:0,remainingBalance:e.get("currentBalance")})}),e.loadCustomerDigitalCredits()}).then(function(){throw e.clear(),e.stepStatus("incomplete"),new Error(i.getLabel("recalculatePayments"))}):r.apiVoidPayment(d.id).then(function(){return d.amountRequested=o,e.set(d),e.applyPayment()}))},submit:function(){var e=this,t=this.get("billingInfo"),i=t.get("billingContact"),n=t.get("isSameBillingShippingAddress"),r=!1,o=this.isSavingNewCustomer(),s=require.mozuData("user").isAuthenticated,d=t.nonStoreCreditTotal(),l=this.get("requiresFulfillmentInfo"),c=d>0,u=[function(){return e.update({ipAddress:e.get("ipAddress"),shopperNotes:e.get("shopperNotes").toJSON()})}];if(!this.isSubmitting){if(this.isSubmitting=!0,c&&!i.isValid()&&i.set(this.apiModel.getCurrentPayment().billingInfo.billingContact),this.syncBillingAndCustomerEmail(),this.setFulfillmentContactEmail(),d>0&&this.validate())return this.isSubmitting=!1,!1;this.isLoading(!0),o&&u.push(this.addNewCustomer);var g=t.get("card");"CreditCard"===t.get("paymentType")&&g.get("isCardInfoSaved")&&(this.get("createAccount")||s)&&(r=!0,u.push(this.saveCustomerCard)),(this.get("createAccount")||s)&&t.getDigitalCreditsToAddToCustomerAccount().length>0&&u.push(this.addDigitalCreditToCustomerAccount),(s||o)&&(n||r?n&&!r?u.push(this.addShippingAndBillingContact):!n&&r&&l&&u.push(this.addShippingContact):(l&&u.push(this.addShippingContact),c&&u.push(this.addBillingContact))),u.push(this.finalPaymentReconcile,this.apiCheckout),a.steps(u).then(this.onCheckoutSuccess,this.onCheckoutError);var p=this.get("billingInfo").get("fulfillmentContact").get("address").toJSON(),h=this.get("billingInfo").get("fulfillmentContact").get("firstName");try{this.digitalOnly()&&this.getOrder()&&(this.get("fulfillmentInfo").get("fulfillmentContact").set("address",p),this.get("fulfillmentInfo").get("fulfillmentContact").set("firstName",h),this.get("fulfillmentInfo").set("shippingMethodName","Free Shipping"))}catch(m){console.log&&console.log("There was an error applying the proper fulfillment address for the digital order.",m)}}},update:function(){var e=this.toJSON();return this.apiModel.update(e)},isReady:function(e){this.set("isReady",e)},toJSON:function(e){var t=n.MozuModel.prototype.toJSON.apply(this,arguments);return e&&e.helpers||(delete t.password,delete t.confirmPassword),t}});return{CheckoutPage:m}}),require(["modules/jquery-mozu","underscore","hyprlive","modules/backbone-mozu","modules/models-checkout","modules/views-messages","modules/cart-monitor"],function(e,t,i,n,a,r,o){var s=n.MozuView.extend({edit:function(){this.model.edit()},next:function(){var e=this;t.defer(function(){e.model.next()})},choose:function(){var e=this;e.model.choose.apply(e.model,arguments)},constructor:function(){var e=this;n.MozuView.apply(this,arguments),e.resize(),setTimeout(function(){e.$(".mz-panel-wrap").css({"overflow-y":"hidden"})},250),e.listenTo(e.model,"stepstatuschange",e.render,e),e.$el.on("keypress","input",function(t){return 13===t.which?(e.handleEnterKey(t),!1):void 0})},initStepView:function(){this.model.initStep()},handleEnterKey:function(){this.model.next()},render:function(){this.$el.removeClass("is-new is-incomplete is-complete is-invalid").addClass("is-"+this.model.stepStatus()),n.MozuView.prototype.render.apply(this,arguments),this.resize()},resize:t.debounce(function(){this.$(".mz-panel-wrap").animate({height:this.$(".mz-inner-panel").outerHeight()})},200)}),d=n.MozuView.extend({templateName:"modules/checkout/checkout-order-summary",initialize:function(){this.listenTo(this.model.get("billingInfo"),"orderPayment",this.onOrderCreditChanged,this)},editCart:function(){window.location="/cart"},onOrderCreditChanged:function(){this.render()},handleLoadingChange:function(){}}),l=s.extend({templateName:"modules/checkout/step-shipping-address",autoUpdate:["firstName","lastNameOrSurname","address.address1","address.address2","address.address3","address.cityOrTown","address.countryCode","address.stateOrProvince","address.postalOrZipCode","address.addressType","phoneNumbers.home","contactId","email"],renderOnChange:["address.countryCode","contactId"]}),c=s.extend({templateName:"modules/checkout/step-shipping-method",renderOnChange:["availableShippingMethods"],additionalEvents:{"change [data-mz-shipping-method]":"updateShippingMethod"},updateShippingMethod:function(){this.model.updateShippingMethod(this.$("[data-mz-shipping-method]:checked").val())}}),u=s.extend({templateName:"modules/checkout/step-payment-info",autoUpdate:["savedPaymentMethodId","paymentType","card.paymentOrCardType","card.cardNumberPartOrMask","card.nameOnCard","card.expireMonth","card.expireYear","card.cvv","card.isCardInfoSaved","check.nameOnCheck","check.routingNumber","check.checkNumber","isSameBillingShippingAddress","billingContact.firstName","billingContact.lastNameOrSurname","billingContact.address.address1","billingContact.address.address2","billingContact.address.address3","billingContact.address.cityOrTown","billingContact.address.countryCode","billingContact.address.stateOrProvince","billingContact.address.postalOrZipCode","billingContact.phoneNumbers.home","billingContact.email","creditAmountToApply","digitalCreditCode"],renderOnChange:["savedPaymentMethodId","billingContact.address.countryCode","paymentType","isSameBillingShippingAddress"],additionalEvents:{"change [data-mz-digital-credit-enable]":"enableDigitalCredit","change [data-mz-digital-credit-amount]":"applyDigitalCredit","change [data-mz-digital-add-remainder-to-customer]":"addRemainderToCustomer"},initialize:function(){this.listenTo(this.model,"change:digitalCreditCode",this.onEnterDigitalCreditCode,this),this.listenTo(this.model,"orderPayment",function(){this.render()},this),this.codeEntered=!!this.model.get("digitalCreditCode")},updateAcceptsMarketing:function(t){this.model.getOrder().set("acceptsMarketing",e(t.currentTarget).prop("checked"))},beginApplyCredit:function(){this.model.beginApplyCredit(),this.render()},cancelApplyCredit:function(){this.model.closeApplyCredit(),this.render()},finishApplyCredit:function(){var e=this;this.model.finishApplyCredit().then(function(){e.render()})},removeCredit:function(t){var i=this,n=e(t.currentTarget).data("mzCreditId");this.model.removeCredit(n).then(function(){i.render()})},getDigitalCredit:function(){var e=this;this.$el.addClass("is-loading"),this.model.getDigitalCredit().ensure(function(){e.$el.removeClass("is-loading")})},stripNonNumericAndParseFloat:function(e){if(!e)return 0;var t=parseFloat(e.replace(/[^\d\.]/g,""));return isNaN(t)?0:t},applyDigitalCredit:function(t){var i=e(t.currentTarget).prop("value"),n=e(t.currentTarget).attr("data-mz-credit-code-target");if(!n)return console.log("checkout.applyDigitalCredit could not find target."),void 0;var a=this.stripNonNumericAndParseFloat(i);this.model.applyDigitalCredit(n,a,!0),this.render()},onEnterDigitalCreditCode:function(e,t){t&&!this.codeEntered&&(this.codeEntered=!0,this.$el.find("button").prop("disabled",!1)),!t&&this.codeEntered&&(this.codeEntered=!1,this.$el.find("button").prop("disabled",!0))
},enableDigitalCredit:function(t){var i=e(t.currentTarget).attr("data-mz-credit-code-source"),n=e(t.currentTarget).prop("checked")===!0,a=this.$el.find("input[data-mz-credit-code-target='"+i+"']"),r=this;n?(a.prop("disabled",!1),r.model.applyDigitalCredit(i,null,!0)):(a.prop("disabled",!0),r.model.applyDigitalCredit(i,0,!1),r.render())},addRemainderToCustomer:function(t){var i=e(t.currentTarget).attr("data-mz-credit-code-to-tie-to-customer"),n=e(t.currentTarget).prop("checked")===!0;this.model.addRemainingCreditToCustomerAccount(i,n)},handleEnterKey:function(t){var i=e(t.currentTarget).attr("data-mz-value");if(i)switch(i){case"creditAmountApplied":return this.applyDigitalCredit(t);case"digitalCreditCode":return this.getDigitalCredit(t)}}}),g=n.MozuView.extend({templateName:"modules/checkout/coupon-code-field",handleLoadingChange:function(){},initialize:function(){var e=this;this.listenTo(this.model,"change:couponCode",this.onEnterCouponCode,this),this.codeEntered=!!this.model.get("couponCode"),this.$el.on("keypress","input",function(t){return 13===t.which?(e.codeEntered&&e.handleEnterKey(),!1):void 0})},onEnterCouponCode:function(e,t){t&&!this.codeEntered&&(this.codeEntered=!0,this.$el.find("button").prop("disabled",!1)),!t&&this.codeEntered&&(this.codeEntered=!1,this.$el.find("button").prop("disabled",!0))},autoUpdate:["couponCode"],addCoupon:function(){var e=this;this.$el.addClass("is-loading"),this.model.addCoupon().ensure(function(){e.$el.removeClass("is-loading"),e.model.unset("couponCode"),e.render()})},handleEnterKey:function(){this.addCoupon()}}),p=n.MozuView.extend({templateName:"modules/checkout/comments-field",autoUpdate:["shopperNotes.comments"]}),h=n.MozuView.extend({templateName:"modules/checkout/step-review",autoUpdate:["createAccount","agreeToTerms","emailAddress","password","confirmPassword"],renderOnChange:["createAccount","isReady"],initialize:function(){var e=this;this.$el.on("keypress","input",function(t){return 13===t.which?(e.handleEnterKey(),!1):void 0}),this.model.on("passwordinvalid",function(t){e.$('[data-mz-validationmessage-for="password"]').text(t)}),this.model.on("userexists",function(t){e.$('[data-mz-validationmessage-for="emailAddress"]').html(i.getLabel("customerAlreadyExists",t,encodeURIComponent(window.location.pathname)))})},submit:function(){var e=this;t.defer(function(){e.model.submit()})},handleEnterKey:function(){this.submit()}});e(document).ready(function(){var n=e("#checkout-form"),s=require.mozuData("checkout"),m=window.order=new a.CheckoutPage(s),f={steps:{shippingAddress:new l({el:e("#step-shipping-address"),model:m.get("fulfillmentInfo").get("fulfillmentContact")}),shippingInfo:new c({el:e("#step-shipping-method"),model:m.get("fulfillmentInfo")}),paymentInfo:new u({el:e("#step-payment-info"),model:m.get("billingInfo")})},orderSummary:new d({el:e("#order-summary"),model:m}),couponCode:new g({el:e("#coupon-code-field"),model:m}),comments:i.getThemeSetting("showCheckoutCommentsField")&&new p({el:e("#comments-field"),model:m}),reviewPanel:new h({el:e("#step-review"),model:m}),messageView:r({el:n.find("[data-mz-message-bar]"),model:m.messages})};window.checkoutViews=f,m.on("complete",function(){o.setCount(0),window.location="/checkout/"+m.get("id")+"/confirmation"});var C=e("#step-review");m.on("change:isReady",function(e,t){t&&setTimeout(function(){window.scrollTo(0,C.offset().top)},750)}),t.invoke(f.steps,"initStepView"),n.noFlickerFadeIn()})}),define("pages/checkout",function(){});