define("modules/models-cart",["underscore","modules/backbone-mozu","hyprlive"],function(e,t,n){var o=t.MozuModel.extend({helpers:["mainImage"],mainImage:function(){var e=this.get("productImages"),t=e&&e[0],o="http://placehold.it/160&text="+n.getLabel("noImages");return t||{ImageUrl:o,imageUrl:o}},initialize:function(){var e="/product/"+this.get("productCode");this.set({Url:e,url:e})}}),i=t.MozuModel.extend({relations:{product:o},validation:{quantity:{min:1}},dataTypes:{quantity:t.MozuModel.DataTypes.Int},mozuType:"cartitem",handlesMessages:!0,helpers:["priceIsModified"],priceIsModified:function(){var e=this.get("unitPrice");return e.baseAmount!=e.discountedAmount},saveQuantity:function(){this.hasChanged("quantity")&&this.apiUpdateQuantity(this.get("quantity"))}}),a=t.MozuModel.extend({mozuType:"cart",handlesMessages:!0,helpers:["isEmpty","count"],relations:{items:t.Collection.extend({model:i})},initialize:function(){this.get("items").on("sync remove",this.fetch,this).on("loadingchange",this.isLoading,this)},isEmpty:function(){return this.get("items").length<1},count:function(){return this.apiModel.count()},toOrder:function(){var e=this;e.apiCheckout().then(function(t){e.trigger("ordercreated",t)})},removeItem:function(e){return this.get("items").get(e).apiModel.del()}});return{CartItem:i,Cart:a}}),define("pages/cart",["modules/backbone-mozu","underscore","modules/jquery-mozu","modules/models-cart","modules/cart-monitor"],function(e,t,n,o,i){var a=e.MozuView.extend({templateName:"modules/cart/cart-table",updateQuantity:t.debounce(function(e){var t=n(e.currentTarget),o=parseInt(t.val()),i=t.data("mz-cart-item"),a=this.model.get("items").get(i);a&&!isNaN(o)&&(a.set("quantity",o),a.saveQuantity())},400),removeItem:function(e){var t=n(e.currentTarget),o=t.data("mz-cart-item");return this.model.removeItem(o),!1},empty:function(){this.model.apiDel().then(function(){window.location.reload()})},proceedToCheckout:function(){this.model.isLoading(!0)}});n(document).ready(function(){var e=o.Cart.fromCurrent(),t=new a({el:n("#cart"),model:e,messagesEl:n("[data-mz-message-bar]")});e.on("ordercreated",function(t){e.isLoading(!0),window.location="/checkout/"+t.prop("id")}),e.on("sync",function(){i.setCount(e.count())}),window.cartView=t,i.setCount(e.count())})});