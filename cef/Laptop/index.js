var laptop = null;

mp.events.add('Client:Laptop:ShowLaptopBrowser', (toggle) => {
    mp.console.logInfo(`${toggle}`)
    if (toggle) {
        if (laptop == null) {
            laptop = mp.browsers.new('package://cef/Laptop/index.html')
            laptop.active = true;
            mp.gui.cursor.show(true, true)
            laptop.execute(`showLaptop(${toggle})`)
            
            setTimeout(() => {
                laptop.execute(`SetInfo('${mp.storage.data.LaptopRingtone}', ${mp.storage.data.LaptopRingtoneVolume}, ${mp.storage.data.LaptopWallpaper})`)
            }, 125);
        } else {
            laptop.active = true;
            mp.gui.cursor.show(true, true)
            laptop.execute(`showLaptop(${toggle})`)
        }
    } else {
        if (laptop != null) {
            mp.gui.cursor.show(false, false)
            laptop.execute(`showLaptop(${toggle})`)
            setTimeout(() => {
                laptop.active = false;
            }, 250);
        }
    }
})

// SETTINGS APP

mp.events.add('GetUserInfo', () => {
    mp.events.callRemote('Server:Laptop:GetUserLaptopSettingsInfo')
})

mp.events.add('Client:Laptop:SetUserInfo', (data) => {
    laptop.execute(`OpenSettingsApp('${data}')`)
})

mp.events.add('Client:Laptop:UpdateRingtone', (id, vol) => {
    mp.storage.data.LaptopRingtone = id
    mp.storage.data.LaptopRingtoneVolume = vol
})

mp.events.add('Client:Laptop:ChangeWallpaper', (id) => {
    mp.storage.data.LaptopWallpaper = id
})

// POLICE APP

mp.events.add('GetPoliceAppInfo', () => {
    mp.events.callRemote('Server:Laptop:GetPoliceAppInfo')
})

mp.events.add('Client:Laptop:PoliceSetInfo', (data) => {
    laptop.execute(`PoliceSetInfo('${data}')`)
})

mp.events.add('PoliceSearchPerson', (name) => {
    mp.events.callRemote('Server:Laptop:PoliceSearchPerson', name)
})

mp.events.add('Client:Laptop:PoliceSetSearchedPlayers', (data) => {
    laptop.execute(`SetPoliceSearchData('${data}')`)
})

mp.events.add('PoliceRequestPlayerInfo', (id) => {
    mp.events.callRemote('Server:Laptop:PoliceRequestPlayerInfo', id)
})

mp.events.add('Client:Laptop:PoliceSetPlayerInfo', (data) => {
    laptop.execute(`OpenPlayerOverview('${data}')`)
})

mp.events.add('PoliceSearchVehicle', (data) => {
    mp.events.callRemote('Server:Laptop:PoliceSearchVehicle', data)
})

mp.events.add('Client:Laptop:SetPoliceSearchedVehicles', (data) => {
    laptop.execute(`SetPoliceSearchedVehicles('${data}')`)
})

mp.events.add('PoliceGetVehicleData', (id) => {
    mp.events.callRemote('Server:Laptop:PoliceGetVehicleData', id)
})

mp.events.add('Client:Laptop:PoliceOpenVehicleOverview', (data) => {
    laptop.execute(`PoliceOpenVehicleOverview('${data}')`)
})

mp.events.add('UpdatePlayerPoliceInfo', (id, info) => {
    mp.events.callRemote('Server:Laptop:UpdatePlayerInfo', id, info)
})

mp.events.add('AddPlayerCrimes', (id, crimes) => {
    mp.events.callRemote('Server:Laptop:AddPlayerCrimes', id, crimes)
})

mp.events.add("Client:Laptop:TakeLicense", (id, licenseName) => {
    mp.events.callRemote("Server:Laptop:TakeLicense", id, licenseName);
});

// DISPATCH

mp.events.add('GetDispatchAppInfo', () => {
    mp.events.callRemote('Server:Laptop:GetDispatchAppInfo')
})

mp.events.add('Client:Laptop:SetDispatchAppInfo', (data) => {
    laptop.execute(`SetDispatchAppInfo('${data}')`)
})

mp.events.add('AcceptDispatch', (id) => {
    mp.events.callRemote('Server:Laptop:AcceptDispatch', id)
})

mp.events.add('CloseDispatch', (id) => {
    mp.events.callRemote('Server:Laptop:CloseDispatch', id)
})

mp.events.add('DeleteDispatch', (id) => {
    mp.events.callRemote('Server:Laptop:DeleteDispatch', id)
})

mp.events.add('Client:Laptop:LocateDispatch', (x, y) => {
    mp.game.ui.setNewWaypoint(x, y)
})

// OVERVIEW APP

mp.events.add('Client:Laptop:LocateVehicle', (x, y) => {
    mp.game.ui.setNewWaypoint(x, y)
})

mp.events.add('GetOverviewAppData', (tab) => {
    switch (tab) {
        case 'vehicles':
            mp.events.callRemote(`Server:Laptop:GetOverviewVehicleInfo`)
            break
        case 'storages':
            mp.events.callRemote(`Server:Laptop:GetOverviewStorageInfo`)
            break
        case 'houses':
            mp.events.callRemote(`Server:Laptop:GetOverviewHouseInfo`)
            break
    }
})

mp.events.add('Client:Laptop:SetVehicleOverviewAppData', (data) => {
    laptop.execute(`SetOverviewVehicleInfo('${data}')`)
})

mp.events.add('Client:Laptop:SetStorageOverviewAppData', (data) => {
    laptop.execute(`SetOverviewStorageInfo('${data}')`)
})

mp.events.add('Client:Laptop:SetHouseOverviewAppData', (data) => {
    laptop.execute(`SetOverviewHouseInfo('${data}')`)
})

// CMAIL

mp.events.add("GetMailAppInfo", () => {
    mp.events.callRemote("Server:Laptop:GetMailAppInfo")
})

mp.events.add("Client:Laptop:SetMailAppInfo", (data, name) => {
    laptop.execute(`SetCMailAppInfo('${data}', '${name}')`)
})

mp.events.add("SetMailPinned", (id, pinned) => {
    mp.events.callRemote("Server:Laptop:PinMail", id, pinned)
})

mp.events.add("DeleteMail", (id) => {
    mp.events.callRemote("Server:Laptop:DeleteMail", id)
})

mp.events.add("DeleteMails", (data) => {
    mp.events.callRemote("Server:Laptop:DeleteMails", data)
})

mp.events.add("DeleteMailsDelete", (data) => {
    mp.events.callRemote("Server:Laptop:DeleteMailsDelete", data)
})

mp.events.add("SendCMail", (target, betreff, message) => {
    mp.events.callRemote("Server:Laptop:SendMail", target, betreff, message)
})

mp.events.add("OpenMail", (id) => {
    mp.events.callRemote("Server:Laptop:OpenMail", id)
})

/* FRAKTION */
mp.events.add({
    "Client:Fraktion:KickUser": (id) => {
        mp.events.callRemote("Server:Fraktion:KickUser", id);
    },
    "Client:Fraktion:SaveUser": (data) => {
        mp.events.callRemote("Server:Fraktion:SaveUser", data);
    },
    "GetFactionAppInfo": () => {
        mp.events.callRemote("Server:Fraktion:LoadFraktion");
    },
    "Client:Fraktion:LoadFraktion": (data) => {
        if (laptop === null) return;
        laptop.execute(`LoadFactionMembers(${data});`);
    }
})

/* Business */
mp.events.add({
    "Client:Business:KickUser": (id) => {
        mp.events.callRemote("Server:Business:KickUser", id);
    },
    "Client:Business:SaveUser": (data) => {
        mp.events.callRemote("Server:Business:SaveUser", data);
    },
    "GetBusinessAppInfo": () => {
        mp.events.callRemote("Server:Business:LoadBusiness");
    },
    "Client:Business:LoadBusiness": (data) => {
        if (laptop === null) return;
        laptop.execute(`LoadBusinessMembers(${data});`);
    }
})
