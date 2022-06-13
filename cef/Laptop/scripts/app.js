let PoliceSearchData = null
let playerName = ''

const showLaptop = (toggle) => {
    if (toggle) {
        document.querySelector('.laptop').style.display = 'block';
    } else {
        document.querySelector('.laptop').style.display = 'none';
    }
};

function OpenApp(app) {
    Array.from(document.getElementsByClassName('page')).forEach(x => {
        if (x.id != 'app-home' && x.id != 'app-' + app) {
            x.classList.add('app-slideout')
            setTimeout(() => {
                x.style.display = 'none'
                x.classList.remove('app-slideout')
            }, 300)
        }
    })
    document.getElementById('app-' + app).style.display = 'block'

    switch (app) {
        case 'police':
            mp.trigger('GetPoliceAppInfo')
            break
        case 'emergency':
            mp.trigger('GetDispatchAppInfo')
            break
        case 'cmail':
            // OpenCMailApp()
            break
        case 'faction':
            mp.trigger('GetFactionAppInfo')
            break
        case 'business':
            mp.trigger('GetBusinessAppInfo')
            break
    }
}

function ShowPoliceApps() {
    document.getElementById('policeapp').style.display = 'block'
}

function PoliceSetInfo(_data) {
    let data = JSON.parse(_data)

    laws = data.Laws
    wanteds = data.Wanteds

    PoliceSetWanteds(wanteds)
    SetLaws(laws)
}

let emergencyData = null
function SetDispatchAppInfo(_data) {
    if (_data != null)
        emergencyData = JSON.parse(_data)
    let opendispatches = document.getElementById('opendispatches')
    let accepteddispatches = document.getElementById('accepteddispatches')
    let closeddispatches = document.getElementById('closeddispatches')

    opendispatches.innerHTML = ''
    accepteddispatches.innerHTML = ''
    closeddispatches.innerHTML = ''

    emergencyData.OpenDispatches.forEach(x => {
        opendispatches.innerHTML +=
            `<div class="emergency-content-item" id="dispatch-${x.Id}">
            <div class="header">
                <div class="header-left">
                    <p class="name">${x.Name}</p>
                    <p class="number">${x.Number}</p>
                </div>
                <div class="header-right" onclick="AcceptDispatch(${x.Id})">
                    <p>Annehmen</p>
                </div>
            </div>
            <div class="content">
                <p>${x.Message}</p>
            </div>
            <div class="footer" style="margin-bottom: 0;">
                <div class="footer-left">
                    <p>${x.Time}</p>
                </div>
                <div class="footer-right" onclick="LocateDispatch(${x.Location})">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
            </div>
        </div>`
    })

    emergencyData.AcceptedDispatches.forEach(x => {
        accepteddispatches.innerHTML +=
            `<div class="emergency-content-item" id="dispatch-${x.Id}">
            <div class="header">
                <div class="header-left">
                    <p class="name">${x.Name}</p>
                    <p class="number">${x.Number}</p>
                </div>
                <div class="header-right orange" onclick="CloseDispatch(${x.Id})">
                    <p>Bearbeitet</p>
                </div>
            </div>
            <div class="content">
                <p>${x.Message}</p>
            </div>
            <div class="footer">
                <div class="footer-left">
                    <p>${x.Time}</p>
                </div>
                <div class="footer-right" onclick="LocateDispatch(${x.Location})">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
            </div>
            <div class="bottom-footer">
                <div class="bottom-footer-content">
                    <p class="name">${x.Officer}</p>
                    <p class="status">Beamter angenommen</p>
                </div>
                <p class="time">${x.AcceptedTime}</p>
            </div>
        </div>`
    })

    emergencyData.ClosedDispatches.forEach(x => {
        closeddispatches.innerHTML +=
            `<div class="emergency-content-item" id="dispatch-${x.Id}">
            <div class="header">
                <div class="header-left">
                    <p class="name">${x.Name}</p>
                    <p class="number">${x.Number}</p>
                </div>
                <div class="header-right red" onclick="DeleteDispatch(${x.Id})">
                    <p>Löschen</p>
                </div>
            </div>
            <div class="content">
                <p>${x.Message}</p>
            </div>
            <div class="footer">
                <div class="footer-left">
                    <p>${x.Time}</p>
                </div>
                <div class="footer-right" onclick="LocateDispatch(${x.Location})">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
            </div>
            <div class="bottom-footer">
                <div class="bottom-footer-content">
                    <p class="name">${x.Officer}</p>
                    <p class="status">Abgeschlossen von</p>
                </div>
                <p class="time">${x.AcceptedTime}</p>
            </div>
        </div>`
    })
}

function AcceptDispatch(id) {
    mp.trigger('AcceptDispatch', id)
}

function CloseDispatch(id) {
    let item = emergencyData.AcceptedDispatches.find(x => x.Id == id)
    emergencyData.ClosedDispatches.push(item)
    emergencyData.AcceptedDispatches.splice(emergencyData.AcceptedDispatches.indexOf(item), 1)

    SetDispatchAppInfo(null)
    mp.trigger('CloseDispatch', id)
}

function DeleteDispatch(id) {
    document.getElementById('dispatch-' + id).remove()
    emergencyData.ClosedDispatches.splice(emergencyData.AcceptedDispatches.indexOf(emergencyData.AcceptedDispatches.find(x => x.Id == id)), 1)

    mp.trigger('DeleteDispatch', id)
}

function LocateDispatch(x, y) {
    mp.trigger('Client:Laptop:LocateDispatch', x, y)
}

function PoliceSetWanteds(data) {
    if (data == null || data == undefined) return;

    data.sort((a, b) => {
        return a - b
    });

    let list = document.getElementById('policewanteds')

    list.innerHTML = ''

    let i = 1

    data.forEach(x => {
        list.innerHTML +=
            `<div class="search-result-item">
            <div class="id">${i}</div>
            <div class="name">${x.Name.replace('_', ' ')}</div>
            <div class="birth-day">${x.BirthDate}</div>
            <div class="sex">${x.Gender ? 'Männlich' : 'Weiblich'}</div>
            <div class="wanteds">${x.JailTime}</div>
        </div>`

        i++
    })
}

function PoliceSwitchTab(el, tab, switchHeader = true) {
    Array.from(document.getElementsByClassName('policepage')).forEach(x => x.style.display = 'none')
    document.getElementById('policeTab-' + tab).style.display = 'block'

    if (switchHeader) {
        Array.from(document.getElementsByClassName('header-item')).forEach(x => x.className = 'header-item')
        el.className = 'header-item active'
    }
}

function PoliceSearchPerson() {
    let data = document.getElementById('policesearchinput').value
    if (data == null || data == '') return

    mp.trigger('PoliceSearchPerson', data)
}

function SetPoliceSearchData(data) {
    let list = document.getElementById('policesearchlist')
    PoliceSearchData = JSON.parse(data)

    list.innerHTML = ''

    PoliceSearchData.forEach(x => {
        list.innerHTML +=
            `<div class="search-result-item" onclick="RequestPlayerInfo(${x.Id})">
            <div class="id">${x.Id}</div>
            <div class="name">${x.Name}</div>
            <div class="birth-day">${x.BirthDate}</div>
            <div class="sex">${x.Gender ? 'Männlich' : 'Weiblich'}</div>
            <div class="information">${x.Wanted ? 'Gesucht' : 'Nicht Gesucht'}</div>
        </div>`
    })
}

let aktenCarousel = document.getElementById("akten-carousell");
noUiSlider.create(aktenCarousel, {
    start: [0],
    connect: [true, false],
    step: 1,
    range: {
        'min': 0,
        'max': 1
    }
});

function RequestPlayerInfo(id) {
    mp.trigger('PoliceRequestPlayerInfo', id)
}

let PlayerOverviewData = null
let currentId = 0;
function OpenPlayerOverview(_data) {
    var data = JSON.parse(_data)
    PlayerOverviewData = data.Info
    let name = PlayerOverviewData.Name.split('_')

    document.getElementById('policeplayerinfoname').innerText = name[0]
    document.getElementById('policeplayerinfoname2').innerText = name[1]
    document.getElementById('policeplayerinfobirthdate').innerText = PlayerOverviewData.BirthDate
    document.getElementById('policestatusitem').innerText = PlayerOverviewData.HasAkte ? 'Gesucht' : 'Nicht Gesucht'
    document.getElementById('policeplayerinfofaction').innerText = PlayerOverviewData.FraktionName
    document.getElementById('policeplayerinfophonenumber').innerText = PlayerOverviewData.Number
    document.getElementById('policeovwinfos').innerText = PlayerOverviewData.Information

    document.getElementById('policelicense-PKW-icon').style.opacity = PlayerOverviewData.Lizenzen.PKW ? 1 : 0.4
    document.getElementById('policelicense-PKW').style.display = PlayerOverviewData.Lizenzen.PKW ? 'block' : 'none'
    document.getElementById('policelicense-LKW-icon').style.opacity = PlayerOverviewData.Lizenzen.LKW ? 1 : 0.4
    document.getElementById('policelicense-LKW').style.display = PlayerOverviewData.Lizenzen.LKW ? 'block' : 'none'
    document.getElementById('policelicense-Bike-icon').style.opacity = PlayerOverviewData.Lizenzen.Motorrad ? 1 : 0.4
    document.getElementById('policelicense-Bike').style.display = PlayerOverviewData.Lizenzen.Motorrad ? 'block' : 'none'
    document.getElementById('policelicense-Boot-icon').style.opacity = PlayerOverviewData.Lizenzen.Boot ? 1 : 0.4
    document.getElementById('policelicense-Boot').style.display = PlayerOverviewData.Lizenzen.Boot ? 'block' : 'none'
    document.getElementById('policelicense-Heli-icon').style.opacity = PlayerOverviewData.Lizenzen.Heli ? 1 : 0.4
    document.getElementById('policelicense-Heli').style.display = PlayerOverviewData.Lizenzen.Heli ? 'block' : 'none'
    document.getElementById('policelicense-Flugzeug-icon').style.opacity = PlayerOverviewData.Lizenzen.Flugzeug ? 1 : 0.4
    document.getElementById('policelicense-Flugzeug').style.display = PlayerOverviewData.Lizenzen.Flugzeug ? 'block' : 'none'
    document.getElementById('policelicense-EHK-icon').style.opacity = PlayerOverviewData.Lizenzen.EHK ? 1 : 0.4
    document.getElementById('policelicense-EHK').style.display = PlayerOverviewData.Lizenzen.EHK ? 'block' : 'none'
    document.getElementById('policelicense-Waffenschein-icon').style.opacity = PlayerOverviewData.Lizenzen.Waffenschein ? 1 : 0.4
    document.getElementById('policelicense-Waffenschein').style.display = PlayerOverviewData.Lizenzen.Waffenschein ? 'block' : 'none'
    document.getElementById('policelicense-Anwalt-icon').style.opacity = PlayerOverviewData.Lizenzen.Anwalt ? 1 : 0.4
    document.getElementById('policelicense-Anwalt').style.display = PlayerOverviewData.Lizenzen.Anwalt ? 'block' : 'none'
    document.getElementById('policelicense-Taxi-icon').style.opacity = PlayerOverviewData.Lizenzen.Taxi ? 1 : 0.4
    document.getElementById('policelicense-Taxi').style.display = PlayerOverviewData.Lizenzen.Taxi ? 'block' : 'none'

    PoliceUpdatePlayerWantedStatus()

    let list = document.getElementById('akten-carousell')

    list.innerHTML = ''

    data.Paragraphs.forEach(x => {
        list.innerHTML +=
            `<div class="carousell-item">
            <div class="top-c">
                <div class="top">
                    <img class="carousell-icon-top-duweißtbescheid" src="img/time.svg">
                    <h2>2021.12.20 18:30</h2>
                </div>
            </div>

            <div class="content">
                <div class="stat">
                    <h1>Grund</h1>
                    <h2>${x.Reason}</h2>
                </div>
                <div class="stat">
                    <h1>Strafe</h1>
                    <h2>${x.Fine.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} $</h2>
                </div>
                <div class="stat">
                    <h1>Haftzeit</h1>
                    <h2>${x.JailTime}</h2>
                </div>
                <div class="stat">
                    <h1>Beamter</h1>
                    <h2>${x.Officer}</h2>
                </div>
            </div>
        </div>`
    })

    PoliceSwitchTab(null, 'playerRecord', false)

    currentId = PlayerOverviewData.Id;

    document.getElementById("save-player-akte").onclick = () => {
        SavePlayerAkte(PlayerOverviewData.Id);
    }

    document.getElementById("create-player-akte").onclick = () => {
        AkteAnlegen();
    }

    let aktenSlider = document.getElementById("akten-carousell");
    aktenSlider.noUiSlider.options.range.max = data.Paragraphs.length
}

const TakeLicense = (name) => {
    mp.trigger("Client:Laptop:TakeLicense", currentId, name);
};

function SetPlayerWantedStatus(status) {
    PlayerOverviewData.Wanted = status
    PoliceUpdatePlayerWantedStatus()
    mp.trigger('UpdatePlayerWantedStatus', PlayerOverviewData.Id, status)
}

function PoliceUpdatePlayerWantedStatus() {
    let statusitem = document.getElementById('policestatusitem')

    if (PlayerOverviewData.Wanted) {
        statusitem.style.color = '#5BA936'
        statusitem.innerText = 'Nicht gesucht'
    } else {
        statusitem.style.color = '#FF4B4B'
        statusitem.innerText = 'Gesucht'
    }
}

let laws = null
let _crimes = []
let selectedCrimes = []
function SetLaws(_data) {

    Array.from(document.getElementsByClassName('laws-cats')).forEach(list => {
        list.innerHTML = ''

        laws.Categories.forEach(x => {
            list.innerHTML +=
                `<div class="inner-left-item" id="law-category" onclick="LoadLaws(this, ${x.Id})">${x.Name}</div>`
        })
    })
}

let lawUid = 0
function LoadLaws(el, id) {
    Array.from(document.getElementsByClassName('inner-left-item')).forEach(x => x.classList.remove('active'))

    el.classList.add('active')
    let list = document.getElementById('laws')
    list.innerHTML = ''
    _crimes = []

    laws.Laws.filter(x => x.CategoryId == id).forEach(x => {
        list.innerHTML +=
            `<div class="inner-right-item">
            <div class="law-info">
                $${x.Geldstrafe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} • ${x.Haftstrafe} Minuten
            </div>
            <p class="title">${x.Name}</p>
            <p class="text">${x.Description}</p>
        </div>`
    })

    let list2 = document.getElementById('crimes')
    list2.innerHTML = ''

    laws.Laws.filter(x => x.CategoryId == id).forEach(x => {
        list2.innerHTML +=
            `<div class="inner-right-item">
            <label class="cb-container">
                <input type="checkbox" class="crime-cb" onchange="CheckCrime(this, ${x.Id})">
                <span class="checkmark"></span>
            </label>
            <div class="law-info">
                $${x.Geldstrafe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} • ${x.Haftstrafe} Minuten
            </div>
            <p class="title">${x.Name}</p>
            <p class="text">${x.Description}</p>
        </div>`
    })
}

function CheckCrime(checkbox, lawId) {
    lawUid++
    if (checkbox.checked == true) {
        _crimes.push({ Uid: lawUid, LawId: lawId })
    } else {
        _crimes.splice(_crimes.indexOf(_crimes.find(x => x.LawId == lawId)), 1)
    }
}

function AddCrimes() {
    selectedCrimes = selectedCrimes.concat(_crimes)
    _crimes = []
    Array.from(document.getElementsByClassName('crime-cb')).forEach(x => {
        x.checked = false
    })

    LoadSelectedCrimes()
}

function LoadSelectedCrimes() {
    let list2 = document.getElementById('addedcrimes')
    list2.innerHTML = ''

    let fine = 0
    let jailtime = 0

    selectedCrimes.forEach(_x => {
        let law = laws.Laws.find(x => x.Id == _x.LawId)
        fine += law.Geldstrafe
        jailtime += law.Haftstrafe
        list2.innerHTML +=
            `<div class="inner-right-item">
            <label class="cb-container">
                <span class="checkmark btnicon" onclick="RemoveCrime(${_x.Uid})"></span>
            </label>
            <div class="law-info">
                $${law.Geldstrafe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} • ${law.Haftstrafe} Minuten
            </div>
            <p class="title">${law.Name}</p>
            <p class="text">${law.Description}</p>
        </div>`
    })

    document.getElementById('crimes-jailtime').innerText = `${jailtime} Hafteinheiten`
    document.getElementById('crimes-fine').innerText = `${fine.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} $`
}

function RemoveCrime(id) {
    selectedCrimes.splice(selectedCrimes.findIndex(x => x.Uid == id), 1)

    LoadSelectedCrimes()
}

function AddPlayerCrimes() {
    let _crimes = selectedCrimes
    selectedCrimes = []
    let crimes = []
    _crimes.forEach(x => {
        crimes.push(x.LawId)
    })

    mp.trigger('AddPlayerCrimes', PlayerOverviewData.Id, JSON.stringify(crimes))
}

function PoliceSearchVehicle() {
    let data = document.getElementById('policevehsearchinput').value

    mp.trigger('PoliceSearchVehicle', data)
}

function SetPoliceSearchedVehicles(_data) {
    const data = JSON.parse(_data)
    const list = document.getElementById('policesearchedvehicles')
    let i = 1

    list.innerHTML = ''

    data.forEach(x => {
        list.innerHTML +=
            `<div class="search-result-item" onclick="PoliceGetVehicleData(${x.Id})">
            <div class="id">${i}</div>
            <div class="car-name">${x.Name}</div>
            <div class="car-id">${x.Id}</div>
            <div class="car-plate">${x.Plate}</div>
            <div class="car-status">${x.Wanted ? 'Gesucht' : 'Nicht Gesucht'}</div>
        </div>`

        i++
    })
}

function PoliceGetVehicleData(id) {
    mp.trigger('PoliceGetVehicleData', id)
}

let policeVehicleData = null
function PoliceOpenVehicleOverview(_data) {
    policeVehicleData = JSON.parse(_data)

    document.getElementById('policevehicleinfoname').innerText = policeVehicleData.Name.replace('_', ' ')
    document.getElementById('policevehicleinfoid').innerText = policeVehicleData.Id
    document.getElementById('policevehicleinfobirthdate').innerText = policeVehicleData.VehicleName
    document.getElementById('policevehicleplate').innerText = policeVehicleData.Plate

    PoliceSwitchTab(null, 'vehicleOverview', false)
    UpdatePoliceVehicleData()
}

function SelectWantedStatus(status) {
    policeVehicleData.WantedStatus = status

    UpdatePoliceVehicleData()
    document.getElementById('policevehstatuslist').style.display = 'none'
    mp.trigger('UpdateVehicleWantedStatus', policeVehicleData.Id, status)
}

function UpdatePoliceVehicleData() {
    let polcevehstatus = document.getElementById('policevehiclestatus')
    let policevehstatusitem1 = document.getElementById('policevehstatusitem1')
    let policevehstatusitem2 = document.getElementById('policevehstatusitem2')

    switch (policeVehicleData.WantedStatus) {
        case 0:
            policevehstatusitem1.style.color = '#FF4B4B'
            policevehstatusitem1.innerText = 'Gesucht'
            policevehstatusitem1.onclick = () => SelectWantedStatus(2)
            policevehstatusitem2.style.color = '#E9CC34'
            policevehstatusitem2.innerText = 'Geklaut'
            policevehstatusitem2.onclick = () => SelectWantedStatus(1)
            polcevehstatus.style.color = '#5BA936'
            polcevehstatus.innerHTML = 'Nicht Gesucht<img src="./img/arrowdown.svg" class="policevehiclestatusarrow" id="policevehicledropdown">'
            break
        case 1:
            policevehstatusitem1.style.color = '#FF4B4B'
            policevehstatusitem1.innerText = 'Gesucht'
            policevehstatusitem1.onclick = () => SelectWantedStatus(2)
            policevehstatusitem2.style.color = '#5BA936'
            policevehstatusitem2.innerText = 'Nicht Gesucht'
            policevehstatusitem2.onclick = () => SelectWantedStatus(0)
            polcevehstatus.style.color = '#E9CC34'
            polcevehstatus.innerHTML = 'Geklaut<img src="./img/arrowdown.svg" class="policevehiclestatusarrow" id="policevehicledropdown">'
            break
        case 2:
            policevehstatusitem1.style.color = '#E9CC34'
            policevehstatusitem1.innerText = 'Geklaut'
            policevehstatusitem1.onclick = () => SelectWantedStatus(1)
            policevehstatusitem2.style.color = '#5BA936'
            policevehstatusitem2.innerText = 'Nicht Gesucht'
            policevehstatusitem2.onclick = () => SelectWantedStatus(0)
            polcevehstatus.style.color = '#FF4B4B'
            polcevehstatus.innerHTML = 'Gesucht<img src="./img/arrowdown.svg" class="policevehiclestatusarrow" id="policevehicledropdown">'
            break
    }
}

function ToggleDropDown(el, arrowId, boxId) {
    let arrow = document.getElementById(arrowId)
    let box = document.getElementById(boxId)
    if (box.style.display == 'block') {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)'
        box.style.display = 'none'
    } else {
        arrow.style.transform = 'translateY(-50%) rotate(180deg)'
        box.style.display = 'block'
    }
}

let settingsAppData = null
function OpenSettingsApp(_data) {
    settingsAppData = JSON.parse(_data)
    document.getElementById('pimmelring').style.background = settingsAppData.Notifications ? '#5BA936' : '#b6b6b6'

    document.getElementById("playerinfos-name").innerHTML = settingsAppData.Name.replace('_', ' ');
    document.getElementById("playerinfos-email").innerHTML = settingsAppData.Email;
    OpenApp('settings')
}

function ToggleNotifications() {
    settingsAppData.Notifications = !settingsAppData.Notifications
    document.getElementById('pimmelring').style.background = settingsAppData.Notifications ? '#5BA936' : '#b6b6b6'

    mp.trigger('SetNotificationStatus', settingsAppData.Notifications)
}

function OpenSettingsTab(tab) {
    document.getElementById('settingsTab-' + tab).style.display = 'block'
}

var slider = document.getElementById('slider');
noUiSlider.create(slider, {
    start: [0],
    connect: [true, false],
    step: 0.1,
    range: {
        'min': 0,
        'max': 1
    }
});

let Ringtone = 1
const audio = new Audio(`./ringtones/${Ringtone}.mp3`)
audio.volume = 1
let volume_slider = document.getElementById('slider')
volume_slider.noUiSlider.on('update', ChangeVolume)

function ChangeVolume() {
    audio.volume = volume_slider.noUiSlider.get()
}

function SelectRingtone(dotId, id) {
    Array.from(document.getElementsByClassName('pimmelring')).forEach(x => x.style.background = '#b6b6b6')
    document.getElementById(dotId).style.background = '#5BA936'
    audio.src = `./ringtones/${id}.mp3`
    audio.play()

    mp.trigger('Client:Laptop:UpdateRingtone', id, volume_slider.noUiSlider.get())
}

function SetRingtone(id, volume) {
    Array.from(document.getElementsByClassName('pimmelring')).forEach(x => x.style.background = '#b6b6b6')
    document.getElementById(dotId).style.background = '#5BA936'

    audio.src = `./ringtones/${id}.mp3`
    audio.volume = volume
    volume_slider.noUiSlider.set(volume)
}

function SelectBackground(el, id, save = true) {
    Array.from(document.getElementsByClassName('bgitem')).forEach(x => x.innerHTML = '')
    el.innerHTML = '<i class="bgitemactive fa-solid fa-circle-check"></i>'
    document.getElementById('app-home').style.backgroundImage = `url(./img/Wallpaper/${id}.jpg)`

    if(save) mp.trigger('Client:Laptop:ChangeWallpaper', id)
}

function SettingsCloseTab() {
    Array.from(document.getElementsByClassName('settingsTab')).forEach(x => {
        x.classList.add('settingsslideout')

        setTimeout(() => {
            x.style.display = 'none'
            x.classList.remove('settingsslideout')
        }, 250)
    })
}

function SetInfo(ringtone, ringvol, wallpaper) {
    SelectBackground(document.getElementById('bg-' + wallpaper), wallpaper, false)
    SetRingtone(ringtone, ringvol)
}

function CloseOVWApp() {
    OpenApp('home')
    setTimeout(() => OpenOVWTab(null), 250)
}

function OpenOVWTab(tab) {
    Array.from(document.getElementsByClassName('ovwTab')).forEach(x => x.style.display = 'none')
    if (tab != null) {
        document.getElementById('ovwTab-' + tab).style.display = 'flex'
        mp.trigger('GetOverviewAppData', tab)
    }
}

let OverviewData = null
function SetOverviewVehicleInfo(data) {
    OverviewData = JSON.parse(data)
    let vehicles = document.getElementById('ovwcontent')
    let keys = document.getElementById('ovwcontent2')

    let count = 1

    vehicles.innerHTML = ` `;
    keys.innerHTML = ` `;

    OverviewData.Vehicles.forEach(x => {
        vehicles.innerHTML +=
            `<div class="content-item garage-item">
            <div class="icon">${count}</div>
            <div class="text">${x.Name}</div>
            <div class="text n2">${x.Id}</div>
            <div class="text n3">${x.Plate}</div>
            <div class="text n4">${x.Garage}</div>
            <div class="icon2" onclick="LocateVehicle(${x.Coords})"><i class="fa-solid fa-location-dot"></i></div>
        </div>`

        count++
    })

    count = 1

    OverviewData.VehicleKeys.forEach(x => {
        keys.innerHTML +=
            `<div class="content-item garage-item">
            <div class="icon">${count}</div>
            <div class="text">${x.Name}</div>
            <div class="text n2">${x.Id}</div>
            <div class="text n3">${x.Plate}</div>
            <div class="text n4">${x.Garage}</div>
            <div class="icon2" onclick="LocateVehicle(${x.Coords})"><i class="fa-solid fa-location-dot"></i></div>
        </div>`

        count++
    })
}

function SetOverviewStorageInfo(data) {
    OverviewData = JSON.parse(data)
    let list = document.getElementById('ovwcontentstorage')
    let list2 = document.getElementById('ovwcontentstorage2')

    let count = 1

    OverviewData.Storages.forEach(x => {
        list.innerHTML +=
            `<div class="content-item garage-item">
            <div class="icon">${count}</div>
            <div class="text">${x.Name}</div>
            <div class="text n2">${x.Id}</div>
            <div class="text n3">${x.Slots}</div>
            <div class="text n4">${x.Position}</div>
            <div class="icon2" onclick="LocateVehicle(${x.Coords})"><i class="fa-solid fa-location-dot"></i></div>
        </div>`

        count++
    })

    count = 1

    OverviewData.StorageKeys.forEach(x => {
        list2.innerHTML +=
            `<div class="content-item garage-item">
            <div class="icon">${count}</div>
            <div class="text">${x.Name}</div>
            <div class="text n2">${x.Id}</div>
            <div class="text n3">${x.Slots}</div>
            <div class="text n4">${x.Position}</div>
            <div class="icon2" onclick="LocateVehicle(${x.Coords})"><i class="fa-solid fa-location-dot"></i></div>
        </div>`

        count++
    })
}

function SetOverviewHouseInfo(data) {
    OverviewData = JSON.parse(data)
    let list = document.getElementById('ovwcontenthouse')
    let list2 = document.getElementById('ovwcontenthouse2')

    let count = 1

    OverviewData.Houses.forEach(x => {
        list.innerHTML +=
            `<div class="content-item garage-item">
            <div class="icon">${count}</div>
            <div class="text n11">${x.Name}</div>
            <div class="text n22">${x.Id}</div>
            <div class="text n33">${x.RentSlots}</div>
            <div class="text n44">${x.GarageSlots}</div>
            <div class="text n55">${x.Position}</div>
            <div class="icon2" onclick="LocateVehicle(${x.Coords})"><i class="fa-solid fa-location-dot"></i></div>
        </div>`

        count++
    })

    count = 1

    OverviewData.HouseKeys.forEach(x => {
        list2.innerHTML +=
            `<div class="content-item garage-item">
            <div class="icon">${count}</div>
            <div class="text n11">${x.Name}</div>
            <div class="text n22">${x.Id}</div>
            <div class="text n33">${x.RentSlots}</div>
            <div class="text n44">${x.GarageSlots}</div>
            <div class="text n55">${x.Position}</div>
            <div class="icon2" onclick="LocateVehicle(${x.Coords})"><i class="fa-solid fa-location-dot"></i></div>
        </div>`

        count++
    })
}

function LocateVehicle(x, y) {
    mp.trigger('Client:Laptop:LocateVehicle', x, y)
}

let CMailData = null
function OpenCMailApp() {
    document.getElementById('cmail-loading').style.display = 'flex'
    mp.trigger('GetMailAppInfo')
}

function SetCMailAppInfo(data, name) {
    CMailData = JSON.parse(data)
    if (name && name.length > 0)
        playerName = name
    document.getElementById('cmailname').innerText = playerName.replace('_', ' ')
    document.getElementById('cmailmail').innerText = playerName.replace('_', '.').toLowerCase() + '@cmail.com'
    let list = document.getElementById('cmail-list')
    list.innerHTML =
        `<div class="loading" id="cmail-loading" style="display: none;">
        <i class="fal fa-sync fa-spin"></i>
        <p style="margin-top: 2vh;">Loading...</p>
    </div>`

    GetCurrentList().forEach(x => {
        if (x.Deleted) return

        list.innerHTML +=
            `<div class="message-box-item ${x.Read ? '' : 'unread'}">
            <label class="cb-container">
                <input type="checkbox" id="cmail-cb-${x.Id}" onchange="CheckCheckbox(${x.Id}, this.checked)">
                <span class="checkmark"></span>
            </label>
            <i class="fa-solid fa-thumbtack ${x.Pinned ? 'pinned' : ''}" onclick="PinMail(${x.Id})"></i>
            <div class="cmail-item-dings-container" onclick="OpenMail(${x.Id})">
                <p class="mail-sender">${x.Sender}</p>
                <p class="mail-title">${x.Message}</p>
                <p class="mail-date">${x.Date}</p>
            </div>
        </div>`
    })


    document.getElementById('cmail-loading').style.display = 'none'
}

function SearchEmails() {
    let input = document.getElementById('email-searchbar')
    let list = document.getElementById('cmail-list')
    let mails = GetCurrentList()

    list.innerHTML =
        `<div class="loading" id="cmail-loading" style="display: none;">
        <i class="fal fa-sync fa-spin"></i>
        <p style="margin-top: 2vh;">Loading...</p>
    </div>`

    mails.filter(x => x.Message.toLowerCase().includes(input.value.toLowerCase()) || x.Sender.toLowerCase().includes(input.value.toLowerCase())).forEach(x => {
        list.innerHTML +=
            `<div class="message-box-item ${x.Read ? '' : 'unread'}">
            <label class="cb-container">
                <input type="checkbox" id="cmail-cb-${x.Id}" onchange="CheckCheckbox(${x.Id}, this.checked)">
                <span class="checkmark"></span>
            </label>
            <i class="fa-solid fa-thumbtack ${x.Pinned ? 'pinned' : ''}" onclick="PinMail(${x.Id})"></i>
            <div class="cmail-item-dings-container" onclick="OpenMail(${x.Id})">
                <p class="mail-sender">${x.Sender}</p>
                <p class="mail-title">${x.Message}</p>
                <p class="mail-date">${x.Date}</p>
            </div>
        </div>`
    })
}

let currentMailIndex = -1
function OpenMail(id) {
    const mail = CMailData.find(x => x.Id == id)
    currentMailIndex = CMailData.indexOf(mail)

    document.getElementById('readmail-sender').innerText = mail.Sender.replace('_', ' ')
    document.getElementById('readmail-mail').innerText = mail.Sender.replace('_', '.') + '@cmail.com'
    document.getElementById('cmail-mailindex').innerText = `${currentMailIndex + 1} / ${CMailData.length}`
    document.getElementById('readmail').style.display = 'block'

    mp.trigger("OpenMail", id)
}

function ExitMail() {
    SetCMailAppInfo(JSON.stringify(CMailData))
    document.getElementById('readmail-inner').classList.add('content-email-read-inner-anim')
    setTimeout(() => {
        document.getElementById('readmail').style.display = 'none'
        document.getElementById('readmail-inner').classList.remove('content-email-read-inner-anim')
    }, 250)
}

function SwitchMail(mod) {
    currentMailIndex += mod
    const mail = CMailData[currentMailIndex]

    document.getElementById('readmail-sender').innerText = mail.Sender.replace('_', ' ')
    document.getElementById('readmail-mail').innerText = mail.Sender.replace('_', '.') + '@cmail.com'
    document.getElementById('cmail-mailindex').innerText = `${currentMailIndex + 1} / ${CMailData.length}`
}

function OpenSendMail(reply) {
    ExitMail()
    document.getElementById('input-reciver').value = reply ? CMailData[currentMailIndex].Sender.replace('_', '.').toLowerCase() + '@cmail.com' : ''
    document.getElementById('cmail-betreff').innerText = reply ? 'Re:' : 'Betreff:'
    document.getElementById('input-title').value = ''
    document.getElementById('MailTextArea').value = ''
    document.getElementById('sendmail').style.display = 'block'
}

function ClearSendMailText() {
    document.getElementById('MailTextArea').value = ''
}

function CloseSendMail() {
    let el = document.getElementById('sendmail')
    el.classList.add('sendmail-closeanim')

    setTimeout(() => {
        el.style.display = 'none'
        el.classList.remove('sendmail-closeanim')
    }, 250)
}

function SendMail() {
    let target = document.getElementById('input-reciver').value
    let betreff = document.getElementById('input-title').value
    let message = document.getElementById('MailTextArea').value

    CloseSendMail()

    if (target != '' && message != '')
        mp.trigger('SendCMail', target, betreff, message)
}

function PinMail(id) {
    const mailIndex = CMailData.findIndex(x => x.Id == id)

    CMailData[mailIndex].Pinned = !CMailData[mailIndex].Pinned
    SetCMailAppInfo(JSON.stringify(CMailData))
    mp.trigger('SetMailPinned', CMailData[mailIndex].Id, CMailData[mailIndex].Pinned)
}

function DeleteMail(id) {
    CMailData[CMailData.findIndex(x => x.Id == id)].Deleted = true
    SetCMailAppInfo(JSON.stringify(CMailData))
    mp.trigger('DeleteMail', id)
}

let cmailCategory = 1
function GetCurrentList() {
    let mails = []
    switch (cmailCategory) {
        case 1:
            mails = CMailData.filter(x => !x.Deleted)
            break
        case 2:
            mails = CMailData.filter(x => x.Sender.startsWith(playerName.split(' ')[0]))
            break
        case 3:
            mails = CMailData.filter(x => x.Deleted)
            break
    }
    return mails
}

function SwitchCMailTab(el, tab) {
    cmailCategory = tab
    Array.from(document.getElementsByClassName('button')).forEach(x => x.classList.remove('active'))
    el.classList.add('active')
    document.getElementById('cmail-checkall').checked = false
    selectedMails = []
    document.getElementById('cmail-loading').style.display = 'flex'
    let list = document.getElementById('cmail-list')
    let mails = GetCurrentList()

    list.innerHTML =
        `<div class="loading" id="cmail-loading" style="display: none;">
        <i class="fal fa-sync fa-spin"></i>
        <p style="margin-top: 2vh;">Loading...</p>
    </div>`

    mails.forEach(x => {
        list.innerHTML +=
            `<div class="message-box-item ${x.Read ? '' : 'unread'}">
            <label class="cb-container">
                <input type="checkbox" id="cmail-cb-${x.Id}" onchange="CheckCheckbox(${x.Id}, this.checked)">
                <span class="checkmark"></span>
            </label>
            <i class="fa-solid fa-thumbtack ${x.Pinned ? 'pinned' : ''}" onclick="PinMail(${x.Id})"></i>
            <div class="cmail-item-dings-container" onclick="OpenMail(${x.Id})">
                <p class="mail-sender">${x.Sender}</p>
                <p class="mail-title">${x.Message}</p>
                <p class="mail-date">${x.Date}</p>
            </div>
        </div>`
    })


    document.getElementById('cmail-loading').style.display = 'none'
}

let selectedMails = []
function CheckCheckbox(mailId, newVal) {
    if (newVal) {
        selectedMails.push(mailId)
    } else
        selectedMails.splice(selectedMails.indexOf(mailId), 1)

    document.getElementById('cmail-trashdings').style.display = selectedMails.length > 0 ? 'block' : 'none'
}

function CheckAllBoxes(val) {
    let mails = GetCurrentList()
    selectedMails = []

    mails.forEach(x => {
        if (val)
            selectedMails.push(x.Id)

        document.getElementById('cmail-cb-' + x.Id).checked = val
    })

    document.getElementById('cmail-trashdings').style.display = selectedMails.length > 0 ? 'block' : 'none'
}

function DeleteSelectedMails() {
    let mails = []
    for (let i = 0; i < CMailData.length; i++) {
        let mail = CMailData[i]
        if (!selectedMails.includes(mail.Id)) continue

        mails.push(mail.Id)

        if (cmailCategory == 3) {
            CMailData.splice(i, 1)
            i--
        }
        else {
            CMailData[i].Deleted = true
        }
    }

    SetCMailAppInfo(JSON.stringify(CMailData))

    if (cmailCategory == 3)
        mp.trigger('DeleteMailsDelete', JSON.stringify(mails))
    else
        mp.trigger('DeleteMails', JSON.stringify(mails))
}

const SavePlayerAkte = (id) => {
    var info = document.getElementById("policeovwinfos").value
    mp.trigger('UpdatePlayerPoliceInfo', id, info)
};

const AkteAnlegen = () => {
    document.getElementById('policeTab-AddCrimes').style.display = 'block';
    document.getElementById('crimes-name').innerText = PlayerOverviewData.Name.replace('_', ' ');

    document.getElementById('policeTab-playerRecord').style.display = 'none';
};

/* FRAKTIONS ÜBERSICHT */
let changedUsers = [];
let factionUsers = [];
let factionData = null;

const LoadFactionMembers = (data) => {
    changedUsers = [];
    factionUsers = [];
    factionData = null;
    factionData = JSON.parse(data)
    let faction = document.getElementById('faction-content')
    faction.innerHTML = ` `;

    factionData.FractionMembers.forEach(x => {
        faction.innerHTML += `
        <div class="content-item">
            <div class="icon">${x.AccountId}</div>
            <div class="text">${x.Username.split('_')[0]}</div>
            <div class="text n2">${x.Username.split('_')[1]}</div>
            <div class="text n3"><input id="inner-item-rank" /></div>   
            <div class="text n4"><input id="inner-item-payday"/></div>
            <div class="control" onclick="SaveFrakUserChanges(this, ${x.AccountId})"><i class="fa-solid fa-floppy-disk"></i></div>
            <div class="icon2" onclick="KickOutFaction(${x.AccountId})"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>`;

        document.getElementById("inner-item-rank").value = `${x.Rank}`;
        document.getElementById("inner-item-payday").value = `${x.Payday}`;

        factionUsers.push({
            AccountId: x.AccountId,
            Username: x.Username,
            Rank: x.Rank,
            Payday: x.Payday
        });
    });
};

const KickOutFaction = (id) => {
    mp.trigger("Client:Fraktion:KickUser", id);
};

const SaveFrakUserChanges = (element, id) => {
    let parentNode = element.parentNode;
    let rank = parentNode.querySelector('#inner-item-rank').value;
    let payday = parentNode.querySelector('#inner-item-payday').value;

    factionUsers.forEach(data => {
        if (data.id === id) {
            if (data.Rank != rank || data.Payday != payday) {
                let rankData = {
                    AccountId: data.AccountId,
                    Username: data.Username,
                    Rank: rank,
                    Payday: payday
                };
                console.table(rankData);
                mp.trigger("Client:Fraktion:SaveUser", rankData);
            }
        }
    });
};

const CloseFrakApp = () => {
    OpenApp('home')
    document.getElementById("app-faction").style.display = 'none';
};

// BUSINESS APP
let businessUsers = [];
let businessData = null;

const LoadBusinessMembers = (data) => {
    businessUsers = [];
    businessData = null;
    businessData = JSON.parse(data)
    let business = document.getElementById('business-content')
    business.innerHTML = ` `;

    businessData.BusinessMembers.forEach(x => {
        business.innerHTML += `
        <div class="content-item">
            <div class="icon">${x.AccountId}</div>
            <div class="text">${x.Username.split('_')[0]}</div>
            <div class="text n2">${x.Username.split('_')[1]}</div>
            <div class="text n3"><input id="inner-item-rank" /></div>   
            <div class="text n4"><input id="inner-item-payday"/></div>
            <div class="control" onclick="SaveBusinessUserChanges(this, ${x.AccountId})"><i class="fa-solid fa-floppy-disk"></i></div>
            <div class="icon2" onclick="KickOutBusiness(${x.AccountId})"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>`;

        document.getElementById("inner-item-rank").value = `${x.Rank}`;
        document.getElementById("inner-item-payday").value = `${x.Payday}`;

        factionUsers.push({
            AccountId: x.AccountId,
            Username: x.Username,
            Rank: x.Rank,
            Payday: x.Payday
        });
    });
};

const KickOutBusiness = (id) => {
    mp.trigger("Client:Business:KickUser", id);
};

const SaveBusinessUserChanges = (element, id) => {
    let parentNode = element.parentNode;
    let rank = parentNode.querySelector('#inner-item-rank').value;
    let payday = parentNode.querySelector('#inner-item-payday').value;

    businessUsers.forEach(data => {
        if (data.id === id) {
            if (data.Rank != rank || data.Payday != payday) {
                let rankData = {
                    AccountId: data.AccountId,
                    Username: data.Username,
                    Rank: rank,
                    Payday: payday
                };

                console.table(rankData);
                mp.trigger("Client:Business:SaveUser", rankData);
            }
        }
    });
};

const CloseBusinessApp = () => {
    OpenApp('home')
    document.getElementById("app-business").style.display = 'none';
};