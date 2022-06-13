function ShopItemModel(...args) {
    this.ShopItemId = args[0];
    this.ShopItemName = args[1];
    this.ShopItemPrice = args[2];
};

function ShoppingCartModel(...args) {
    this.ShopItemId = args[0];
    this.ShopItemAmount = args[1];
};

let ShopItems = [];
let ShoppingCardItems = [];

function getFreeSlot() {
    return ShopItems.length;
}

function loadItems(rawjson) {
    JSON.parse(rawjson).forEach(element => {
        addShopItem(element.ShopItemId, element.ShopItemName, element.ShopItemPrice);
    });
}
addShopItem(1, "asdas", 50)

function addShopItem(ItemId, ItemName, ItemPrice) {
    let Slot = (getFreeSlot() + 1);
    if (Slot == null) return;
    let element = `            
    <div onclick="atShopItemClick(${ItemId})" class="item-${Slot}">
        <img src="../utils/img/items/${ItemName}.png">
        <span>${ItemPrice} $</span>
    </div>`;
    $(`.item-frame.slot-${Slot}`).append(element);
    ShopItems.push(new ShopItemModel(ItemId, ItemName, ItemPrice));
};

function getShopItem(id) {
    return ShopItems.find(x => x.ShopItemId == id);
}

function getShoppingCardItem(id) {
    return ShoppingCardItems.find(x => x.ShopItemId == id);
}

function atShopItemClick(ItemId) {
    let Item = getShopItem(ItemId);
    if (Item == null) return;
    let ShoppingCardItem = getShoppingCardItem(ItemId);

    if (ShoppingCardItem != null) {
        ShoppingCardItem.ShopItemAmount += 1;
        $(`#${Item.ShopItemId}`).val(ShoppingCardItem.ShopItemAmount)
    } else {
        let element = `
        <li id="cart-${Item.ShopItemId}">
            <div class="item-cart">
                <img src="../utils/img/items/${Item.ShopItemName}.png">
            </div>
            <div class="item-shop-cart-item">
                <p>${Item.ShopItemName}</p>
                <div class="item-info">
                    <i onclick="updateShoppingCardInputvalue(${Item.ShopItemId}, true)" class="fa-solid fa-circle-minus"></i>
                    <input oninput="calcShoppingCardPrice()" id="${Item.ShopItemId}" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" onpaste="return" false" min="1" max="100" type="number">
                    <i onclick="updateShoppingCardInputvalue(${Item.ShopItemId}, false)" class="fa-solid fa-circle-plus"></i>
                </div>
            </div>
            <div class="delete-shoppingcard-item">
            <i onclick="deleteShoppingCardItem(${Item.ShopItemId})" style="font-size: 1.5vh; color: #808080; line-height: 3vh;" class="fa-solid fa-circle-trash"></i>
        </div>
        </li>`;
        $(`.cart ul`).append(element);
        $(`#${Item.ShopItemId}`).val(1)
        ShoppingCardItems.push(new ShoppingCartModel(Item.ShopItemId, 1));
    }
    calcShoppingCardPrice();
}

function getShoppingCardItems() {
    for (const item of ShoppingCardItems) {
        let HtmlValue = $(`#${item.ShopItemId}`).val();
        item.ShopItemAmount = parseInt(HtmlValue);
        if (HtmlValue <= 0) {
            let index = ShoppingCardItems.indexOf(item);
            ShoppingCardItems.splice(index, 1)
        }
    }
    return ShoppingCardItems;
}

function updateShoppingCardInputvalue(ItemId, remove) {
    console.log(ItemId);
    console.log(remove);
    let value = $(`#${ItemId}`).val();
    if (value == null) return;
    if (remove) {
        if (value-- <= 1) return;
        value--;
        $(`#${ItemId}`).val(value)
    } else {
        value++;
        $(`#${ItemId}`).val(value)
    }
    calcShoppingCardPrice();
}

function deleteShoppingCardItem(ItemId) {
    let item = getShoppingCardItem(ItemId);
    if (item == null) return;
    let index = ShoppingCardItems.indexOf(item);
    if (index == null) return;
    $(`#cart-${item.ShopItemId}`).remove();
    ShoppingCardItems.splice(index, 1);
    calcShoppingCardPrice();
}

function calcShoppingCardPrice() {
    let result = 0;
    for (const item of ShoppingCardItems) {
        let ShopItem = getShopItem(item.ShopItemId)
        let HTMLAMOUNT = $(`#${item.ShopItemId}`).val();
        if (HTMLAMOUNT == null) return;
        result += (ShopItem.ShopItemPrice * HTMLAMOUNT);
    }
    $('.shopping-cart-price').text(formatNumber(result))
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function CloseIconHover(state) {
    if (state) {
        $('#icon-close').css('display', 'none')
        $('#icon-store').fadeIn(100)
    } else {
        $('#icon-close').fadeIn(100)
        $('#icon-store').css('display', 'none')
    }
}

function BuyItemShopItems() {
    let CardItems = getShoppingCardItems();
    if (CardItems == null) return;
    mp.trigger('Client:BuyShopItems', JSON.stringify(CardItems));
    mp.trigger('Client:DestroyItemShop');
}

function CloseItemShop() {
    mp.trigger('Client:DestroyItemShop');
}