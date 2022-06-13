var inventory = mp.browsers.new("package://cef/Inventory/index.html");
inventory.active = false;

mp.events.add("Client:Inventory:TriggerInventory", (name, money, json) => {
    if (inventory != null) {
        inventory.execute(`showInventory('${name}', '${money}', '${json}')`);
        mp.gui.cursor.show(true, true);
        inventory.active = true;
        mp.events.call('Client:ToggleHud', false);
    }
});

mp.events.add("Client:Inventory:HideInventory", () => {
    if (inventory != null) {
        inventory.active = false;
        mp.events.call('Client:ToggleHud', true);
        mp.gui.cursor.show(false, false);
    }
});

mp.events.add("Client:Inventory:MoveItem", (currentSlot, newSlot, currentContainer, newContainer, oldItemID, newItemID, externalOldID, externalOldType, externalNewID, externalNewType) => {
    if (inventory != null) {
        mp.events.callRemote("Server:Inventory:MoveItem", currentSlot, newSlot, currentContainer, newContainer, oldItemID, newItemID, externalOldID, externalOldType, externalNewID, externalNewType);
    }
});

mp.events.add("Client:Inventory:SplitItem", (currentSlot, newSlot, currentContainer, newContainer, itemID, amount, externalOldID, externalOldType, externalNewID, externalNewType) => {
    if (inventory != null) {
        mp.events.callRemote("Server:Inventory:SplitItem", currentSlot, newSlot, currentContainer, newContainer, itemID, amount, externalOldID, externalOldType, externalNewID, externalNewType);
    }
});

mp.events.add("Client:Inventory:UseItem", (container, slot, amount) => {
    if (inventory != null) {
        mp.events.callRemote("Server:Inventory:UseItem", container, slot, amount);
    }
});

mp.events.add("Client:Inventory:GiveItem", (container, slot, amount) => {
    if (inventory != null) {
        mp.events.callRemote("Server:Inventory:GiveItem", container, slot, amount);
    }
});

mp.events.add("Client:Inventory:ThrowItem", (container, slot, amount) => {
    if (inventory != null) {
        mp.events.callRemote("Server:Inventory:ThrowItem", container, slot, amount);
    }
});

mp.events.add("Client:Clothing:SetPlayerClothing", (component, isAccessories) => {
    if (inventory != null) {
        mp.events.callRemote("Server:Clothing:SetPlayerClothing", component, isAccessories);
    }
});

mp.events.add('Client:Inventory:RemoveBackpack', () => {
    if (inventory != null) {
        mp.events.callRemote('Server:Inventory:RemoveBackpack');
    }
});