let window = null;
let isOpen = false;

mp.keys.bind(115, true, () => {
    if (window == null) {
        mp.events.call("Client:CreateGD")
    } else {
        mp.events.call("Client:DestroyGD")
    }
})

mp.events.add('Client:CreateGD', () => {
    if (window == null) {
        window = mp.browsers.new("package://cef/Gamedesign/index.html");
        mp.gui.cursor.show(true, true);
        mp.game.ui.displayRadar(false);
        mp.players.local.freezePosition(true);
    }
});

mp.events.add('Client:DestroyGD', () => {
    if (window != null) {
        window.destroy();
        window = null;
        mp.game.ui.displayRadar(true);
        mp.players.local.freezePosition(false);
        mp.gui.cursor.show(false, false);
    }
});

var Name = null;
var Model = null;
var FarmingTool = null;
var Item = null;
var ItemStack = null;
var MinCount = null;
var MaxCount = null;
var FarmingDuration = null;
var FarmingAnimationDict = null;
var FarmingAnimationName = null;
var FarmingAnimationFlag = null;

mp.events.add("Client:FarmTool:Create", (tw1, tw2, tw3, tw4, tw5, tw6, tw7, tw8, tw9, tw10, tw11) => {
    if (tw1 == "" || tw2 == "" || tw3 == "" || tw4 == "" || tw5 == "" || tw6 == "" || tw7 == "" || tw8 == "" || tw9 == "" || tw10 == "" || tw11 == "") {
        mp.game.graphics.notify('[Fehler] Etwas ist nicht angegeben');
        return;
    }
    Name = tw1
    Model = tw2
    FarmingTool = tw3
    Item = tw4
    ItemStack = tw5
    MinCount = tw6
    MaxCount = tw7
    FarmingDuration = tw8
    FarmingAnimationDict = tw9
    FarmingAnimationName = tw10
    FarmingAnimationFlag = tw11
})

mp.keys.bind(116, true, () => {

    if (Name == null || Model == null || FarmingTool == null || Item == null || ItemStack == null || MinCount == null || MaxCount == null || FarmingDuration == null || FarmingAnimationDict == null || FarmingAnimationName == null || FarmingAnimationFlag == null) {
        mp.game.graphics.notify('[Fehler] Etwas ist NULL');
        return;
    }

    mp.events.callRemote("Server:FarmingTool:AddFarmingPos", Name, Model, FarmingTool, Item, ItemStack, MinCount, MaxCount, FarmingDuration, FarmingAnimationDict, FarmingAnimationName, FarmingAnimationFlag)
})

mp.events.add("setstats", () => {
    if (!mp.players.local.vehicle) {
        window.execute(`setinfo('[PLAYER]'
        ,'{"x":${mp.players.local.position.x},"y":${mp.players.local.position.y},"z":${mp.players.local.position.z}}' 
        ,'new mp.Vector3(${mp.players.local.position.x}, ${mp.players.local.position.y}, ${mp.players.local.position.z})'
        ,'{"Pos":{"x":${mp.players.local.position.x},"y":${mp.players.local.position.y},"z":${mp.players.local.position.z}},"Rotation":{"x":0.0,"y":0.0,"z":${mp.players.local.getHeading()}}}'
            ,'{"x":0.0,"y":0.0,"z":${mp.players.local.getHeading()}}')`);
    } else {
        window.execute(`setinfo('[VEHICLE]'
    ,'{"x":${mp.players.local.vehicle.position.x},"y":${mp.players.local.vehicle.position.y},"z":${mp.players.local.vehicle.position.z}}' 
    ,'new mp.Vector3(${mp.players.local.vehicle.position.x}, ${mp.players.local.vehicle.position.y}, ${mp.players.local.vehicle.position.z})'
    ,'{"Pos":{"x":${mp.players.local.vehicle.position.x},"y":${mp.players.local.vehicle.position.y},"z":${mp.players.local.vehicle.position.z}},"Rotation":{"x":0.0,"y":0.0,"z":${mp.players.local.vehicle.getHeading()}}}'
    ,'{"x":0.0,"y":0.0,"z":${mp.players.local.vehicle.getHeading()}}')`);
    }
});

mp.events.add("Client:GasStation:Create", (gasstationname, gasstationpedname) => {
    mp.events.callRemote("Server:GasStation:Create", gasstationname, gasstationpedname);
});

mp.events.add("Client:GasStation:AddFillPos", (gasStationId) => {
    mp.events.callRemote("Server:GasStation:AddFillPos", gasStationId);
});

mp.events.add("Client:GasStation:AddOffer", (gasStationId, fueltype, fuelprice) => {
    mp.events.callRemote("Server:GasStation:AddOffer", gasStationId, fueltype, fuelprice);
});