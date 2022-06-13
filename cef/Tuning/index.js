let tuningMenu = null;

mp.events.add({
    "Client:Tuning:CreateBrowser": (data) => {
        if (tuningMenu !== null) return;

        tuningMenu = mp.browsers.new("package://cef/Tuning/index.html");

        mp.gui.cursor.show(true, true);

        setTimeout(() => {
            tuningMenu.execute(`InitTuning(${data})`);
        }, 120);
    },
    "Client:Tuning:DeleteBrowser": () => {
        if (tuningMenu === null) return;

        tuningMenu.destroy();
        tuningMenu = null;
        mp.gui.cursor.show(false, false);
    },
    "Client:Tuning:SetVehicleTuning": (categoryId, tuningType, type) => {
        if (tuningMenu === null) return;

        mp.events.callRemote("Server:Tuning:SetVehicleTuning", categoryId, tuningType, type);
    },
    "Client:Tuning:BuyItems": (items) => {
        if (tuningMenu === null) return;

        mp.events.callRemote("Server:Tuning:BuyItems", items);
    }
})
