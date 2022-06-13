let window = null;
let isOpen = false;

mp.events.add('Client:Farming:ProcessorSpot', (rawjson) => {
    if (window == null) {
        window = mp.browsers.new("package://cef/Verarbeiter/index.html");
        isOpen = true;
        mp.gui.cursor.show(true, true);
        mp.game.ui.displayRadar(false);
        mp.players.local.freezePosition(true);
        if (window != null) {
            window.execute(`loadVerarbeiter('${rawjson}')`);
        }
        mp.events.call('Client:ToggleHud', true);

    }
});

mp.events.add('Client:Farming:ProcessorSpotDestory', () => {
    if (window != null) {
        window.destroy();
        window = null;
        isOpen = false;
        mp.game.ui.displayRadar(true);
        mp.players.local.freezePosition(false);
        mp.gui.cursor.show(false, false);
        mp.events.call('Client:ToggleHud', false);
    }
});

mp.events.add('Client:Farming:ProcessProcessorSpot', (processorId, vehicleId) => {
    if (window != null) {
        mp.events.callRemote("Server:Farming:ProcessProcessorSpot", processorId, vehicleId)
    }
})