const cart = []

const getCartItemIndexById = (id) => {
    return cart.findIndex(x => x.Id == id)
}

const getNewCardItemId = () => {
    if (cart.length < 1) return 1
    return cart[cart.length - 1].Id + 1
}

const addItem = data => {
    var itemData = JSON.parse(data)
    document.getElementById('items').insertAdjacentHTML('beforeend', `
    <div class="item" onclick='addToCart(${data})'>
        <div class="item-price-box-wrapper">
            <div class="item-price-box">
                <h2>$<span>${itemData.Price}</span></h2>
            </div>
        </div>
        <div class="item-img-box">
            <img src="./img/items/${itemData.Name.toLowerCase()}.png" class="item-image">
        </div>
        <div class="item-name-box">
            <h3>${itemData.Name}</h3>
        </div>
    </div>
    `)
}

const closeMenu = () => {
    document.getElementById('cart-amount').innerText = 0
    document.getElementById('cart-quantity').innerText = 0
    document.getElementById('cart-cost').innerText = 0

    mp.events.call('Client:DestroyItemShop');
}

const addToCart = item => {
    const existingItem = cart.find(x => x.Id == item.Id)
    console.log(existingItem)
    if (existingItem) {
        existingItem.Quantity++
    } else {
        item = { Id: getNewCardItemId(), Name: item.Name, Price: item.Price, Quantity: 1 }
        cart.push(item)
    }

    console.log(cart)

    document.getElementById('cart-amount').innerText = getCartQuantity()
    document.getElementById('cart-quantity').innerText = getCartQuantity()
    document.getElementById('cart-cost').innerText = getCartPrice()
}

const openCartMenu = () => {
    cart.forEach(x => {
        document.getElementById('cart-items').insertAdjacentHTML('beforeend', `
        <div class="cart-item" id="cart-item-${x.Id}">
            <img src="./img/items/${x.Name.toLowerCase()}.png" class="cart-item-img">
            <h2>${x.Name}</h2>
            <div class="inputc">
                <input type="number" class="cart-item-input" id="cart-item-${x.Id}-quantity" value="${x.Quantity}" min="1" onkeypress="return (event.charCode>= 48 && event.charCode <= 57) " onpaste="return false" oninput="updateCartItemQuantity(${x.Id}, this.value)">
                <div class="inputbtn btnup" onclick="changeCartItemQuantity(${x.Id}, 1)">↑</div>
                <div class="inputbtn btndwn" onclick="changeCartItemQuantity(${x.Id}, -1)">↓</div>
            </div>
            <h3 id="cart-item-${x.Id}-price">$${x.Price * x.Quantity}</h3>
            <i class="fas fa-times cart-item-exit" onclick="removeCartItem(${x.Id})"></i>
        </div>
        `)
    })

    document.getElementById('cart-head-amount').innerText = getCartQuantity()
    document.getElementById('cart-money').innerText = getCartPrice()

    document.getElementById('cart-overlay').style.display = 'block'
}

const updateCartItemQuantity = (id, newVal) => {

    if (!newVal.length) return;

    const index = getCartItemIndexById(id)
    cart[index].Quantity = parseInt(newVal)

    document.getElementById(`cart-item-${id}-price`).innerText = `$${cart[index].Quantity * cart[index].Price}`
    document.getElementById(`cart-item-${id}-quantity`).innerText = cart[index].Quantity

    document.getElementById('cart-money').innerText = getCartPrice()
    document.getElementById('cart-head-amount').innerText = getCartQuantity()
}

const changeCartItemQuantity = (id, mod) => {
    const index = getCartItemIndexById(id)
    if (mod < 1 && cart[index].Quantity <= 1) return
    cart[index].Quantity += mod

    document.getElementById(`cart-item-${id}-quantity`).value = cart[index].Quantity
    document.getElementById(`cart-item-${id}-price`).innerText = `$${cart[index].Quantity * cart[index].Price}`

    document.getElementById('cart-money').innerText = getCartPrice()
    document.getElementById('cart-head-amount').innerText = getCartQuantity()
}

const closeCartMenu = () => {
    document.getElementById('cart-amount').innerText = getCartQuantity()
    document.getElementById('cart-quantity').innerText = getCartQuantity()
    document.getElementById('cart-cost').innerText = getCartPrice()

    Array.from(document.getElementsByClassName('cart-item')).forEach(x => {
        x.parentNode.removeChild(x)
    })

    document.getElementById('cart-overlay').style.display = 'none'
}

const removeCartItem = (id) => {
    const index = getCartItemIndexById(id)
    cart.splice(index, 1)
    const el = document.getElementById(`cart-item-${id}`)

    el.parentNode.removeChild(el)
    document.getElementById('cart-money').innerText = getCartPrice()
    document.getElementById('cart-head-amount').innerText = getCartQuantity()
}

const buyItems = () => {
    if (cart.length > 0) {
        mp.trigger('Client:ItemShop:BuyItems', JSON.stringify(cart))
    }
    closeMenu()
}

const getCartPrice = () => {
    let result = 0
    cart.forEach(x => result += x.Price * x.Quantity)
    return result
}

const getCartQuantity = () => {
    let result = 0
    cart.forEach(x => {
        result += x.Quantity
    })
    return result
}


const loadItems = (jsonData) => {
    jsonData = JSON.parse(jsonData);

    for (const x of jsonData) {
        addItem(`{"Id": ${x.Id}, "Name":"${x.Name}", "Price":${x.Price}}`)
    }
}

for (let i = 0; i < 20; i++)
    addItem(`{"Id": ${i}, "Name":"Placeholder", "Price":${i}}`)