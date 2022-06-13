var Hud = null;

function getMinimapAnchor() {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;

    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };

    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
}

mp.events.add('Client:CreateHud', (money) => {
    if (Hud != null) return;
    Hud = mp.browsers.new("package://cef/HUD/index.html");
    if (Hud != null) {
        Hud.execute(`addMoney(${money})`)
    }
});

setInterval(() => {
    setTimeout(() => {
        var minimap = getMinimapAnchor();
        if (Hud != null) {
            setTimeout(() => {
                if (Hud != null) {
                    Hud.execute(`FixMiniMap(${minimap.rightX * 190}, ${minimap.topY * 100})`);
                    Hud.execute(`FixMessages(${minimap.leftX * 150}, ${minimap.topY * 25})`);
                }
            }, 500);
        }
    }, 500);
}, 1500);

mp.events.add('Client:DestoryHud', () => {
    if (Hud == null) return;
    Hud.destroy();
    Hud = null;
});

mp.events.add('Client:AddMoney', (money) => {
    try {
        if (Hud != null) {
            Hud.execute(`addMoney(${money})`);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:RemoveMoney', (money) => {
    try {
        if (Hud != null) {
            Hud.execute(`removeMoney(${money})`);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:CreateNotification', (title, message, time, type, r, g, b) => {
    try {
        if (Hud != null) {
            Hud.execute(`playerNotify('${title}','${message}',${time},'${type}', ${r},${g},${b})`);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add('Client:CreateGlobalNotification', (title, message, time) => {
    try {
        if (Hud != null) {
            Hud.execute(`globalNotify('${title}','${message}',${time})`);
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

class VehicleStatsModel {
    constructor(...args) {
        this.VehicleId = args[0];
        this.Kilometers = args[1];
        this.Fuel = args[2];
        this.MaxFuel = args[3];
        this.FuelMultiplikator = args[4];
    }
    IsFuelEmpty() {
        return this.Fuel <= 0;
    }
}

let VehicleStatsStorage = null;
let LastRenderUpdate = 0;

mp.events.add("playerEnterVehicle", (vehicle, seat) => {
    if (vehicle != null) {
        if (seat == -1) {
            let vehicleData = vehicle.getVariable("VEHICLE_STATS");
            if (vehicleData != null) {
                let vehicleStats = new VehicleStatsModel(JSON.parse(vehicleData).VehicleId, JSON.parse(vehicleData).Kilometers, JSON.parse(vehicleData).Fuel, JSON.parse(vehicleData).MaxFuel, JSON.parse(vehicleData).FuelMultiplikator);
                if (vehicleStats != null) {
                    VehicleStatsStorage = vehicleStats;
                }

                if (vehicle.getVariable("VEHICLE_WRONG_FUEL") == true) {
                    mp.console.logInfo("VEHICLE HAS WRONG FUEL", true, true);
                }
            }
        }
    }
});

mp.events.add("playerUpdateCurrentVehicleStats", (vehicleData) => {
    if (mp.players.local.vehicle && mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
        let vehicleStats = new VehicleStatsModel(JSON.parse(vehicleData).VehicleId, JSON.parse(vehicleData).Kilometers, JSON.parse(vehicleData).Fuel, JSON.parse(vehicleData).MaxFuel, JSON.parse(vehicleData).FuelMultiplikator);
        if (vehicleStats != null) {
            VehicleStatsStorage = vehicleStats;
        }
    }
})

mp.events.add("playerLeaveVehicle", (vehicle, seat) => {
    if (vehicle != null) {
        if (seat == -1) {
            if (VehicleStatsStorage != null) {
                if (VehicleStatsStorage.Fuel < 0) {
                    VehicleStatsStorage.Fuel = 0;
                }

                VehicleStatsStorage.Fuel = Math.round(VehicleStatsStorage.Fuel).toFixed(0)
                VehicleStatsStorage.Kilometers = VehicleStatsStorage.Kilometers.toFixed(2);

                mp.events.callRemote("Server:Vehicle:SaveVehicleStats", JSON.stringify(VehicleStatsStorage))
                VehicleStatsStorage = null;
            }
        }
    }
})

mp.events.add("render", () => {
    if (Date.now() / 1000 > LastRenderUpdate + 0.1) {
        if (Hud != null) {
            if (mp.players.local.vehicle && mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {


                if (VehicleStatsStorage != null) {

                    let currentspeed = mp.players.local.vehicle.getSpeed() * 3.6;

                    VehicleStatsStorage.Kilometers = VehicleStatsStorage.Kilometers + currentspeed / (3600 * 10);

                    if (mp.players.local.vehicle.getClass() !== 13) {

                        VehicleStatsStorage.Fuel = VehicleStatsStorage.Fuel - (currentspeed / 1000 / VehicleStatsStorage.FuelMultiplikator)

                        if (VehicleStatsStorage.Fuel < 0) {
                            if (VehicleStatsStorage.IsFuelEmpty()) {
                                VehicleStatsStorage.Fuel = 0;
                                mp.console.logInfo(`Vehicle Fuel is Empty`, false, false);
                                /* kill here enging for yaziraaaa */
                            }
                        }
                    } else {
                        /* here are yazira big idiotaaaaaa mennn whyyy 
                            do here BMX 
                        */
                    }
                    Hud.execute(`showspeedometer('${currentspeed.toFixed(0)}', '${parseFloat(VehicleStatsStorage.Kilometers.toFixed(2))} KM', '${getProzentOfValue(VehicleStatsStorage.Fuel, VehicleStatsStorage.MaxFuel)}')`)

                    if (mp.players.local.vehicle.getDoorLockStatus() == 2) {
                        Hud.execute(`setvehiclelockstate('${true}')`)
                    } else {
                        Hud.execute(`setvehiclelockstate('${false}')`)
                    }

                    if (mp.players.local.vehicle.getIsEngineRunning() == true) {
                        Hud.execute(`setenginestate('${true}')`)
                    } else {
                        Hud.execute(`setenginestate('${false}')`)
                    }
                }

            } else {
                Hud.execute(`hidespeedometer()`)
            }
        }
        LastRenderUpdate = Date.now() / 1000;
    }
});



function getProzentOfValue(minimal, maximal) {
    return ((minimal / maximal) * 100).toFixed(2);
}

//INTERACTIONS MENU

var CurrentObject = null;
let Marker = null;

mp.events.add('render', () => {
    let raycast = GetRaycastResult();

    if (Marker != null) {
        Marker.destroy();
        Marker = null;
    }

    if (raycast != null) {

        if (raycast.entity != null) {
            if (raycast.entity.position == undefined) return;
            let distance = mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, raycast.entity.position.x, raycast.entity.position.y, raycast.entity.position.z, true);
            if (!distance || distance < 0 || distance > 2) return;

            if (Marker != null) {
                Marker.position = raycast.entity.position;
            }

            if (raycast.entity.isAPed()) {
                if (Marker == null) {
                    Marker = mp.markers.new(25, raycast.entity.position, 5, {
                        direction: new mp.Vector3(0, 0, 0),
                        rotation: new mp.Vector3(0, 0, 0),
                        color: [2, 121, 185, 255],
                        visible: true,
                        dimension: 0
                    });
                }
            }
        }
    }
});

mp.keys.bind(0x58, false, function() {
    if (mp.gui.cursor.visible) {
        Hud.execute(`DestoryXMenu()`);
        mp.gui.cursor.visible = false;
    }
});

function GetRaycastResult() {
    const localcam = mp.cameras.new("gameplay");
    if (localcam != null) {
        let distance = 10;
        let camPos = localcam.getCoord();
        let camDir = localcam.getDirection();
        let pointAt = new mp.Vector3((camDir.x * distance) + (camPos.x), (camDir.y * distance) + (camPos.y), (camDir.z * distance) + (camPos.z));
        return mp.raycasting.testPointToPoint(camPos, pointAt, [1, 16]);
    }
    return null;
}

mp.keys.bind(0x58, true, function() {
    if (!mp.gui.cursor.visible) {

        if (mp.players.local.vehicle) {
            CurrentObject = mp.players.local.vehicle;
            InitMenu('InVehicle');
            return;
        } else if (!mp.players.local.vehicle) {
            let raycast = GetRaycastResult();

            if (raycast != null) {
                let distance = mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, raycast.entity.position.x, raycast.entity.position.y, raycast.entity.position.z, true);


                if (raycast.entity.getVariable('NO_INTERACTION')) return;

                if (raycast.entity.isAVehicle()) {
                    if (raycast.entity.isDead()) return;
                    if (!distance || distance < 0 || distance > 3) return;
                    CurrentObject = raycast.entity;
                    InitMenu('OutVehicle');
                } else if (raycast.entity.isAPed()) {
                    if (!distance || distance < 0 || distance > 2) return;
                    CurrentObject = raycast.entity;
                    InitMenu('Player');
                }
            }
        }
    }
});

mp.events.add("InteractionMenu:ClientCall", (functionname, type) => {
    if (CurrentObject !== null) {
        if (type == "OutVehicle" || type == "InVehicle") {
            type = "Vehicle";
        }
        mp.events.callRemote(`InteractionMenu:${type}`, functionname, CurrentObject);
        CurrentObject = null;
    }
});

function InitMenu(entity) {
    if (Hud != null && Hud.active) {
        let isDeath = false; /*mp.players.local.getVariable('IS_DEATH');*/
        // let isInDuty = mp.players.local.getVariable('IS_IN_DUTY');
        let isAction = false; /*mp.players.local.getVariable('IS_ACTION');*/
        // let Duty = mp.players.local.getVariable('DUTY_DATA');

        if (!isDeath || !isAction) {

            if (entity === "Player") {
                //CLIENT
                Hud.execute(`AddModelToXMenu('money','Geld geben','Gebe einer anderen Personen Geld','ClientGiveMoney','givemoney','Player')`)
                Hud.execute(`AddModelToXMenu('rope','Fesseln','Binde einer anderen Person die Hände','ClientCuffTarget','rope','Player')`)
                Hud.execute(`AddModelToXMenu('driverlicense','Lizenzkarte','Zeige anderen Personen deine Lizenzen','ClientShowLicences','driverlicense','Player')`)
                Hud.execute(`AddModelToXMenu('idcard','Ausweis zeigen','Zeige einer anderen Personen deinen Ausweis','ClientShowIdCard','id','Player')`)
                Hud.execute(`AddModelToXMenu('search','Durchsuchen','Schaue was andere Personen so dabei haben','ClientSearchTarget','search','Player')`)

                // if (isInDuty && Duty == "POLICE") {
                //     Hud.execute(`AddModelToXMenu('handcuffs','Handschellen','Lege anderen Personen Handschellen an','ClientSetHandCuffs','handcuffs','Player')`)
                // }
                // if (isInDuty && Duty == "MEDIC") {
                //     Hud.execute(`AddModelToXMenu('syringe','Behandeln','Helfe der Person wieder auf die Beine','ClientMedicRevive','syringe','Player')`)
                //     Hud.execute(`AddModelToXMenu('inject','Einladen','Lade die Person ein','ClientInjectIntoCar','inject','Player')`)
                // }

                // if (object.getVariable('IS_DEATH')) {
                //     Hud.execute(`AddModelToXMenu('stabilize','Stabilisieren','Lege die Person in die stabile Seitenlage','ClientStabilize','stabilize','Player')`)
                // }

            } else if (entity === "OutVehicle") {


                // if (isInDuty && Duty == "POLICE") {}
                // if (isInDuty && Duty == "MEDIC") {}

                Hud.execute(`AddModelToXMenu('lock','Auf/Zu schließen','Schließe das Fahrzeug auf oder zu','ClientToggleVehicleLockState','lock','OutVehicle')`)
                Hud.execute(`AddModelToXMenu('trunk','Auf/Zu schließen des Kofferraumes','Schließe den Kofferraum auf oder zu','ClientToggleVehicleTrunkState','trunk','OutVehicle')`)

            } else if (entity === "InVehicle") {


                // if (isInDuty && Duty == "POLICE") {}
                // if (isInDuty && Duty == "MEDIC") {}

                Hud.execute(`AddModelToXMenu('engine','Motor','Schalte den Motor des Fahrzeuges an','ClientToggleVehicleEngine','engine','InVehicle')`)
                Hud.execute(`AddModelToXMenu('lock','Auf/Zu schließen','Schließe das Fahrzeug auf oder zu','ClientToggleVehicleLockState','lock','InVehicle')`)
                Hud.execute(`AddModelToXMenu('trunk','Auf/Zu schließen des Kofferraumes','Schließe den Kofferraum auf oder zu','ClientToggleVehicleTrunkState','trunk','InVehicle')`)
            }
            mp.gui.cursor.visible = true;
            Hud.execute(`CreateXMenu('${entity}')`)
        }
    }
}

mp.events.add('render', () => {
    let player = mp.players.local;
    if (player == null) return;
    let pedWeapon = mp.game.invoke('0x0A6DB4965674D243', player.handle);
    if (pedWeapon == null) return;
    let groupHash = mp.game.weapon.getWeapontypeGroup(pedWeapon);

    if (groupHash != '2685387236') {
        let pedWeaponAmmo = mp.game.invoke('0x015A522136D7F951', player.handle, pedWeapon >> 0)
        let pedWeaponClip = mp.players.local.getAmmoInClip(pedWeapon);
        if (Hud != null && (pedWeaponAmmo != NaN && pedWeaponAmmo != undefined) && (pedWeaponClip != NaN && pedWeaponClip != undefined)) {
            Hud.execute(`ToggleWeaponAmmoHud(true)`)
            Hud.execute(`UpdateWeaponAmmoAtHud('${pedWeaponClip}','${pedWeaponAmmo - pedWeaponClip}')`)
        }
    } else {
        if (Hud != null) {
            Hud.execute(`ToggleWeaponAmmoHud(false)`)
        }
    }
    mp.game.ui.hideHudComponentThisFrame(20);
    mp.game.ui.hideHudComponentThisFrame(3);
    mp.game.ui.hideHudComponentThisFrame(22);
    mp.game.ui.hideHudComponentThisFrame(2);

    mp.game.ui.hideHudComponentThisFrame(7);
    mp.game.ui.hideHudComponentThisFrame(6);
    mp.game.ui.hideHudComponentThisFrame(9);
    mp.game.ui.hideHudComponentThisFrame(8);
    mp.game.ui.hideHudComponentThisFrame(10);
});

mp.events.add('Client:Dialog:Call:Event', (eventname, ...args) => {
    if (Hud != null) {
        mp.events.callRemote(eventname, ...args)
    }
});

mp.events.add('Client:Dialog:Create', (rawData) => {
    if (Hud != null) {
        Hud.execute(`CreateDialogField('${rawData}')`)
        mp.gui.cursor.show(true, true);
    }
});

mp.events.add('Client:Dialog:Destory', () => {
    if (Hud != null) {
        Hud.execute(`DestoryDialogField()`);
        mp.gui.cursor.show(false, false);
    }
});

mp.events.add("Client:ToggleHudRadio", (toggle) => {
    Hud.execute(`showRadio(${toggle})`);
});

mp.events.add("Client:SetHudRadio", (value) => {
    Hud.execute(`setRadioState(${value})`);
});

mp.events.add("Client:SetHudVoice", (value) => {
    Hud.execute(`setVoiceState(${value})`);
});

mp.events.add("Client:ShowIdCard", (json) => {
    if (Hud != null) {
        Hud.execute(`toggleIdCard('${json}')`);
    }
});

mp.events.add("Client:ShowLicenses", (json) => {
    if (Hud != null) {
        Hud.execute(`toggleLicenceCard('${json}')`);
    }
});

mp.events.add("Client:ToggleHud", (toggle) => {
    if (Hud != null) {
        Hud.active = toggle;
    }
});