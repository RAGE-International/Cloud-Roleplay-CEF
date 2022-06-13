let window = null;
let isOpen = false;

mp.events.add('Client:ClothesStorage:Open', (rawjson) => {
    try {
        if (window == null) {
            window = mp.browsers.new("package://cef/ClothingStorage/index.html");
            isOpen = true;
            mp.gui.cursor.show(true, true);
            mp.game.ui.displayRadar(false);
            mp.players.local.freezePosition(true);
            if (window != null) {
                window.execute(`SetMpDefinde()`);
                window.execute(`loadClothingStorage('${rawjson}')`);
                mp.events.call('client:setcam', true);
            }
            mp.events.call('Client:ToggleHud', true);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:ClothesStorage:Destroy', () => {
    try {
        if (window != null) {
            window.destroy();
            window = null;
            isOpen = false;
            mp.game.ui.displayRadar(true);
            mp.players.local.freezePosition(false);
            mp.gui.cursor.show(false, false);
            mp.events.call('Client:ToggleHud', false);
            mp.events.call('client:setcam', false);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add("Client:ClothesStorage:TryClothes", (component, drawable, texture, is_accessories) => {
    tryClothes(parseInt(component), parseInt(drawable), parseInt(texture), is_accessories)
});

const tryClothes = (component, drawable, texture, is_accessories) => {
    if (window == null) {
        return;
    }

    if (is_accessories) {
        mp.players.local.setPropIndex(parseInt(component), parseInt(drawable), parseInt(texture), true);
    } else {
        mp.players.local.setComponentVariation(parseInt(component), parseInt(drawable), parseInt(texture), 0);
    }
};

// mp.events.add('Client:ClothesStorage:TryClothes', (component, drawable, texture, is_accessories) => {
//     mp.game.graphics.notify('test1 ' + new Date().getSeconds())
//     if (window != null) {
//         mp.game.graphics.notify('test2 ' + new Date().getSeconds())
//         if (is_accessories) {
//             mp.game.graphics.notify('test3 ' + new Date().getSeconds())
//             mp.players.local.setPropIndex(parseInt(component), parseInt(drawable), parseInt(texture), true);
//         } else {
//             mp.game.graphics.notify('test4 ' + new Date().getSeconds())
//             mp.players.local.setComponentVariation(parseInt(component), parseInt(drawable), parseInt(texture), 0);
//         }
//     }
// });

mp.events.add("Client:ClothingStorage:Rotation", (rotation) => {
    mp.events.call("client:setHeading", rotation)
})

mp.events.add("Client:ClothingStorage:SetClothes", (selectedComponentId, selectedDrawable, selectedTexture, selectedIsAccessories) => {
    mp.events.callRemote("Server:ClothingStorage:SetClothes", selectedComponentId, selectedDrawable, selectedTexture, selectedIsAccessories)
})

mp.events.add('Client:ClothingStorage:PlayAnimation', (toggle, animdic, animname) => {
    if (toggle) {
        mp.game.streaming.requestAnimDict(animdic);
        mp.players.local.taskPlayAnim(animdic, animname, 8.0, 1.0, -1, 1, 1.0, false, false, false);
    } else {
        mp.players.local.stopAnim(animdic, animname, 0.7);
    }
});

mp.events.add("Client:ClothingStorage:SelectCategory", (selection_id, is_accessories) => {
    if (selection_id == 0 && is_accessories || selection_id == 1 && is_accessories || selection_id == 2 && is_accessories || selection_id == 1 && !is_accessories) {
        mp.events.call('client:setcamflag', 2);
    }
    if (selection_id == 7 && !is_accessories || selection_id == 3 && !is_accessories) {
        mp.events.call('client:setcamflag', 1);
    }
    if (selection_id == 6 && !is_accessories) {
        mp.events.call('client:setcamflag', 4);
    }
    if (selection_id == 5 && !is_accessories) {
        mp.events.call('client:setcamflag', 5);
    }
    if (selection_id == 11 && !is_accessories || selection_id == 8 && !is_accessories) {
        mp.events.call('client:setcamflag', 0);
    }
    if (selection_id == 4 && !is_accessories) {
        mp.events.call('client:setcamflag', 6);
    }
    if (selection_id == 6 && is_accessories) {
        mp.events.call('client:setcamflag', 0) // 7;
        window.execute(`PlayWatchAnimation(true)`)
        return;
    }
    window.execute(`PlayWatchAnimation(false)`)
})