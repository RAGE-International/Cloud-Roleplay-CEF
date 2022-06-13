let window = null;

mp.events.add('Client:House:CreateHouse', (rawJson, playerName) => {
    if (window != null) return;
    window = mp.browsers.new("package://cef/House/index.html");
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayRadar(false);
    mp.events.call('Client:ToggleHud', false);
    if (window != null) {
        window.execute(`loadHouse('${rawJson}', '${playerName}')`);
    }
});

mp.events.add('Client:House:DestroyHouse', () => {
    if (window == null) return;
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    mp.events.call('Client:ToggleHud', true);
    window.destroy();
    window = null;
});

mp.events.add('BuyHouse', (id) => {
    mp.events.callRemote('Server:House:BuyHouse', id)
})

mp.events.add('EnterHouse', (id) => {
    mp.events.callRemote('Server:House:EnterHouse', id)
})

mp.events.add('EnterBasement', (id) => {
    mp.events.callRemote('Server:House:EnterBasement', id)
})

mp.events.add('StartRent', (id) => {
    mp.events.callRemote('Server:House:StartRent', id)
})

mp.events.add('CancelRent', (id) => {
    mp.events.callRemote('Server:House:CancelRent', id)
})

mp.events.add('KickRenter', (id) => {
    mp.events.callRemote('Server:House:KickRenter', id)
})

mp.events.add('SaveRenter', (id, price) => {
    mp.events.callRemote('Server:House:SaveRenter', id, price)
})

mp.events.add('TakeHouseVehicle', (houseId, vehicleId) => {
    mp.events.callRemote('Server:House:TakeHouseVehicle', houseId, vehicleId)
})

mp.events.add('ParkHouseVehicle', (houseId, vehicleId) => {
    mp.events.callRemote('Server:House:ParkHouseVehicle', houseId, vehicleId)
})