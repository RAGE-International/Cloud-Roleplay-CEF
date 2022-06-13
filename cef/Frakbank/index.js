let window = null;
let isOpen = false;

mp.events.add('Client:Frakbank:Create', (bankjson) => {
    try {
        if (window == null) {
            if (bankjson == null) return;
            window = mp.browsers.new("package://cef/Frakbank/index.html");
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

mp.events.add('Client:Frakbank:Destroy', () => {
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

mp.events.add('Client:Frakbank:BankDepositMoney', (amount) => {
    if (isOpen) {
        mp.events.callRemote('Server:Frakbank:BankDepositMoney', parseInt(amount))
    }
});

mp.events.add('Client:Frakbank:BankWithdrawMoney', (amount) => {
    if (isOpen) {
        mp.events.callRemote('Server:Frakbank:BankWithdrawMoney', parseInt(amount))
    }
});