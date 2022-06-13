var Tattooshop = null;

// CEF Browser

mp.events.add('Client:CreateTattooshop', () => {
    if (Tattooshop != null) return;
    Tattooshop = mp.browsers.new("package://cef/Tattooshop/index.html");
    mp.gui.cursor.show(true, true);
    mp.events.call('Client:ToggleHud', false);
    mp.game.ui.displayRadar(false);
    mp.events.call('client:setcam', true);
    mp.events.call('client:setcamflag', 0);
});

mp.events.add('Client:DestoryTattooshop', () => {
    if (Tattooshop == null) return;
    Tattooshop.destroy();
    Tattooshop = null;
    mp.gui.cursor.show(false, false);
    mp.events.call('Client:ToggleHud', true);
    mp.game.ui.displayRadar(true);
    mp.events.call('client:setcam', false);
});

mp.events.add("Client:Tattoo:TryTattoo", (overlay, hash) => {
    if (Tattooshop != null) {
        if (hash == null || hash == undefined) {
            return;
        }
    
        // TODO: Set user Tattoo Clientside for Try On
        mp.players.local.setDecoration(mp.game.joaat(overlay), mp.game.joaat(hash));
    }
});

mp.events.add("Client:Tattoo:BuyTattoo", (itemId) => {
    if (Tattooshop != null) {
        if (hash == null || hash == undefined || itemId == null || itemId == undefined) {
            return;
        }
    
        mp.events.callRemote("Server:Tattoo:BuyTattoo", itemId);
    }
});
