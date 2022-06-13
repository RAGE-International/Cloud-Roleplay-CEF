//objects
function Container(...args) {
    this.ContainerID = args[0];
    this.MaxSlots = args[1];
    this.MaxWeight = args[2];
    this.CurrentWeight = args[3];
    this.Slots = args[4];
    this.ExternalContainerID = args[5];
    this.ExternalContainerType = args[6];
}

function Slot(...args) {
    this.SlotID = args[0];
    this.Item = args[1];
    this.ItemCount = args[2];
}

function Item(...args) {
    this.Id = args[0];
    this.Image = args[1];
    this.Is_Weapon = args[2];
    this.ItemScript = args[3];
    this.MaxCount = args[4];
    this.Name = args[5];
    this.Type = args[6];
    this.Weight = args[7];
}

//objects end

//arrays
let Containers = [];
let LastDragAt = 0;

let CurrentDroppedItem = {
    item: null,
    old_slot: null,
    old_container: null,
    new_slot: null,
    new_container: null,
};
//arrays end

//functions

function CheckLastDrag() {
    if (LastDragAt + 750 < Date.now()) {
        return true;
    }
    return false;
}

async function ResetAll() {
    Containers = [];

    CurrentDroppedItem.item = null;
    CurrentDroppedItem.old_slot = null;
    CurrentDroppedItem.old_container = null;
    CurrentDroppedItem.new_slot = null;
    CurrentDroppedItem.new_container = null;

    $('.pocket-items').html("");
    $('.keychain-items').html("");
    $('.wallet-items').html("");
    $('.backpack-items').html("");
    $('.trunk-items').html("");
    $('.weapons').html("");
    $(`.item-scale-menu`).css('display', 'none')
    $('.item-interact-menu').css('display', 'none');
}


async function LoadContainer(rawJson) {
    await ResetAll();

    JSON.parse(rawJson).forEach(element => {
        Containers.push(new Container(element.ContainerID, element.MaxSlots, element.MaxWeight, element.CurrentWeight, element.Slots, element.ExternalContainerID, element.ExternalContainerType));
    });

    for (let i = 0; i < Containers.length; i++) {
        let container = Containers[i];

        if (container.ContainerID == 1) /* HOSENTASCHEN */ {
            for (let i = 0; i < container.Slots.length; i++) {
                let slot_element = `<div data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}" class="pocket-item"></div>`;
                $('.pocket-items').append(slot_element);
                //load all items
                if (container.Slots[i].Item != null) {
                    let item_element = `
                <div onclick="toggleItemInteractMenu(true,this)" storage="${container.Slots[i].Item.Name}" data-container-id="${container.ContainerID}" data-slot-id="${container.Slots[i].SlotID}" class="item-model">
                    <img src="../utils/img/items/${container.Slots[i].Item.Image}.png" alt="">
                    <div class="item-model-count">${container.Slots[i].ItemCount}</div>
                </div>`;
                    $(`.pocket-item[data-ContainerID="${container.ContainerID}"][data-SlotID="${container.Slots[i].SlotID}"]`).append(item_element);
                    addDraggable(`[data-container-id="${container.ContainerID}"][data-slot-id="${container.Slots[i].SlotID}"]`);
                }
            }
            $('#pocket-items-progressbar-bar-weight').text((container.CurrentWeight / 1000) + " kg");
            $('#pocket-items-progressbar-bar-max-weight').text((container.MaxWeight / 1000) + " kg");
        } else if (container.ContainerID == 2) /* SCHLÜSSELBUND */ {
            for (let i = 0; i < container.Slots.length; i++) {
                let slot_element = `<div data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}" class="pocket-item"></div>`;
                $('.keychain-items').append(slot_element);
                //load all items
                if (container.Slots[i].Item != null) {
                    let item_element = `
                <div storage="${container.Slots[i].Item.Name}" data-container-id="${container.ContainerID}" data-slot-id="${container.Slots[i].SlotID}" class="item-model">
                    <img src="../utils/img/items/${container.Slots[i].Item.Image}.png" alt="">
                    <div class="item-model-count">${container.Slots[i].ItemCount}</div>
                </div>`;
                    $(`.pocket-item[data-ContainerID="${container.ContainerID}"][data-SlotID="${container.Slots[i].SlotID}"]`).append(item_element);
                }
            }
        } else if (container.ContainerID == 3) /* DOKUMENTE */ {
            for (let i = 0; i < container.Slots.length; i++) {
                let slot_element = `<div data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}" class="pocket-item"></div>`;
                $('.wallet-items').append(slot_element);
                //load all items
                if (container.Slots[i].Item != null) {
                    let item_element = `
                <div storage="${container.Slots[i].Item.Name}" data-container-id="${container.ContainerID}" data-slot-id="${container.Slots[i].SlotID}" class="item-model">
                    <img src="../utils/img/items/${container.Slots[i].Item.Image}.png" alt="">
                    <div class="item-model-count">${container.Slots[i].ItemCount}</div>
                </div>`;
                    $(`.pocket-item[data-ContainerID="${container.ContainerID}"][data-SlotID="${container.Slots[i].SlotID}"]`).append(item_element);
                }
            }
        } else if (container.ContainerID == 4) /* WAFFENSLOTS */ {
            //TO DO
            for (let i = 0; i < container.Slots.length; i++) {
                let slot_element = ``;
                switch (container.Slots[i].SlotID) {
                    case 0:
                        slot_element = `<div id="weapon" class="usable" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/10.png" alt=""></div>`;
                        break;
                    case 1:
                        slot_element = `<div id="weapon" class="usable" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/28.png" alt=""></div>`;
                        break;
                    case 2:
                        slot_element = `<div id="weapon" class="usable" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/13.png" alt=""></div>`;
                        break;
                    case 3:
                        slot_element = `<div id="weapon" class="weapon long" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/26.png" alt=""></div>`;
                        break;
                    case 4:
                        slot_element = `<div id="weapon" class="weapon hand" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/30.png" alt=""></div>`;
                        break;
                    case 5:
                        slot_element = `<div id="weapon" class="weapon hand" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/30.png" alt=""></div>`;
                        break;
                    case 6:
                        slot_element = `<div id="weapon" class="weapon meele" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/25.png" alt=""></div>`;
                        break;
                    case 7:
                        slot_element = `<div id="weapon" class="weapon meele" data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}"><img class="iconimg usableimg" src="./img/23.png" alt=""></div>`;
                        break;
                    default:
                        break;
                }
                $('.weapons').append(slot_element);
                //load all items
                if (container.Slots[i].Item != null) {
                    let item_element = `
                <div onclick="toggleItemInteractMenu(true,this)" storage="${container.Slots[i].Item.Name}" data-container-id="${container.ContainerID}" data-slot-id="${container.Slots[i].SlotID}" class="item-model">
                    <img src="../utils/img/items/${container.Slots[i].Item.Image}.png" alt="">
                    <div class="item-model-count">${container.Slots[i].ItemCount}</div>
                </div>`;
                    $(`#weapon[data-ContainerID="${container.ContainerID}"][data-SlotID="${container.Slots[i].SlotID}"]`).append(item_element);
                    addDraggable(`[data-container-id="${container.ContainerID}"][data-slot-id="${container.Slots[i].SlotID}"]`);
                }
            }

        } else if (container.ContainerID == 5) /* RUCKSACK */ {
            for (let i = 0; i < container.Slots.length; i++) {
                let slot_element = `<div data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}" class="pocket-item"></div>`;
                $('.backpack-items').append(slot_element);
                //load all items
                if (container.Slots[i].Item != null) {
                    let item_element = `
                <div onclick="toggleItemInteractMenu(true,this)" storage="${container.Slots[i].Item.Name}" data-container-id="${container.ContainerID}" data-slot-id="${container.Slots[i].SlotID}" class="item-model">
                    <img src="../utils/img/items/${container.Slots[i].Item.Image}.png" alt="">
                    <div class="item-model-count">${container.Slots[i].ItemCount}</div>
                </div>`;
                    $(`.pocket-item[data-ContainerID="${container.ContainerID}"][data-SlotID="${container.Slots[i].SlotID}"]`).append(item_element);
                    addDraggable(`[data-container-id="${container.ContainerID}"][data-slot-id="${container.Slots[i].SlotID}"]`);
                }
            }
            $('#backpack-items-progressbar-bar-weight').text((container.CurrentWeight / 1000) + " kg");
            $('#backpack-items-progressbar-bar-max-weight').text((container.MaxWeight / 1000) + " kg");
        } else if (container.ContainerID == 6) /* KOFFERRAUM */ {
            for (let i = 0; i < container.Slots.length; i++) {
                let slot_element = `<div data-ContainerID="${container.ContainerID}" data-SlotID="${container.Slots[i].SlotID}" class="pocket-item"></div>`;
                $('.trunk-items').append(slot_element);
                //load all items
                if (container.Slots[i].Item != null) {
                    let item_element = `
                <div onclick="toggleItemInteractMenu(true,this)" storage="${container.Slots[i].Item.Name}" data-container-id="${container.ContainerID}" data-slot-id="${container.Slots[i].SlotID}" class="item-model">
                    <img src="../utils/img/items/${container.Slots[i].Item.Image}.png" alt="">
                    <div class="item-model-count">${container.Slots[i].ItemCount}</div>
                </div>`;
                    $(`.pocket-item[data-ContainerID="${container.ContainerID}"][data-SlotID="${container.Slots[i].SlotID}"]`).append(item_element);
                    addDraggable(`[data-container-id="${container.ContainerID}"][data-slot-id="${container.Slots[i].SlotID}"]`);
                }
            }
            $('#trunk-items-progressbar-bar-weight').text((container.CurrentWeight / 1000) + " kg");
            $('#trunk-items-progressbar-bar-max-weight').text((container.MaxWeight / 1000) + " kg");
        }

        if (getContainer(5) == null) {
            toggleBackpack(false);
        } else {
            toggleBackpack(true);
        }

        if (getContainer(6) == null) {
            toggleStorage(false);
        } else {
            toggleStorage(true);
        }
    }

    setTimeout(() => {
        UpdateAllContainerWeights();
        RefreshJQueryDrops();
    }, 5);
}


function applyAmountInput(element) {
    if (element != null) {
        console.log("12");
        let action = $(element).attr('data-action');
        if (action == null) return;
        switch (action) {
            case 'split':
                console.log("SPLIT ITEM");
                if (CurrentDroppedItem.item != null && CurrentDroppedItem.new_container != null && CurrentDroppedItem.new_slot != null && CurrentDroppedItem.old_container != null && CurrentDroppedItem.old_slot != null) {
                    let value = $('#item-scale-input').val();
                    if (value.length) {
                        if (parseInt(value) >= 1 && parseInt(value) <= CurrentDroppedItem.old_slot.ItemCount) {
                            splitItem(CurrentDroppedItem.old_container, CurrentDroppedItem.new_container, CurrentDroppedItem.old_slot, CurrentDroppedItem.new_slot, value);
                        }
                    }
                }
                break;
            case 'throw':
                console.log("DROP ITEM");
                if (CurrentDroppedItem.old_slot != null && CurrentDroppedItem.item != null) {
                    let value = $('#item-scale-input').val();
                    if (value.length) {
                        if (parseInt(value) >= 1 && parseInt(value) <= CurrentDroppedItem.old_slot.ItemCount) {
                            mp.events.call('Client:Inventory:ThrowItem', 1, CurrentDroppedItem.old_slot.SlotID, value)
                        }
                    }
                }
                break;
            case 'give':
                console.log("GIVE ITEM");
                if (CurrentDroppedItem.old_slot != null && CurrentDroppedItem.item != null) {
                    let value = $('#item-scale-input').val();
                    if (value.length) {
                        if (parseInt(value) >= 1 && parseInt(value) <= CurrentDroppedItem.old_slot.ItemCount) {
                            mp.events.call('Client:Inventory:GiveItem', 1, CurrentDroppedItem.old_slot.SlotID, value)
                        }
                    }
                }
                break;

            default:
                break;
        }
    }
}

function createNewItem(item, new_container, new_slot, amount) {
    new_slot.Item = item;
    new_slot.ItemCount += parseInt(amount);
    let item_element = `
                <div onclick="toggleItemInteractMenu(true,this)" storage="${item.Name}" data-container-id="${new_container.ContainerID}" data-slot-id="${new_slot.SlotID}" class="item-model">
                    <img src="../utils/img/items/${item.Image}.png" alt="">
                    <div class="item-model-count">${amount}</div>
                </div>`;
    $(`.pocket-item[data-ContainerID="${new_container.ContainerID}"][data-SlotID="${new_slot.SlotID}"]`).append(item_element);
    addDraggable(`[data-container-id="${new_container.ContainerID}"][data-slot-id="${new_slot.SlotID}"]`);
}


function splitItem(old_container, new_container, old_slot, new_slot, amount) {
    if ((old_container && old_slot) != (new_container && new_slot)) {
        if (new_slot.Item == null) {
            const itemAmount = old_slot.ItemCount;
            if (itemAmount - amount >= 1) {
                old_slot.ItemCount -= amount;
                $(`[data-container-id="${old_container.ContainerID}"][data-slot-id="${old_slot.SlotID}"]`).find('.item-model-count').text(`${old_slot.ItemCount}`)
                createNewItem(old_slot.Item, new_container, new_slot, amount);
                toggleAmountInput(false, "split", null);
                mp.trigger(
                    "Client:Inventory:SplitItem",
                    old_slot.SlotID, new_slot.SlotID,
                    old_container.ContainerID, new_container.ContainerID,
                    old_slot.Item.Id, amount,
                    old_container.ExternalContainerID, old_container.ExternalContainerType,
                    new_container.ExternalContainerID, new_container.ExternalContainerType
                );
            }
        }
    }
}

function moveItem(element_dropbox, element_item, old_container, new_container, old_slot, new_slot) {
    if ((old_container && old_slot) != (new_container && new_slot)) {
        if (new_slot.Item == null) {
            if (new_container.ContainerID != old_container.ContainerID) {
                if (!((new_container.MaxWeight - new_container.CurrentWeight) >= (old_slot.Item.Weight * old_slot.ItemCount))) return false;

                old_container.CurrentWeight -= old_slot.Item.Weight * old_slot.ItemCount;
                new_container.CurrentWeight += old_slot.Item.Weight * old_slot.ItemCount;
            }

            new_slot.Item = old_slot.Item;
            new_slot.ItemCount = old_slot.ItemCount;

            old_slot.Item = null;
            old_slot.ItemCount = 0;

            //add data to element
            $(element_item).attr('data-slot-id', new_slot.SlotID);
            $(element_item).attr('data-container-id', new_container.ContainerID);
            $(element_dropbox).append(element_item);

            mp.trigger(
                "Client:Inventory:MoveItem",
                old_slot.SlotID, new_slot.SlotID,
                old_container.ContainerID, new_container.ContainerID,
                new_slot.Item.Id, null,
                old_container.ExternalContainerID, old_container.ExternalContainerType,
                new_container.ExternalContainerID, new_container.ExternalContainerType
            );
            return true;
        } else {
            if (new_slot.Item == null || old_slot.Item == null) return;
            if (new_slot.Item.Id == old_slot.Item.Id) {
                const max = new_slot.Item.MaxCount;
                if (new_slot.ItemCount >= max) return false;

                let diff = max - new_slot.ItemCount;
                if (diff <= 0) return false;

                let newCount = diff > old_slot.ItemCount ? old_slot.ItemCount : diff;
                if (old_container.ContainerID != new_container.ContainerID) {
                    if (!((new_container.MaxWeight - new_container.CurrentWeight) >= (old_slot.Item.Weight * (new_slot.ItemCount + newCount)))) return false;

                    old_container.CurrentWeight -= old_slot.Item.Weight * newCount;
                    new_container.CurrentWeight += old_slot.Item.Weight * newCount;
                    console.log(old_container.CurrentWeight);
                    console.log(new_container.CurrentWeight);

                }
                new_slot.ItemCount += newCount;
                old_slot.ItemCount -= newCount;

                $(`[data-container-id="${new_container.ContainerID}"][data-slot-id="${new_slot.SlotID}"]`).find('.item-model-count').text(`${new_slot.ItemCount}`)
                $(`[data-container-id="${old_container.ContainerID}"][data-slot-id="${old_slot.SlotID}"]`).find('.item-model-count').text(`${old_slot.ItemCount}`)

                $(`[data-container-id="${new_container.ContainerID}"][data-slot-id="${new_slot.SlotID}"]`).find('img').addClass('stack');

                setTimeout(() => {
                    $(`[data-container-id="${new_container.ContainerID}"][data-slot-id="${new_slot.SlotID}"]`).find('img').removeClass('stack');
                }, 500);

                if (old_slot.ItemCount == 0) {
                    old_slot.Item = null;
                    $(element_item).remove();
                }

                mp.trigger(
                    "Client:Inventory:MoveItem",
                    old_slot.SlotID, new_slot.SlotID,
                    old_container.ContainerID, new_container.ContainerID,
                    new_slot.Item.Id, new_slot.Item.Id,
                    old_container.ExternalContainerID, old_container.ExternalContainerType,
                    new_container.ExternalContainerID, new_container.ExternalContainerType
                );
                return true;
            }
        }
    }
    return false;
}

function UseItem() {
    if (CurrentDroppedItem.old_slot == null) return;
    if (CurrentDroppedItem.old_slot.Item != null) {
        toggleItemInteractMenu(false, null);
        // toggleAmountInput(true, "give", $(`[data-container-id="${1}"][data-slot-id="${CurrentDroppedItem.old_slot.SlotID}"]`)[0])
        mp.events.call('Client:Inventory:UseItem', 1, CurrentDroppedItem.old_slot.SlotID);
        CurrentDroppedItem.item = null;
        CurrentDroppedItem.old_slot = null;
        CurrentDroppedItem.old_container = null;
        CurrentDroppedItem.new_slot = null;
        CurrentDroppedItem.new_container = null;
    }
}

function GiveItem() {
    if (CurrentDroppedItem.old_slot == null) return;
    if (CurrentDroppedItem.old_slot.Item != null) {
        toggleItemInteractMenu(false, null);
        toggleAmountInput(true, "give", $(`[data-container-id="${1}"][data-slot-id="${CurrentDroppedItem.old_slot.SlotID}"]`)[0])
    }
}

function ThrowItem() {
    if (CurrentDroppedItem.old_slot == null) return;
    if (CurrentDroppedItem.old_slot.Item != null) {
        toggleItemInteractMenu(false, null);
        toggleAmountInput(true, "throw", $(`[data-container-id="${1}"][data-slot-id="${CurrentDroppedItem.old_slot.SlotID}"]`)[0])
    }
}

//function end

//helpers

function getContainer(container_id) {
    for (let i = 0; i < Containers.length; i++) {
        if (Containers[i].ContainerID == container_id) {
            return Containers[i];
        }
    }
};

function getSlot(container, slot_id) {
    for (let i = 0; i < container.Slots.length; i++) {
        if (container.Slots[i].SlotID == slot_id) {
            return container.Slots[i];
        }
    }
}

function addDraggable(element) {
    $(element).draggable({
        helper: 'clone',
        appendTo: 'body',
        scroll: false,
        containment: "window",
        zIndex: 10000,

        start: function(event, ui) {
            $(this).css('opacity', '0');

            toggleAmountInput(false, null, null);
            toggleItemInteractMenu(false, null);

            if (event.button === 0 && event.button === 2) return;

            if (!CheckLastDrag()) {
                $(this).css('opacity', '1');
                console.warn("delay active");
                return false;
            }

        },
        stop: function(event, ui) {
            $(this).css('opacity', '1');
            LastDragAt = Date.now();
        }
    });
}

function getProzentOfValue(prozentwert, grundwert) {
    return ((prozentwert / grundwert) * 100).toFixed(0);
}

function getKilo(value) {
    return (value / 1000);
}

function UpdateAllContainerWeights() {
    for (let i = 0; i < Containers.length; i++) {
        const container = Containers[i];
        if (container != null) {
            let containerWeight = container.CurrentWeight;
            let containerMaxWeight = container.MaxWeight;
            const prozent = getProzentOfValue(containerWeight, containerMaxWeight);
            switch (container.ContainerID) {
                case 1:
                    $('#pocket-items-progressbar').css('width', `${prozent}%`)
                    $('#pocket-items-progressbar-bar-weight').text(`${getKilo(containerWeight)} kg`);
                    $('#pocket-items-progressbar-bar-max-weight').text(`${getKilo(containerMaxWeight)} kg`);
                    break;

                case 5:
                    $('#backpack-items-progressbar').css('width', `${prozent}%`)
                    $('#backpack-items-progressbar-bar-weight').text(`${getKilo(containerWeight)} kg`);
                    $('#backpack-items-progressbar-bar-max-weight').text(`${getKilo(containerMaxWeight)} kg`);
                    break;

                case 6:
                    $('#trunk-items-progressbar').css('width', `${prozent}%`)
                    $('#trunk-items-progressbar-bar-weight').text(`${getKilo(containerWeight)} kg`);
                    $('#trunk-items-progressbar-bar-max-weight').text(`${getKilo(containerMaxWeight)} kg`);
                    break;
            }
        }
    }
}