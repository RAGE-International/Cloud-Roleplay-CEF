var browser = mp.browsers.new("package://cef/PlayerSearch/index.html");
browser.active = false;

mp.events.add("Client:PlayerSearch:Show", (id, json) => {
    if (browser != null) {
        browser.execute(`showInventory('${id}', '${json}')`);
        mp.gui.cursor.show(true, true);
        browser.active = true;
        mp.events.call('Client:ToggleHud', false);
    }
});

mp.events.add("Client:PlayerSearch:Hide", () => {
    if (browser != null) {
        browser.active = false;
        mp.gui.cursor.show(false, false);
        mp.events.call('Client:ToggleHud', true);
    }
});

mp.events.add("Client:PlayerSearch:Update", (json) => {
    if (browser != null) {
        browser.execute(`updateInventory('${json}')`);
    }
});

mp.events.add("Client:PlayerSearch:TakeItem", (id, container, slot, amount) => {
    if (browser != null) {
        mp.events.callRemote("Server:PlayerSearch:TakeItem", id, container, slot, amount);
    }
});

mp.events.add("Client:PlayerSearch:ThrowItem", (id, container, slot, amount) => {
    if (browser != null) {
        mp.events.callRemote("Server:PlayerSearch:ThrowItem", id, container, slot, amount);
    }
});