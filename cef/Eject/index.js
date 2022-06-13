let browser = null;

mp.events.add({
    "Client:Eject:Create": (count) => {
        if (browser !== null) return;

        browser = mp.browsers.new("package://cef/Eject/index.html");
        mp.gui.cusor.show(true, true);

        setTimeout(() => {
            browser.execute(`LoadOccupants(${count});`)
        }, 100);
    },
    "Client:Eject:Delete": () => {
        if (browser === null) return;

        browser.destroy()
        browser = null;
        mp.gui.cusor.show(false, false);
    },
    "Client:Eject:Seat": (id) => {
        if (browser === null) return;

        mp.events.callRemote("Server:Eject:Seat", id);
    }
});
