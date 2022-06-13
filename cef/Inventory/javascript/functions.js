class Container {
    constructor(...args) {
        this.ContainerID = args[0];
        this.MaxSlots = args[1];
        this.MaxWeight = args[2];
        this.CurrentWeight = args[3];
        this.Slots = args[4];
        this.ExternalContainerID = args[5];
        this.ExternalContainerType = args[6];
    }
}

class Slot {
    constructor(...args) {
        this.SlotID = args[0];
        this.Item = args[1];
        this.ItemCount = args[2];
    }
}

class Item {
    constructor(...args) {
        this.Id = args[0];
        this.Image = args[1];
        this.Is_Weapon = args[2];
        this.ItemScript = args[3];
        this.MaxCount = args[4];
        this.Name = args[5];
        this.Weight = args[6];
    }
}

class LastDroppedItem {
    constructor(...args) {
        this.Item = args[0];
        this.OldSlot = args[1];
        this.OldContainer = args[2];
        this.NewSlot = args[3];
        this.NewContainer = args[4];
    }
    isAnythingNull() {
        return this.Item == null || this.OldSlot == null || this.OldContainer == null || this.NewSlot == null || this.NewContainer == null;
    }
}

var ContainerTypes = {
    "Inventar": 1,
    "Rucksack": 2,
    "Kofferraum": 3,
    "Lagerraum": 4,
}

class Memory {
    constructor() {
        this.Containers = [];
        this.Keys = [];
        this.LastInteraction = 0;
        this.IsDragging = false;
        this.LastDraggedItem = new LastDroppedItem(null, null, null, null, null);
    }
    async resetAll() {
        this.Containers = [];
        this.Keys = [];
        this.LastInteraction = 0;
        this.IsDragging = false;
        this.LastDraggedItem = new LastDroppedItem(null, null, null, null, null);

        clearAllContainers();
        toggleActionMenu(false);
        toggleSplitMenu(false);

    }
    async loadAll() {
        await this.resetAll().then(() => {
            if (typeof(arguments[0]) != 'string') return;

            JSON.parse(arguments[0]).forEach(element => {
                this.Containers.push(new Container(element.ContainerID, element.MaxSlots, element.MaxWeight, element.CurrentWeight, element.Slots, element.ExternalContainerID, element.ExternalContainerType));
            });

            for (const x of this.Containers) {

                if (x.ContainerID == ContainerTypes.Inventar) $('#inventory').attr('data-containerId', x.ContainerID);
                if (x.ContainerID == ContainerTypes.Rucksack) $('#backpack').attr('data-containerId', x.ContainerID);
                if (x.ContainerID == ContainerTypes.Kofferraum) $('#trunk').attr('data-containerId', x.ContainerID);
                if (x.ContainerID == ContainerTypes.Lagerraum) $('#storage').attr('data-containerId', x.ContainerID);

                if (x != null) {

                    for (const s of x.Slots) {

                        let element_slot = `<div data-containerId="${x.ContainerID}" data-slotId="${s.SlotID}" class="slot"></div>`;
                        $(`[data-containerId="${x.ContainerID}"] .slots`).append(element_slot);

                        let element_slot_html = this.getSlotElement(x.ContainerID, s.SlotID);

                        if (element_slot_html != null) {
                            this.elementAddDroppable(element_slot_html);
                        }

                        if (s.Item != null && element_slot_html != null) {

                            let element_item = `<div onclick="elementItemOnClick(this)" data-containerId="${x.ContainerID}" data-slotId="${s.SlotID}" class="item" data-count="${s.ItemCount}x"><img class="icon" src="../utils/img/items/${s.Item.Image}.png"></div>`;
                            $(element_slot_html).append(element_item);

                            let element_item_html = this.getItemElement(x.ContainerID, s.SlotID);
                            if (element_item_html != null) {
                                this.elementAddDraggable(element_item_html);
                            }
                        }
                    }
                }
            }

            this.getContainer(ContainerTypes.Inventar).then((value) => {
                if (value != null || value != undefined) toggleInventory(true);
                else toggleInventory(false);
            });

            this.getContainer(ContainerTypes.Rucksack).then((value) => {
                if (value != null || value != undefined) toggleBackpack(true);
                else toggleBackpack(false);
            });

            this.getContainer(ContainerTypes.Kofferraum).then((value) => {
                if (value != null || value != undefined) toggleTrunk(true);
                else toggleTrunk(false);
            });

            this.getContainer(ContainerTypes.Lagerraum).then((value) => {
                if (value != null || value != undefined) toggleStorage(true);
                else toggleStorage(false);
            });

            this.updateContainerWeights();
            RefreshJQueryDrops();
        });
    }

    async getNextFreeSlot(container) {
        return container.find(x => x.Slots.Item == null);
    }
    async getContainer(id) {
        return this.Containers.find(x => x.ContainerID == id);
    }
    async getContainerSlot(container, slotId) {
        if (container != null && slotId != null) {
            return container.Slots.find(x => x.SlotID == slotId);
        }
    }
    async getProzentOfValue() {
        return ((arguments[0] / arguments[1]) * 100).toFixed(0);
    }
    async convertIntoKilo() {
        return parseFloat((arguments[0] / 1000)).toFixed(1);
    }
    async updateContainerWeights() {
        for (const x of this.Containers) {

            switch (x.ContainerID) {
                case ContainerTypes.Inventar:
                    $('#inventory-progressbar').css('width', `${ await this.getProzentOfValue(x.CurrentWeight, x.MaxWeight)}%`)
                    $('#inventory-progressbar-bar-weight').text(`${ await this.convertIntoKilo(x.CurrentWeight)} kg`);
                    $('#inventory-progressbar-bar-max-weight').text(`${ await this.convertIntoKilo(x.MaxWeight)} kg`);
                    break;

                case ContainerTypes.Rucksack:
                    $('#backpack-progressbar').css('width', `${ await this.getProzentOfValue(x.CurrentWeight, x.MaxWeight)}%`)
                    $('#backpack-progressbar-bar-weight').text(`${ await this.convertIntoKilo(x.CurrentWeight)} kg`);
                    $('#backpack-progressbar-bar-max-weight').text(`${await this.convertIntoKilo(x.MaxWeight)} kg`);
                    break;

                case ContainerTypes.Kofferraum:
                    $('#trunk-progressbar').css('width', `${ await this.getProzentOfValue(x.CurrentWeight, x.MaxWeight)}%`)
                    $('#trunk-progressbar-bar-weight').text(`${ await this.convertIntoKilo(x.CurrentWeight)} kg`);
                    $('#trunk-progressbar-bar-max-weight').text(`${ await this.convertIntoKilo(x.MaxWeight)} kg`);
                    break;
                case ContainerTypes.Lagerraum:
                    $('#storage-progressbar').css('width', `${ await this.getProzentOfValue(x.CurrentWeight, x.MaxWeight)}%`)
                    $('#storage-progressbar-bar-weight').text(`${ await this.convertIntoKilo(x.CurrentWeight)} kg`);
                    $('#storage-progressbar-bar-max-weight').text(`${ await this.convertIntoKilo(x.MaxWeight)} kg`);
                    break;
            }
        }
    }
    async resetAllSlotHovers() {
        $('.slot').each((index, element) => {
            $(element).css('border', '0vh solid #0daaff')
        })
    }
    async resetSelectedItem() {
        toggleActionMenu(false);
        toggleSplitMenu(false);
        this.LastDraggedItem = new LastDroppedItem(null, null, null, null, null);
    }

    async setSelectedItem(item, oldSlot, oldContainer, newSlot, newContainer) {

        this.LastDraggedItem = new LastDroppedItem(item, oldSlot, oldContainer, newSlot, newContainer);

        if (item != null) {
            $('#action-menu-item-name').html(`${item.Name}<br>(Gegenstand)`);
            $('#action-menu-item-image').attr('src', `../utils/img/items/${item.Image}.png`)

            $('#split-menu-item-name').html(`${item.Name}<br>(Gegenstand)`);
            $('#split-menu-item-image').attr('src', `../utils/img/items/${item.Image}.png`)

            if (oldSlot != null) {
                $('#action-menu-input').attr('max', `${oldSlot.ItemCount}`)
                $('#split-menu-input').attr('max', `${oldSlot.ItemCount}`)
                return oldSlot.ItemCount > 1;
            }
        }
        return false;
    }

    async trySplitItem(old_container, new_container, old_slot, new_slot, amount) {
        if ((old_container && old_slot) != (new_container && new_slot)) {
            if (new_slot.Item == null) {
                const itemAmount = old_slot.ItemCount;
                if (itemAmount - amount >= 1) {
                    old_slot.ItemCount -= amount;

                    let element_item_html = this.getItemElement(old_container.ContainerID, old_slot.SlotID);

                    if (element_item_html == null) return;

                    $(element_item_html).attr('data-count', `${old_slot.ItemCount}x`);

                    this.elementCreateItem(old_slot.Item, new_container, new_slot, amount);

                    await this.resetSelectedItem();

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

    async tryMoveItem(element_dropbox, element_item, old_container, new_container, old_slot, new_slot) {
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

                $(element_item).attr('data-slotId', new_slot.SlotID);
                $(element_item).attr('data-containerId', new_container.ContainerID);
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
                    console.log(max);
                    console.log("TEST 1");
                    if (new_slot.ItemCount >= max) return false;
                    console.log("TEST 2");
                    let diff = max - new_slot.ItemCount;
                    if (diff <= 0) return false;

                    let newCount = diff > old_slot.ItemCount ? old_slot.ItemCount : diff;
                    if (old_container.ContainerID != new_container.ContainerID) {
                        if (!((new_container.MaxWeight - new_container.CurrentWeight) >= (old_slot.Item.Weight * (new_slot.ItemCount + newCount)))) return false;

                        old_container.CurrentWeight -= old_slot.Item.Weight * newCount;
                        new_container.CurrentWeight += old_slot.Item.Weight * newCount;
                    }
                    new_slot.ItemCount += newCount;
                    old_slot.ItemCount -= newCount;

                    $(`[data-containerId="${new_container.ContainerID}"][data-slotId="${new_slot.SlotID}"]`).attr('data-count', `${new_slot.ItemCount}x`);
                    $(`[data-containerId="${old_container.ContainerID}"][data-slotId="${old_slot.SlotID}"]`).attr('data-count', `${old_slot.ItemCount}x`);

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

    getSlotElement(containerId, slotId) {
        return $(`.slot[data-containerId="${containerId}"][data-slotId="${slotId}"]`);
    }
    getItemElement(containerId, slotId) {
        return $(`.item[data-containerId="${containerId}"][data-slotId="${slotId}"]`);
    }
    elementCreateItem(item, new_container, new_slot, amount) {
        new_slot.Item = item;
        new_slot.ItemCount += parseInt(amount);
        let element_item = `<div onclick="elementItemOnClick(this)" data-containerId="${new_container.ContainerID}" data-slotId="${new_slot.SlotID}" class="item" data-count="${new_slot.ItemCount}x"><img class="icon" src="../utils/img/items/${new_slot.Item.Image}.png"></div>`;

        let element_slot_html = this.getSlotElement(new_container.ContainerID, new_slot.SlotID);
        if (element_slot_html == null) return;

        $(element_slot_html).append(element_item);

        let element_item_html = this.getItemElement(new_container.ContainerID, new_slot.SlotID);
        if (element_item_html != null) {
            this.elementAddDraggable(element_item_html);
        }
    }
    elementAddDraggable(element) {
        $(element).draggable({
            helper: 'clone',
            appendTo: 'body',
            scroll: false,
            containment: "window",
            zIndex: 10000,

            start: function(event, ui) {
                $(this).css('opacity', '0.5')
                memory.IsDragging = true;

                memory.resetSelectedItem();
            },
            stop: function(event, ui) {
                $(this).css('opacity', '1')
                memory.IsDragging = false;
                memory.resetAllSlotHovers();
            }
        });
    }
    elementAddDroppable(element) {

        $(element).droppable({
            drop: function(event, ui) {
                //let attr = ui.draggable.attr('attr');

            },
            over: function(event, ui) {
                if (memory.IsDragging && $(this).html() == "") $(this).css('border', '0.25vh solid #0daaff')
            },
            out: function(event, ui) {
                $(this).css('border', '0vh solid #0daaff')
            }
        });
    }
}

var memory = new Memory();

async function elementItemOnClick(element) {

    let container = await memory.getContainer($(element).attr('data-containerId'));
    if (container == null) return;

    let slot = await memory.getContainerSlot(container, $(element).attr('data-slotId'));
    if (slot == null) return;

    if (slot.Item != null && container.ContainerID == 1) {
        console.log("elementItemOnClick");
        memory.setSelectedItem(slot.Item, slot, container, null, null);
        toggleActionMenu(true);
    }
}

async function tryUseItem() {
    if (memory.LastDraggedItem.OldSlot == null && memory.LastDraggedItem.OldSlot.Item == null) return;

    let value = parseInt($('#action-menu-input').val());

    if (typeof(value) == 'number' && value >= 1) {
        mp.events.call('Client:Inventory:UseItem', 1, memory.LastDraggedItem.OldSlot.SlotID, value);
        memory.resetSelectedItem();
    }
}
async function tryThrowItem() {
    if (memory.LastDraggedItem.OldSlot == null) return;

    let value = parseInt($('#action-menu-input').val());

    if (typeof(value) == 'number' && value >= 1) {
        mp.events.call('Client:Inventory:ThrowItem', 1, memory.LastDraggedItem.OldSlot.SlotID, value)
    }
}
async function tryGiveItem() {
    if (memory.LastDraggedItem.OldSlot == null) return;

    let value = parseInt($('#action-menu-input').val());

    if (typeof(value) == 'number' && value >= 1) {
        mp.events.call('Client:Inventory:GiveItem', 1, memory.LastDraggedItem.OldSlot.SlotID, value)
    }
}

async function applyTrySplitItem() {
    if (memory.LastDraggedItem.isAnythingNull()) return;

    let value = parseInt($('#split-menu-input').val());

    if (typeof(value) == 'number' && value >= 1) {
        await memory.trySplitItem(memory.LastDraggedItem.OldContainer, memory.LastDraggedItem.NewContainer, memory.LastDraggedItem.OldSlot, memory.LastDraggedItem.NewSlot, value)
    }
}
async function cancelTrySplitItem() {
    await memory.resetSelectedItem().then((value) => {});
}