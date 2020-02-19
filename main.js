var app = new Vue({
    el: '#app',
    data: {
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
        cart: 0,
        selectedVarient: 0
    },
    methods: {
        addToCart(){
            this.cart +=1;
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
        }
    }
})