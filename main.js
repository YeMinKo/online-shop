var eventBus = new Vue()

Vue.component('product-tabs',{
    template: `
    <div>
        <ul>
            <span class="tab" 
                v-for="(tab,index) in tabs" :key="index"
                @click="selectedTab= tab"
                :class="{activeTab : selectedTab === tab}">{{ tab }}</span>
        </ul>
        <div v-show = "selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no review yet!</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{review.name}}</p>
                    <p>Rating: {{review.rating}}</p>
                    <p>Review: {{review.review}}</p>
                </li>
            </ul>
        </div>
        <div v-show = "selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
    </div>
    `,
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


Vue.component('product-review',{
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
        <p class="error" v-if="errors.length"> 
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>


        <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
        </p>
            
        <p>
        <input type="submit" value="Submit">  
        </p>    
    
    </form>
    `,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit(){
            this.errors = []
            if(this.name && this.rating && this.review){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else{
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
            }
        }
    }
})

Vue.component('product-detail',{
    template: `
    <ul>
		<li v-for="detail in details">{{detail}}</li>
	</ul>
    `,
    props: {
        details: {
            type: Array,
            required: true,
            default: ['No details1']
        }
    }
})


Vue.component('product',{
    template: `
    <div class="product">
			<div class="product-image">
				<img :src="image"/>
			</div>
			<div class="product-info">
				<h1>{{ title }}</h1>
				<p v-if="inStock">In Stock</p>
                <p v-else>Out of stock</p>
                <p>Shipping : {{shipping}}</p>

				<product-detail :details="details"></product-detail>

				<div class="color-box" v-for="(varient,index) in varients" 
					:key="varient.varientId" 
					:style="{backgroundColor: varient.varientColor}"
					@mouseover="updateProduct(index)">
				</div>

				<button v-on:click="addToCart" 
					:class="{disabledButton: !inStock}" 
					:disabled="!inStock">Add to cart</button>
				
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
	</div>
    `,
    props: {
        premium: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    data() {
        return {
            product: "Stocks",
            brand: "Vue Mastery",
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            varients: [
                {
                    varientId: 331,
                    varientColor: "green",
                    varientImage: "./vm-green.bmp",
                    varientQuantity: 10
                },
                {
                    varientId: 332,
                    varientColor: "blue",
                    varientImage: "./vm-blue.bmp",
                    varientQuantity: 0
                }
            ],
            selectedVarient: 0,
            reviews: []
        }
    },
    methods: {
        addToCart(){
            this.$emit('add-to-cart',this.varients[this.selectedVarient].varientId);
        },
        updateProduct(index){
            this.selectedVarient = index
        }
    },
    computed: {
        title(){
            return this.brand + ' ' +this.product
        },
        image(){
            return this.varients[this.selectedVarient].varientImage
        },
        inStock(){
            return this.varients[this.selectedVarient].varientQuantity
        },
        shipping(){
            return this.premium ? "Free" : "2.99"
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        }
    }
})