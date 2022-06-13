let window = null;
let isOpen = false;

mp.events.add('Client:CreateHairShop', (rawjson) => {
    if (window == null) {
        window = mp.browsers.new("package://cef/Hairshop/index.html");
        isOpen = true;
        mp.gui.cursor.show(true, true);
        mp.game.ui.displayRadar(false);
        mp.players.local.freezePosition(true);
        if (window != null) {
            window.execute(`LoadHairShop('${mp.players.local.model == mp.game.joaat("mp_f_freemode_01")}' ,'${rawjson}')`);
        }
        mp.events.call('Client:ToggleHud', false);
    }
});

mp.events.add('Client:DestroyHairShop', () => {
    if (window != null) {
        window.destroy();
        window = null;
        isOpen = false;
        mp.game.ui.displayRadar(true);
        mp.players.local.freezePosition(false);
        mp.gui.cursor.show(false, false);
        mp.events.call('Client:ToggleHud', true);
    }
});

mp.events.add("Client:HairShop:TryStyle", (type, style, color, isWomen) => {
    if (window != null) {
        tryStyle(type, style, color, isWomen)
    }
})

mp.events.add("Client:HairShop:BuyStyle", (id, type, color, style) => {
    if (window != null) {
        buyStyle(id, type, style, color)
    }
})

const tryStyle = (type, style, color, isWomen) => {
    if (isWomen === 'true' && mp.players.local.model == mp.game.joaat("mp_f_freemode_01")) {
        switch (type) {
            case 1:
                mp.players.local.setComponentVariation(2, parseInt(style), parseInt(color), 0)
                break
            case 2:
                mp.players.local.setHeadOverlay(2, parseInt(style), 1, parseInt(color), parseInt(color));
                break
            case 3:
                mp.players.local.setHeadOverlay(1, parseInt(style), 1, parseInt(color), parseInt(color));
                break
            default: break
        }
    } else {
        switch (type) {
            case 1:
                mp.players.local.setComponentVariation(2, parseInt(style), parseInt(color), 0)
                break
            case 2:
                mp.players.local.setHeadOverlay(2, parseInt(style), 1, parseInt(color), parseInt(color));
                break
            case 3:
                mp.players.local.setHeadOverlay(1, parseInt(style), 1, parseInt(color), parseInt(color));
                break
            default: break
        }
    }
};

const buyStyle = (id, type, style, color) => {
    mp.events.callRemote("Server:HairShop:BuyStyle", parseInt(id), parseInt(type), parseInt(style), parseInt(color))
};
