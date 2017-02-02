# 2.0.0

This version breaks compatibility since now all methods return
the whole API response and not only the data. That was a not so good design choice and we are changing it now.

Before

'''javascript
client.products.list()
.then((products) => {
	//products is an array of products
})
'''

Now
'''javascript
client.products.list()
.then((response) => {
	var products = response.data;
	//products is an array of products
})
'''
