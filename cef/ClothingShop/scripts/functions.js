let ClothingShopItems = [];
let LetMpDefined = false;
let ClothingMaxColors = 0;
let ClothingTexture = 0;

function SetMpDefinde() {
    LetMpDefined = true;
}

function ClothingModel(...args) {
    this.id = args[0];
    this.name = args[1];
    this.price = args[2];
    this.component_id = args[3];
    this.drawable = args[4];
    this.texture = args[5];
    this.maxtextures = args[6]
    this.is_accessories = args[7];
    this.is_women = args[8];
};

let SelectedItem = {
    id: null,
    name: null,
    price: null,
    component_id: null,
    drawable: null,
    texture: null,
    maxtextures: null,
    is_accessories: null,
    is_women: null,
}


function SetClothingShopItems(rawjson) {
    ClothingShopItems = [];
    let json = JSON.parse(rawjson);
    setTimeout(() => {
        json.forEach(element => {
            AddClothingItem(element.Id, element.Name, element.Price, element.ComponentId, element.Drawable, element.Texture, element.MaxTextures, element.Is_Accessories, element.Is_Women);
        });
    }, 250);
}

function AddClothingItem(id, name, price, component_id, drawable, texture, maxtextures, is_accessories, is_women) {
    ClothingShopItems.push(new ClothingModel(id, name, price, component_id, drawable, texture, maxtextures, is_accessories, is_women));
};

function RemoveClothingItem(id) {
    ClothingShopItems.splice(ClothingShopItems.find(x => x.id == id), 1);
};

function GetClothingModel(id) {
    return ClothingShopItems.find(x => x.id == id);
};

function SetSelectedItem(clothingModel) {
    SelectedItem.id = clothingModel.id;
    SelectedItem.name = clothingModel.name;
    SelectedItem.price = clothingModel.price;
    SelectedItem.component_id = clothingModel.component_id;
    SelectedItem.drawable = clothingModel.drawable;
    SelectedItem.texture = clothingModel.texture;
    SelectedItem.maxtextures = clothingModel.maxtextures;
    SelectedItem.is_accessories = clothingModel.is_accessories;
    SelectedItem.is_women = clothingModel.is_women;
    CalculateSelectedItemInfo();
};

function ResetSelectedItem() {
    SelectedItem.id = null;
    SelectedItem.name = null;
    SelectedItem.price = null;
    SelectedItem.component_id = null;
    SelectedItem.drawable = null;
    SelectedItem.texture = null;
    SelectedItem.is_accessories = null;
    SelectedItem.is_women = null;
};

function CalculateSelectedItemInfo() {
    if (SelectedItem.name == null || SelectedItem.price == null) {
        $('.clothing-info-name').text(`Keine Auswahl`);
        $('.clothing-info-price').text(`${0} $`);
    } else {
        $('.clothing-info-name').text(`${SelectedItem.name}`);
        $('.clothing-info-price').text(`${SelectedItem.price} $`);
    }
}

function OnItemClick(element) {
    let item_id = $(element).attr('data-id');
    if (item_id != null) {
        let itemModel = GetClothingModel(item_id);
        if (itemModel != null) {
            SetSelectedItem(itemModel);
            $(".hat-item-elem").each(function(index) {
                $(this).removeClass("active")
            });
            $(element).addClass("active")
            $('.hat-item2-color-inner2').fadeIn(500)
            SetClothingMaxTexture(itemModel.maxtextures)
            mp.events.call('Client:TryClothes', SelectedItem.component_id, SelectedItem.drawable, 0, SelectedItem.is_accessories);
        }
    }
}

function OnSelectionClick(element, selection_id, is_accessories) {

    $('.hat-item2-color-inner2').css('display', 'none')
    $(".hat-item-inner").each(function(index) {
        $(this).removeClass("active")
    });
    $(element).addClass("active");
    LoadAllCategoryItems(selection_id, is_accessories);
    if (LetMpDefined) {
        ResotrePlayerClothes();
        ResetSelectedItem();
        CalculateSelectedItemInfo();

        if (selection_id == 0 && is_accessories || selection_id == 1 && is_accessories || selection_id == 2 && is_accessories || selection_id == 1 && !is_accessories) {
            mp.events.call('client:setcamflag', 2);
        }
        if (selection_id == 7 && !is_accessories || selection_id == 3 && !is_accessories) {
            mp.events.call('client:setcamflag', 1);
        }
        if (selection_id == 6 && !is_accessories) {
            mp.events.call('client:setcamflag', 4);
        }
        if (selection_id == 5 && !is_accessories) {
            mp.events.call('client:setcamflag', 5);
        }
        if (selection_id == 11 && !is_accessories || selection_id == 8 && !is_accessories) {
            mp.events.call('client:setcamflag', 0);
        }
        if (selection_id == 4 && !is_accessories) {
            mp.events.call('client:setcamflag', 6);
        }
        if (selection_id == 6 && is_accessories) {
            mp.events.call('client:setcamflag', 0) // 7;
            PlayWatchAnimation(true);
            return;
        }
        PlayWatchAnimation(false);
    }
}

function LoadAllCategoryItems(component_id, is_accessories) {
    $(".hat-item2-inner").html("");
    setTimeout(() => {
        for (const item of ClothingShopItems) {
            console.log(item);
            if (item.component_id == component_id && item.is_accessories == is_accessories) {
                let element = `<div onclick="OnItemClick(this)" data-accessories="${is_accessories}" data-id="${item.id}" class="hat-item-elem">${item.name}</div>`;
                $(".hat-item2-inner").append(element).fadeIn(500);
            }
        }
    }, 1);
}

function SetClothingMaxTexture(maxtexture) {
    ClothingMaxColors = maxtexture;
    config.range = { 'min': 0, 'max': ClothingMaxColors };
    slider_color_selection.noUiSlider.updateOptions(config);
    $('.color-selection-colornumber').text(`${0}/${ClothingMaxColors}`)
}

function ResotrePlayerClothes() {
    mp.events.call("Client:ResotrePlayerClothes");
}

var slider_color_selection = document.getElementById('slider-color-selection');
var slider_player_rotation = document.getElementById('slider-player-rotation');

noUiSlider.create(slider_color_selection, {
    start: [0],
    connect: [true, false],
    step: 1,
    range: {
        'min': 0,
        'max': 20
    }
});

noUiSlider.create(slider_player_rotation, {
    start: [0],
    connect: [true, false],
    step: 1,
    range: {
        'min': 0,
        'max': 360
    }
});

slider_color_selection.noUiSlider.on('update', function(values, handle) {
    $('.color-selection-colornumber').text(`${parseInt(values[0])}/${ClothingMaxColors}`)
    if (LetMpDefined) {
        ClothingTexture = parseInt(values[0]);
        mp.events.call('Client:TryClothes', SelectedItem.component_id, SelectedItem.drawable, parseInt(values[0]), SelectedItem.is_accessories);
    }
});

slider_player_rotation.noUiSlider.on('update', function(values, handle) {
    if (LetMpDefined) {
        mp.events.call('client:setHeading', parseFloat(values[0]));
    }
});

function SetPlayerSpiderRotationValue(_value) {
    slider_player_rotation.noUiSlider.set([parseFloat(_value)]);
}

config = {
    start: [0],
    connect: [true, false],
    step: 1,
    range: {
        'min': 0,
        'max': 20
    }
};

// setTimeout(() => {
//     OnSelectionClick($('.hat-item-inner[data="hats"]'), 0, true)
// }, 1500);

function BuyCurrentClothingItem() {
    if (SelectedItem.id != null) {
        mp.events.call('Client:BuyClothes', SelectedItem.id, ClothingTexture);
    }
}

function CloseIconHover(state) {
    if (state) {
        $('.hat-area-inner2 #close').css('display', 'none')
        $('.hat-area-inner2 #shirt').fadeIn(100)
    } else {
        $('.hat-area-inner2 #shirt').css('display', 'none')
        $('.hat-area-inner2 #close').fadeIn(100)
    }
}

function CloseClothingShop() {
    ResotrePlayerClothes();
    mp.events.call('Client:DestoryClothingShop');
}

let IsPlayAnim = false;
let IsWatchAnim = false;

function PlayerPlayAnimation() {
    IsPlayAnim = !IsPlayAnim;
    mp.events.call('Client:ClothingShopPlayStayAnimation', IsPlayAnim, "anim@heists@ornate_bank@chat_manager", "average_clothes");
}

function PlayWatchAnimation(state) {
    IsWatchAnim = state;
    mp.events.call('Client:ClothingShopPlayStayAnimation', IsWatchAnim, "anim@random@shop_clothes@watches", "idle_e");
}