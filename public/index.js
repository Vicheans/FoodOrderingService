// $("#cart").show()
// $("#home").hide()
const csrf = $('#_csrf').val();

$('.add').on('click',  e => {
    const id = $(e.target).attr('data-itemId')
    console.log(id)
     itemIdRequest('/order?_csrf=', id)
   })


$(".tab-link").on('click', e=>{
    $(".tab-item:not(." + e.target.id + ")").hide();
    $("." + e.target.id ).fadeIn();
    const links = ['cart-link', 'checkout-link']
     const res = serverRquest((e.target.id == 'cart-link' ? "/cart" : "/status"), "GET")
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
                   ' <button class="remove-product" data-orderid="'+e.orderId+'">x</button>'+
               ' </div>'+
               ' <div class="product-line-price">' + e.quantity * e.price + '</div>' +
            '</div>'

const deliveryStatus = (e, i) =>  ' <div class="item">'+
                        '<div class="pos">'+
                            i +
                        '</div>' +
                        '<div class="pic" style="background-image: url('+e[0].image+';)">'+
                        '</div>'+
                        '<div class="name">'+
                           e[0].name + '<br>' +e.email+
                        '</div>'+
                        '<div class="score">'+
                            e[0].deliveryTime +
                        '</div>'+
                    '</div>'




//////////////////////////////////////
/* Set rates + misc */
var taxRate = 0.075;
var shippingRate = 15.00;
var fadeTime = 300;


/* Assign actions */
// $('#existingQuestions').on('click', '.delete-qst', e => {
$('.shopping-cart').on('change', '.product-quantity input', function (e) {
    updateQuantity(this);

});

$('.shopping-cart').on('click', '.product-removal button.remove-product',  async (e) => {
     const id = $(e.target).attr('data-orderid')
     await itemIdRequest('/cancelOrder?_csrf=', id)    
      removeItem(e.target);
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
        $(".amount-total").val(total.toFixed(2))
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



//REQUESTS
const serverRquest = (url, method) => {
    $.ajax({
        url,
        method,
        success: async (res) => {
            console.log(res);
            //   alertFunction(res)
            $('#product-body').empty()
            $('#delivery-status').empty()

            const {
                data
            } = await res;
            data.map(async (d, i) => {
                const item = await cartItems(d)
                const status = await deliveryStatus(d, i + 1)
                $('#product-body').append(item)
                $('#delivery-status').append(status)
                recalculateCart()
            })

        },
        error: function (err) {
        }
    })
}

const itemIdRequest = async (url, id) => {
    $.ajax({
        url: url + csrf,
        method: "POST",
        data: {
            id
        },
        dataType: "JSON",
        success: function (res) {
            alertFunction(res)
        },
        error: function (err) {
        }
    })
}



$('form').on('submit', e =>{
    e.preventDefault();

   console.log("moving on");
   const data = $(e.target).serialize()
   console.log(data);
   
   checkoutRequest('/checkout', data)
})


const checkoutRequest = async (url, data) =>{
    $.ajax({
    url, method: "POST",
    data, dataType: "JSON",
    success: res =>{
        console.log(res)
    }, error: (err)=>{
        console.log(err)
    }
    })

}





function timeToDelivery() {
    var countDownDate = new Date().getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + 6;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        console.log(days + "d " + hours + "h " +
            minutes + "m " + seconds + "s ");

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            console.log("EXPIRED");
        }
    }, 1000);
}