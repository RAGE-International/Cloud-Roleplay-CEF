var itemShop = null;

mp.events.add('Client:CreateItemShop', (jsonData) => {
    try {

        if (itemShop == null) {
            itemShop = mp.browsers.new("package://cef/ItemShop/index.html");
            itemShop.active = true;
            itemShop.execute(`loadItems('${jsonData}')`);
            mp.gui.cursor.show(true, true);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:DestroyItemShop', () => {
    try {
        if (itemShop != null) {
            itemShop.active = false;
            itemShop.destroy();
            itemShop = null;
            setTimeout(() => {
                mp.gui.cursor.show(false, false);
            }, 250);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:ItemShop:BuyItems', (jsonData) => {
    if (itemShop != null) {
        mp.events.callRemote('Server:ItemShop:BuyItems', jsonData);
    }
});