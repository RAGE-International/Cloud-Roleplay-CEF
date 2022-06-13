let GasStation = null;

mp.events.add("Client:Create:GasStation", (GasStationJson, SelectedVehicleJson) => {
    if (GasStation == null) {
        GasStation = mp.browsers.new("package://cef/GasStation/index.html");
        GasStation.active = true;
        mp.gui.cursor.show(true, true);
        mp.game.ui.displayRadar(false);
        GasStation.execute(`ShowGasStation('${GasStationJson}', '${SelectedVehicleJson}')`);
    }
});

mp.events.add("Client:Destroy:GasStation", () => {
    if (GasStation != null) {
        GasStation.destroy();
        GasStation = null;
        mp.gui.cursor.show(false, false);
        mp.game.ui.displayRadar(true);
    }
});


mp.events.add("Client:GasStation:PayGas", (gasStationId, vehicleId, selectedFuelType, addedFuel, price) => {
    if (GasStation != null) {
        mp.events.callRemote("Server:GasStation:PayFuel", gasStationId, vehicleId, selectedFuelType, addedFuel, price)
    }
});