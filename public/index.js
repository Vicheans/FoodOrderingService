$("#cart").show()
$("#home").hide()

$(".tab-link").on('click', e=>{
    $(".tab-item:not(." + e.target.id + ")").hide();
    console.log(e.target.id);
    
    $("." + e.target.id ).fadeIn();
    

    const links = ['cart-link', 'checkout-link']

    if (e.target.id == 'cart-link' || e.target.id == 'checkout-link') {
        //request cart items
        serverRquest("/cart", "GET")
    }
})




const alertFunction = e => {
    $('.alert').addClass('active ' + e.alert).html(e.message +" "+e.icon);
    setTimeout(() => {
        $('.alert').removeClass('active ' + e.alert)
    }, 4000);
}


const cartItems = e => ' <div class="product">'+
               ' <div class="product-image">'+
                    '<img src="'+e.image+'">'+
                '</div>'+
               ' <div class="product-details">'+
                   ' <div class="product-title">'+e.name+'</div>'+
                    `<p class="product-description">Who doesn't like lamb and rice? We've all hit the halal cart at 3am while quasi-blackout after a night of binge drinking in Manhattan. Now it's your dog's turn!</p>`+
                '</div>'+
               ' <div class="product-price">'+e.price+'</div>'+
                '<div class="product-quantity">'+
                    '<input type="number" class="form-control" value="'+e.quantity+'" min="1">'+
                '</div>'+
                '<div class="product-removal">'+
                   ' <button class="remove-product" data-orderId="'+e.orderId+'"><i class="fa fa-trash"></i></button>'+
               ' </div>'+
               ' <div class="product-line-price">' + e.quantity * e.price + '</div>' +
            '</div>'

const deliveryStatus = (e, i) =>  ' <div class="item">'+
                        '<div class="pos">'+
                            i +
                        '</div>' +
                        '<div class="pic" style="background-image: url('+e.image+';)">'+
                        '</div>'+
                        '<div class="name">'+
                           e.name +
                        '</div>'+
                        '<div class="score">'+
                            e.timeleft+
                        '</div>'+
                    '</div>'


const serverRquest = (url, method) =>{
      $.ajax({
          url,method,
          success: async (res) => {
              console.log(res);
            //   alertFunction(res)
            $('#product-body').empty()
            const {order} = await res;
            order.map(async (d, i)=>{
                const item = await cartItems(d)
                const status = await deliveryStatus(d, i+1)
                $('#product-body').append(item)
                $('#delivery-status').append(status)
                recalculateCart()
            })

          },
          error: function (err) {
              console.log(res);
          }
      })
}


//////////////////////////////////////
/* Set rates + misc */
var taxRate = 0.075;
var shippingRate = 15.00;
var fadeTime = 300;


/* Assign actions */
// $('#existingQuestions').on('click', '.delete-qst', e => {
$('.shopping-cart').on('change', '.product-quantity input', function () {
    updateQuantity(this);

});

$('.shopping-cart').on('click', '.product-removal button', function () {
    removeItem(this);
});


/* Recalculate cart */
function recalculateCart() {
    var subtotal = 0;

    /* Sum up row totals */
    $('.product').each(function () {
        subtotal += parseFloat($(this).children('.product-line-price').text());
    });

    /* Calculate totals */
    var tax = subtotal * taxRate;
    var shipping = (subtotal > 0 ? shippingRate : 0);
    var total = subtotal + tax + shipping;

    /* Update totals display */
    $('.totals-value').fadeOut(fadeTime, function () {
        $('#cart-subtotal').html(subtotal.toFixed(2));
        $('#cart-tax').html(tax.toFixed(2));
        $('#cart-shipping').html(shipping.toFixed(2));
        $('#cart-total').html(total.toFixed(2));
        if (total == 0) {
            $('.checkout').fadeOut(fadeTime);
        } else {
            $('.checkout').fadeIn(fadeTime);
        }
        $('.totals-value').fadeIn(fadeTime);
    });
}


/* Update quantity */
function updateQuantity(quantityInput) {
    /* Calculate line price */
    var productRow = $(quantityInput).parent().parent();
    var price = parseFloat(productRow.children('.product-price').text());
    var quantity = $(quantityInput).val();
    var linePrice = price * quantity;

    /* Update line price display and recalc cart totals */
    productRow.children('.product-line-price').each(function () {
        $(this).fadeOut(fadeTime, function () {
            $(this).text(linePrice.toFixed(2));
            recalculateCart();
            $(this).fadeIn(fadeTime);
        });
    });
}


/* Remove item from cart */
function removeItem(removeButton) {
    /* Remove row from DOM and recalc cart total */
    var productRow = $(removeButton).parent().parent();
    productRow.slideUp(fadeTime, function () {
        productRow.remove();
        recalculateCart();
    });
}