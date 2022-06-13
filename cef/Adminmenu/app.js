const switchToDashboard = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .dashboard-menu').attr('id', 'active');
    $('.content .dashboard').attr('id', 'active-page');
    $('.content .dashboard').css('left', '0');

    setTimeout(() => {
        $('.content .dashboard').fadeIn(150);
    }, 275);
};

const switchToPlayerList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .player-list').attr('id', 'active');
    $('.content .player-list').attr('id', 'active-page');
    $('.content .player-list').css('left', '0');

    setTimeout(() => {
        $('.content .player-list').fadeIn(150);
        $('.content .player-info-container').hide(0);
        $('.content .player-list-container').fadeIn(150);
    }, 275);
};

const switchToTeamList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .team-list').attr('id', 'active');
    $('.content .team-list').attr('id', 'active-page');
    $('.content .team-list').css('left', '0');

    setTimeout(() => {
        $('.content .team-list').fadeIn(150);
    }, 275);
};

const switchToTeamChat = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .team-chat').attr('id', 'active');
    $('.content .team-chat').attr('id', 'active-page');
    $('.content .team-chat').css('left', '0');

    setTimeout(() => {
        $('.content .team-chat').fadeIn(150);
    }, 275);
};

const switchToVehicleList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .vehicle-list').attr('id', 'active');
    $('.content .vehicle-list').attr('id', 'active-page');
    $('.content .vehicle-list').css('left', '0');

    setTimeout(() => {
        $('.content .vehicle-list').fadeIn(150);
        $('.content .vehicle-info-container').hide(0);
        $('.content .vehicle-list-container').fadeIn(150);
    }, 275);
};

const showVehicleInfo = () => {
    $('.content .vehicle-list-container').fadeOut(150);

    setTimeout(() => {
        $('.content .vehicle-info-container').fadeIn(150);
    }, 150);
};

const switchToHouseList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .house-list').attr('id', 'active');
    $('.content .house-list').attr('id', 'active-page');
    $('.content .house-list').css('left', '0');

    setTimeout(() => {
        $('.content .house-list').fadeIn(150);
        $('.content .house-info-container').hide(0);
        $('.content .house-list-container').fadeIn(150);
    }, 275);
};

const showHouseInfo = () => {
    $('.content .house-list-container').fadeOut(150);

    setTimeout(() => {
        $('.content .house-info-container').fadeIn(150);
    }, 150);
};

const switchToStorageList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .storage-list').attr('id', 'active');
    $('.content .storage-list').attr('id', 'active-page');
    $('.content .storage-list').css('left', '0');

    setTimeout(() => {
        $('.content .storage-list').fadeIn(150);
        $('.content .storage-info-container').hide(0);
        $('.content .storage-list-container').fadeIn(150);
    }, 275);
};

const showStorageInfo = () => {
    $('.content .storage-list-container').fadeOut(150);

    setTimeout(() => {
        $('.content .storage-info-container').fadeIn(150);
    }, 150);
};

const switchToFactionList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .faction-list').attr('id', 'active');
    $('.content .faction-list').attr('id', 'active-page');
    $('.content .faction-list').css('left', '0');

    setTimeout(() => {
        $('.content .faction-list').fadeIn(150);
        $('.content .faction-info-container').hide(0);
        $('.content .faction-list-container').fadeIn(150);
    }, 275);
};

const showFactionInfo = () => {
    $('.content .faction-list-container').fadeOut(150);

    setTimeout(() => {
        $('.content .faction-info-container').fadeIn(150);
    }, 150);
};

const switchToLogList = () => {
    $('#active-page').fadeOut(250);
    let activePage = $('.content').find($('#active-page'));
    let activeMenu = $('.menus').find($('#active'));
    activePage.attr('id', '');
    activeMenu.attr('id', '');

    $('.menus .log-list').attr('id', 'active');
    $('.content .log-list').attr('id', 'active-page');
    $('.content .log-list').css('left', '0');
    $('.content .log-info-container .button-area').fadeIn(150);
    $('.content .log-info-container .table-scroll').hide(0);

    setTimeout(() => {
        $('.content .log-list').fadeIn(150);

        $('.content .log-list-container').fadeIn(150);
        $('.content .log-info-container').fadeOut(150);
    }, 275);
};

const showLogInfo = () => {
    $('.content .log-list-container').fadeOut(150);

    setTimeout(() => {
        $('.content .log-info-container').fadeIn(150);
    }, 150);
};

const showLogInfoContent = () => {
    $('.content .log-info-container .button-area').fadeOut(150);

    setTimeout(() => {
        $('.content .log-info-container .table-scroll').fadeIn(150);
    }, 150);
};

let PlayerListData = '';
let PlayerId = 0;

setTimeout(() => {
    InitAdminMenu('{"Information": {"Username":"John_Allison","RegisteredPlayers":1000,"OnlinePlayers":132,"MoneyCirculation":26098671,"RegisteredVehicles":91243,"RegisteredWeapons":910,' +
        '"RegisteredFactionsMembers":450,"RegisteredGovernMembers":12,"RegisteredCivilMembers":90,"RegisteredHouses":190,' +
        '"RegisteredStorages":35,"RegisteredBusinesses":9,"RegisteredWeedPlants":129051},"PlayerList":' +
        '[{"Username":"John_Allison","Id":1,"Faction":"Los Santos Fire Department","Online":true,"LastLoggedIn":"09/06/2022"},' +
        '{"Username":"Sebastian_Young","Id":2,"Faction":"Los Santos Fire Department","Online":false,"LastLoggedIn":"01/01/2020"},' +
        '{"Username":"Diego_Huso","Id":100,"Faction":"Opfer Fraktion","Online":false,"LastLoggedIn":"31/12/2021"}]}');
}, 1000);

const InitAdminMenu = (data) => {
    PlayerListData = '';
    PlayerId = 0;

    InitDashboard(data);
    InitPlayerList(data);
};

const InitDashboard = (data) => {
    data = JSON.parse(data);

    document.getElementById("player-name").innerHTML = data.Information.Username;
    document.getElementById("registered-player").innerHTML = data.Information.RegisteredPlayers.toLocaleString();
    document.getElementById("active-players").innerHTML = data.Information.OnlinePlayers.toLocaleString();
    document.getElementById("money-circulation").innerHTML = data.Information.MoneyCirculation.toLocaleString();
    document.getElementById("money-circulation").innerHTML = data.Information.MoneyCirculation.toLocaleString();
    document.getElementById("registered-vehicles").innerHTML = data.Information.RegisteredVehicles.toLocaleString();
    document.getElementById("registered-weapons").innerHTML = data.Information.RegisteredWeapons.toLocaleString();
    document.getElementById("registered-faction-members").innerHTML = data.Information.RegisteredFactionsMembers.toLocaleString();
    document.getElementById("registered-govern-members").innerHTML = data.Information.RegisteredGovernMembers.toLocaleString();
    document.getElementById("registered-civil-members").innerHTML = data.Information.RegisteredCivilMembers.toLocaleString();
    document.getElementById("registered-houses").innerHTML = data.Information.RegisteredHouses.toLocaleString();
    document.getElementById("registered-storages").innerHTML = data.Information.RegisteredStorages.toLocaleString();
    document.getElementById("registered-businesses").innerHTML = data.Information.RegisteredBusinesses.toLocaleString();
    document.getElementById("registered-weed-plants").innerHTML = data.Information.RegisteredWeedPlants.toLocaleString();
};

const InitPlayerList = (data) => {
    PlayerListData = data.PlayerList;
    data = JSON.parse(data);

    data.PlayerList.sort((a, b) => {
        return (a.Id - b.Id);
    });


    data.PlayerList.forEach(element => {
        document.getElementById("player-list-table").innerHTML += `
        <tr onclick="showPlayerInfo(${element.Id})" class="player-entry">
            <td style="border-top-left-radius: 0.5vh; border-bottom-left-radius: 0.5vh;" class="online-holder">
                ${element.Online ? '<div id="online" class="online-state"></div>' : '<div id="offline" class="online-state"></div>'}
            </td>
            <td class="icon"><i class="fa-solid fa-user"></i></td>
            <td>${element.Username}</td>
            <td>${element.Id}</td>
            <td>${element.Faction}</td>
            <td style="border-top-right-radius: 0.5vh; border-bottom-right-radius: 0.5vh;">${element.LastLoggedIn}</td>
        </tr>
    `;
    });
};

const InitPlayerInfo = (data) => {
    data = JSON.parse(data)

    document.getElementById("player-information-name").innerHTML = data.Username;
    document.getElementById("player-information-id").innerHTML = data.Id;
    document.getElementById("player-information-bankMoney").innerHTML = data.Bank.toLocaleString();
    document.getElementById("player-information-handMoney").innerHTML = data.Money.toLocaleString();
    document.getElementById("player-information-vehicles").innerHTML = data.Vehicles.toLocaleString();
    document.getElementById("player-information-level").innerHTML = data.Level.toLocaleString();
    document.getElementById("player-information-faction").innerHTML = data.Faction;
    document.getElementById("player-information-faction-rank").innerHTML = data.FactionRank.toLocaleString();
    document.getElementById("player-information-business").innerHTML = data.Business;
    document.getElementById("player-information-business-id").innerHTML = data.BusinessId.toLocaleString();
    document.getElementById("player-information-social").innerHTML = data.Social;
    document.getElementById("player-information-LastLoggedIn").innerHTML = data.LastLoggedIn;

    data.ActiveWarns.forEach(element => {
        document.getElementById("active-warns-history-table").innerHTML += `
            <tr>
                <td>${element.WarnedBy}</td>
                <td>${element.Reason}</td>
                <td>${element.Date} | ${element.Time}</td>
                <td onclick="DeleteActiveWarn(${element.Id})"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `;
    });

    data.LastLogins.forEach(element => {
        document.getElementById("logins-history-table").innerHTML += `
            <tr>
                <td>${element.Date}</td>
                <td>${element.Time}</td>
            </tr>
        `;
    });

    data.Kicks.forEach(element => {
        document.getElementById("kick-history-table").innerHTML +=  `
            <tr>
                <td>${element.KickedBy}</td>
                <td>${element.Reason}</td>
                <td>${element.Date} | ${element.Time}</td>
            </tr>`;
    });

    data.Bans.forEach(element => {
        document.getElementById("ban-history-table").innerHTML += `
            <tr>
                <td>${element.BannedBy}</td>
                <td>${element.Reason}</td>
                <td>${element.Duration}</td>
                <td>${element.Date} | ${element.Time}</td>
            </tr>
        `;
    });

    data.Warns.forEach(element => {
        document.getElementById("warn-history-table").innerHTML += `
            <tr>
                <td>${element.WarnedBy}</td>
                <td>${element.Reason}</td>
                <td>${element.Date} | ${element.Time}</td>
            </tr>
        `;
    });
};

const showPlayerInfo = (id) => {
    $('.content .player-list-container').fadeOut(150);

    InitPlayerInfo('{"Username":"John_Allison","Id":1,"Bank":90123851,"Money":900,"Vehicles":810,"Level":45,"Faction":"Los Santos Fire Department",' +
        '"FactionRank":11,"Business":"RTL Dings","BusinessId":26,"Social":"DerPandamanda","LastLoggedIn":"09/06/2022",' +
        '"ActiveWarns":[{"Id":1,"WarnedBy":"Panda_code","Reason":"Weil Hurensohn","Date":"08.06.2022","Time":"12:30"}],' +
        '"LastLogins":[{"Date":"08/06/2022","Time":"12:45"},{"Date":"09/06/2022","Time":"13.30"}],' +
        '"Kicks":[{"KickedBy":"Panda_code","Reason":"Im Support melden","Date":"01/06/2022","Time":"21:23:07"}],' +
        '"Bans":[{"BannedBy":"Panda_code","Reason":"Cheating","Duration":"2 Jahre","Date":"04/06/2022","Time":"06:23:09"}],' +
        '"Warns":[{"WarnedBy":"Panda_code","Reason":"Weil Cool","Date":"22.02.2022","Time":"19:30"}]}');

    setTimeout(() => {
        $('.content .player-info-container').fadeIn(150);
    }, 150);
};

const UpdateActiveWarns = (data) => {
    document.getElementById("active-warns-history-table").innerHTML += ``;

    data.forEach(element => {
        document.getElementById("active-warns-history-table").innerHTML += `
            <tr>
                <td>${element.WarnedBy}</td>
                <td>${element.Reason}</td>
                <td>${element.Date} | ${element.Time}</td>
                <td onclick="DeleteActiveWarn(${element.Id})"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `;
    });
};

const DeleteActiveWarn = (id) => {
    mp.trigger("ACP:ActiveWarn:Remove", id);
};

const BanPlayer = () => {
    mp.trigger("Client:Player:Ban", PlayerId);
};

const KickPlayer = () => {
    mp.trigger("Client:Player:Kick", PlayerId);
};

const SetAdminRank = () => {
    mp.trigger("Client:Player:UprankAdmin", PlayerId);
};

const SendMessage = () => {
    // TODO: Client shit
};

const WarnPlayer = () => {
    // TODO: Client shit
};

const BlockFaction = () => {
    mp.trigger("Client:Player:BlockFaction", PlayerId);
};

const TpToPlayer = () => {
    mp.trigger("Client:Player:TpToPlayer", PlayerId);
};

const TpToMe = () => {
    mp.trigger("Client:Player:TpToMe", PlayerId);
};

const ResetDimension = () => {
    mp.trigger("Client:Player:ResetDim", PlayerId);
};

const FreezePlayer = () => {
    mp.trigger("Client:Player:FreezePlayer", PlayerId);
};

const RevivePlayer = () => {
    mp.trigger("Client:Player:RevivePlayer", PlayerId);
};

const SpectatePlayer = () => {
    mp.trigger("Client:Player:SpectatePlayer", PlayerId);
};
