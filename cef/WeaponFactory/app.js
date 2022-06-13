let factoryData = null
let activeCategory = 1
let selectedWeapon = null

function SetData(data) {
    factoryData = JSON.parse(data)

    LoadCategories()
    LoadFactoryItems()
    SelectWeapon(1)
    LoadProcessingItems()
}

function LoadCategories() {
    let list = document.getElementById('categories')

    factoryData.Categories.forEach(x => {
        list.innerHTML +=
        `<div class="cat-item" onclick="SelectCategory(${x.Id})">
            <div class="cat-name">${x.Name}</div>
            <img src="./img/categories/${x.Name.toLowerCase().replaceAll(' ', '_')}.png" class="cat-img">
        </div>`
    })

    document.getElementById('title1').innerText = `${factoryData.Categories.find(x => x.Id == activeCategory).Name} Herstellung`
}

function LoadFactoryItems() {
    let list = document.getElementById('weapons')
    let list2 = document.getElementById('ammo')
    list.innerHTML = ''
    list2.innerHTML = ''

    factoryData.Items.forEach(x => {
        const canCraftItem = x.HasWeaponPoints
        if(x.CategoryId == 99){
            list2.innerHTML += `<div class="item nocount" ${canCraftItem ? `onclick="SelectWeapon(${x.Id})"` : ''}><img class="item-img" src="./img/ammo/${x.ProcessedItem.Name.toLowerCase().replaceAll(' ', '_')}.png"></div>`
            return
        }

        if(x.CategoryId != activeCategory) return
        
        list.innerHTML += `<div class="item nocount" ${canCraftItem ? `onclick="SelectWeapon(${x.Id})"` : ''}><img class="item-img" src="./img/weapons/${x.ProcessedItem.Name.toLowerCase().replaceAll(' ', '_')}.png">${canCraftItem ? '' : `<div class="item-locked"></div>`}</div>`
    })
}

function SelectWeapon(id) {
    selectedWeapon = factoryData.Items.find(x => x.Id == id)
    let list = document.getElementById('components')

    list.innerHTML = ''

    selectedWeapon.Items.forEach(x => {
        list.innerHTML += `<div class="item" data-count="${x.Amount}"><img class="item-img" src="./img/components/${x.Item.Name.toLowerCase().replaceAll(' ', '_')}.png"></div>`
    })

    document.getElementById('manu-name').innerText = selectedWeapon.ProcessedItem.Name
    document.getElementById('manu-img').src = `./img/${selectedWeapon.CategoryId == 99 ? 'ammo' : 'weapons'}/${selectedWeapon.ProcessedItem.Name.toLowerCase().replaceAll(' ', '_')}.png`
    document.getElementById('manu-time').innerText = selectedWeapon.ProcessTime + ' min'
}

function LoadProcessingItems() {
    let list = document.getElementById('orders')
    let list2 = document.getElementById('finishedorders')

    factoryData.Orders.forEach(x => {
        switch(x.FactoryStatus) {
            case 0:
                list.innerHTML += `<div class="item nocount" onclick="SelectOrderedWeapon(${x.Id})"><img class="item-img" src="./img/${x.WeaponFactoryItem.CategoryId == 99 ? 'ammo' : 'weapons'}/${x.WeaponFactoryItem.ProcessedItem.Name.toLowerCase().replaceAll(' ', '_')}.png"></div>`
                break
            case 1:
                list2.innerHTML += `<div class="item nocount" onclick="SelectFinishedWeapon(${x.Id})"><img class="item-img" src="./img/${x.WeaponFactoryItem.CategoryId == 99 ? 'ammo' : 'weapons'}/${x.WeaponFactoryItem.ProcessedItem.Name.toLowerCase().replaceAll(' ', '_')}.png"></div>`
                break
        }
    })
}

function SelectCategory(cat) {
    activeCategory = cat

    LoadFactoryItems()
}

function OrderWeapon() {
    if(selectedWeapon == null || undefined) return
    mp.trigger('Client:WeaponFactory:OrderWeapon', selectedWeapon.Id)
}

function SelectOrderedWeapon(id) {
    let item = factoryData.Orders.find(x => x.Id == id)

    document.getElementById('timetime').innerText = Math.round((((new Date(Date.parse(item.EndTime)) - new Date(Date.parse(item.StartTime))) % 86400000) % 3600000) / 60000)
    document.getElementById('time').style.display = 'flex'
}

let selectedItemFInished = null
function SelectFinishedWeapon(id) {
    selectedItemFInished = factoryData.Orders.find(x => x.Id == id)
}

function TakeItem() {
    if(selectedItemFInished == null) return

    mp.trigger('Client:WeaponFactory:TakeItem', selectedItemFInished.Id)
    selectedItemFInished = null
}

function TakeAllItems() {
    mp.trigger('Client:WeaponFactory:TakeAllItems')
}

function CloseMenu() {
    mp.trigger('Client:WeaponFactory:Destroy')
}

SetData(`{"Categories":[{"Id":1,"Name":"Pistolen","Image":"pistol"},{"Id":2,"Name":"SMGs","Image":"pistol"},{"Id":3,"Name":"Sturmgewehre","Image":"pistol"}],"Items":[{"Id":1,"CategoryId":1,"ProcessedItem":{"Id":38,"Name":"Kleine Pistole","Weight":750,"MaxCount":1,"Image":" ","Is_Weapon":true,"ItemScript":"EquipWeapon,453432689"},"Items":[{"Item":{"Id":25,"Name":"Hochwertiges Metallerz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":1},{"Item":{"Id":21,"Name":"Stein","Weight":150,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":3},{"Item":{"Id":14,"Name":"Kupfererz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":5}],"ProcessTime":20,"HasWeaponPoints":true},{"Id":2,"CategoryId":1,"ProcessedItem":{"Id":39,"Name":"Kampf Pistole","Weight":750,"MaxCount":1,"Image":" ","Is_Weapon":true,"ItemScript":"EquipWeapon,1593441988"},"Items":[{"Item":{"Id":13,"Name":"Eisenerz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":1},{"Item":{"Id":18,"Name":"Holzstamm","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":3}],"ProcessTime":15,"HasWeaponPoints":false}],"Orders":[{"Id":1,"AccountId":1,"WeaponFactoryItem":{"Id":1,"CategoryId":1,"ProcessedItem":{"Id":38,"Name":"Kleine Pistole","Weight":750,"MaxCount":1,"Image":" ","Is_Weapon":true,"ItemScript":"EquipWeapon,453432689"},"Items":[{"Item":{"Id":25,"Name":"Hochwertiges Metallerz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":1},{"Item":{"Id":21,"Name":"Stein","Weight":150,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":3},{"Item":{"Id":14,"Name":"Kupfererz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":5}],"ProcessTime":20,"HasWeaponPoints":true},"StartTime":"2022-03-27T14:03:52.4603696+02:00","EndTime":"2022-03-27T14:23:52.4603989+02:00","FactoryStatus":1},{"Id":6,"AccountId":1,"WeaponFactoryItem":{"Id":1,"CategoryId":1,"ProcessedItem":{"Id":38,"Name":"Kleine Pistole","Weight":750,"MaxCount":1,"Image":" ","Is_Weapon":true,"ItemScript":"EquipWeapon,453432689"},"Items":[{"Item":{"Id":25,"Name":"Hochwertiges Metallerz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":1},{"Item":{"Id":21,"Name":"Stein","Weight":150,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":3},{"Item":{"Id":14,"Name":"Kupfererz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":5}],"ProcessTime":20,"HasWeaponPoints":true},"StartTime":"2022-05-11T16:47:50.9055613+02:00","EndTime":"2022-05-11T17:07:50.9056616+02:00","FactoryStatus":1},{"Id":10,"AccountId":1,"WeaponFactoryItem":{"Id":2,"CategoryId":1,"ProcessedItem":{"Id":39,"Name":"Kampf Pistole","Weight":750,"MaxCount":1,"Image":" ","Is_Weapon":true,"ItemScript":"EquipWeapon,1593441988"},"Items":[{"Item":{"Id":13,"Name":"Eisenerz","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":1},{"Item":{"Id":18,"Name":"Holzstamm","Weight":500,"MaxCount":50,"Image":" ","Is_Weapon":false,"ItemScript":" "},"Amount":3}],"ProcessTime":15,"HasWeaponPoints":true},"StartTime":"2022-05-11T16:50:19.9729185+02:00","EndTime":"2022-05-11T17:05:19.972931+02:00","FactoryStatus":1}]}`)