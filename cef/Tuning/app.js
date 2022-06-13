let categories = [];
let items = [];
let currentItems = [];
let categoryItems = [];
let shoppingCart = [];
let currentSelectedCategory = 0;
let itemIndex = 0;
let shoppingCartPrice = 0;

const SelectCategory = (id) => {
    if (id < 1) return;

    currentSelectedCategory = id;

    if (itemIndex <= -1) return;
    categoryItems = [];
    itemIndex = 0;

    items.forEach(element => {
        if (element.categoryId !== currentSelectedCategory) return;

        categoryItems.push({
            name: element.name,
            price: element.price,
            categoryId: element.categoryId,
            type: element.type
        });
    });

    let item = categoryItems[itemIndex];
    if (item === null) return;

    let selector = document.querySelector(".tuning-selector");
    if (selector === null) return;

    document.querySelector('.tuning-body').style.display = 'block';
    selector.querySelector("#selected-name").innerHTML = `${item.name}`;

    let category = categories.find(x => x.id === id);
    if (category === null) return;

    document.getElementById("tuning-catName").innerHTML = `${category.name}`;
    document.getElementById("tuning-currentSelected").innerHTML = `${itemIndex + 1}`;
    document.getElementById("tuning-maxSelected").innerHTML = `${categoryItems.length}`;
    document.getElementById("selected-price").innerHTML = `${item.price} $`;

    if (currentItems.find(x => x.type === item.type)) {
        document.getElementById("tune-button").innerHTML = `Modifizierung ausbauen`;
        document.getElementById("tune-button").setAttribute('onclick', 'AddItemToCart("unmount")');
    } else {
        document.getElementById("tune-button").innerHTML = `Modifizierung einbauen`;
        document.getElementById("tune-button").setAttribute('onclick', 'AddItemToCart("mount")');
    }
};

const SwitchItem = (type) => {
    if (type === 'left') {
        if (itemIndex <= 0) {
            itemIndex = categoryItems.length - 1;
        } else {
            itemIndex -= 1;
        }
    } else if (type === 'right') {
        if (itemIndex >= categoryItems.length - 1) {
            itemIndex = 0;
        } else {
            itemIndex += 1;
        }
    }

    if (itemIndex <= -1) return;

    let item = categoryItems[itemIndex];
    if (item === null) return;

    let selector = document.querySelector(".tuning-selector");
    if (selector == null) return;

    selector.querySelector("#selected-name").innerHTML = `${item.name}`;
    document.getElementById("tuning-currentSelected").innerHTML = `${itemIndex + 1}`;
    document.getElementById("selected-price").innerHTML = `${item.price} $`;

    if (currentItems.find(x => x.type === item.type)) {
        document.getElementById("tune-button").innerHTML = `Modifizierung ausbauen`;
        document.getElementById("tune-button").setAttribute('onclick', 'AddItemToCart("unmount")');
    } else {
        document.getElementById("tune-button").innerHTML = `Modifizierung einbauen`;
        document.getElementById("tune-button").setAttribute('onclick', 'AddItemToCart("mount")');
    }
};

const InitTuning = (data) => {
    data = JSON.parse(data);

    data.tunings.forEach(element => {
        if (categories.find(x => x.id === element.id)) return;

        categories.push({
            id: element.id,
            name: element.name,
            displayName: element.name
        });

        document.getElementById("category-list").innerHTML += `
            <div class="category-content" onclick="SelectCategory(${element.id})">
                <div class="category-button"><i class="fas fa-times"></i></div>
                <p class="category-itemname">${element.name}</p>
            </div>
        `;

        element.items.forEach(entries => {
            items.push({
                name: entries.name,
                price: entries.price,
                categoryId: element.id,
                type: entries.type
            });
        });
    });

    data.vehicleItems.forEach(items => {
        currentItems.push({
            name: items.name,
            categoryId: items.id,
            type: items.type
        });
    });

    if (currentSelectedCategory <= 0) {
        document.querySelector('.tuning-body').style.display = 'none';
    }

    document.querySelector('.shop-value').innerHTML = `${shoppingCart.length}`;
    document.getElementById("shopping-price").innerHTML = `${shoppingCartPrice} $`;
};

const AddItemToCart = (type) => {
    let item = categoryItems[itemIndex];
    if (item === null || item.categoryId !== currentSelectedCategory) return;
    if (shoppingCart.find(x => x.type === item.type)) return;

    if (type === 'mount') {
        shoppingCart.push({
            name: item.name,
            price: item.price,
            categoryId: item.categoryId,
            type: item.type,
            unmount: false
        });

    } else if (type === 'unmount') {
        shoppingCart.push({
            name: item.name,
            price: 50,
            categoryId: item.categoryId,
            type: item.type,
            unmount: true
        });
    }

    UpdateShoppingCart();
    mp.trigger("Client:Tuning:SetVehicleTuning", item.categoryId, item.type, type);
};

const UpdateShoppingCart = () => {
    shoppingCartPrice = 0;
    RemoveAllChildNodes(document.querySelector('.shop-list'));

    shoppingCart.forEach(element => {
        shoppingCartPrice += element.price;

        document.querySelector('.shop-list').innerHTML += `
        <div class="shop-content">
            <p class="shop-itemname">${element.name}</p>
            <p class="shop-itemprice">${element.price} $</p>
            <div class="shop-remove" onclick="DeleteItem(${element.categoryId}, ${element.type})">
                <i class="fas fa-times"></i>
            </div>
        </div>`;
    });

    document.getElementById("shopping-price").innerHTML = `${shoppingCartPrice} $`;
    document.querySelector('.shop-value').innerHTML = `${shoppingCart.length}`;
};

const DeleteItem = (categoryId, type) => {
    let item = shoppingCart.find(x => x.type === type && x.categoryId === categoryId);
    if (item === null) return;

    let itemIndex = shoppingCart.findIndex(x => x.type === type && x.categoryId === categoryId);
    if (itemIndex <= -1) return;

    shoppingCart.splice(itemIndex, 1);

    UpdateShoppingCart();
};

const RemoveAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

const BuyItems = () => {
    if (shoppingCart.length <= 0) return;

    mp.trigger("Client:Tuning:BuyItems", shoppingCart);
};

/*
* '{"tunings":[{"id":1,"name":"Spoiler","displayName":"Spoiler","items":[{"name":"high level","price":999,"type":1},{"name":"low level","price":250,"type":2},{"name":"asdfasdf cool","price":187,"type":3}]},{"id":2,"name":"Front Bumper","displayName":"Front bumper","items":[{"name":"high","price":361,"type":4},{"name":"low","price":888,"type":5},{"name":"cool","price":666,"type":6}]}],"vehicleItems":[{"name":"low level","price":250,"categoryId":1,"type":2}]}'
*/
