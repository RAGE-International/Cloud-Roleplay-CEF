let window = null;
let isOpen = false;

mp.events.add('Client:BusinessBank:Create', (bankjson) => {
    try {
        if (window == null) {
            if (bankjson == null) return;
            window = mp.browsers.new("package://cef/Businessbank/index.html");
            isOpen = true;
            mp.game.ui.displayRadar(false);
            mp.players.local.freezePosition(true);
            mp.events.call('Client:ToggleHud', false);
            window.execute(`openatm('${bankjson}')`);
            setTimeout(() => {
                mp.gui.cursor.show(true, true);
            }, 150);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:BusinessBank:Destroy', () => {
    try {
        if (window != null) {
            window.destroy();
            window = null;
            isOpen = false;
            mp.game.ui.displayRadar(true);
            mp.players.local.freezePosition(false);
            mp.events.call('Client:ToggleHud', true);
            setTimeout(() => {
                mp.gui.cursor.show(false, false);
            }, 150);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:BusinessBank:BankDepositMoney', (amount) => {
    if (isOpen) {
        mp.events.callRemote('Server:BusinessBank:BankDepositMoney', parseInt(amount))
    }
});

mp.events.add('Client:BusinessBank:BankWithdrawMoney', (amount) => {
    if (isOpen) {
        mp.events.callRemote('Server:BusinessBank:BankWithdrawMoney', parseInt(amount))
    }
});