# marketcloud-node
Marketcloud nodejs client library

```javascript
var Marketcloud = require('marketcloud');
var mc = new Marketcloud.Client({
   public_key : 'your-public-key-here',
   secret_key : 'your-secret-key-here'
})

var product = {
			name : 'Sandman #3',
			price : 9.99,
			stock_type : 'track',
			stock_level : 10,
			author : 'Neil Gaiman',
			publisher : 'Vertigo',
			images : ['https://nothingbutcomics.files.wordpress.com/2013/10/sndm-cv1-cbldf-bw-var-4c717.jpg']
		}
mc.products.create(product)
	.then(function(response){
		var product_id = response.body.data.id
		expect(response.status).to.equal(200)
	})
  
var prod = mc.products.getById(PRODUCT_ID);



var config = {
   billing : {...},
   shipping : {...},
   items : [{product_id:prod.id,quantity:1}]
}

mc.orders.create(config);
```
