let houseData = null

function loadHouse(rawjson, playername) {
    houseData = JSON.parse(rawjson)

    document.getElementById('houseInfo').innerHTML = ''

    if(houseData.Owner == "FREE") {
        $('.house-info').append(`
        <div class="title">
            <div class="icon"><i class="fa-solid fa-house"></i></div>
            <div class="house-type">Haus</div>
        </div>
        <div class="house-name">${houseData.Name}</div>
        <div class="quality-text">Hausqualität</div>
        <div class="quality-stars">${GetHouseQuality()}</div>
        <div class="info-box">
            <div class="info">
                <div class="info-title">Preis</div>
                <div class="info-text">$${houseData.Price.toLocaleString("de-DE")}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Steuern</div>
                <div class="info-text">$${houseData.Taxes.toLocaleString("de-DE")}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Mietplätze</div>
                <div class="info-text">${houseData.RentalSpaces}</div>
            </div>

        </div>
        <div class="buttons">
            <button class="active" onclick="BuyHouse()">Haus kaufen</button>
            <button onclick="CloseHouse()">Schließen</button>
        </div>
        `)
    } else if (houseData.Owner == playername) {
        $('.house-info').append(`<div class="title">
            <div class="icon"><i class="fa-solid fa-house"></i></div>
            <div class="house-type">Haus</div>
        </div>
        <div class="house-name">${houseData.Name}</div>
        <div class="quality-text">Hausqualität</div>
        <div class="quality-stars">${GetHouseQuality()}</div>
        <div class="info-box">
            <div class="info">
                <div class="info-title">Inhaber</div>
                <div class="info-text">${houseData.Owner}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Derzeitige Mieter</div>
                <div class="info-text">${houseData.Tenants.length}/${houseData.RentalSpaces} Bewohner</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Tür</div>
                <div class="info-text">${houseData.HasGarage ? 'Aufgeschlossen' : 'Abgeschlossen'}</div>
            </div>
            <div class="lock-box ${houseData.Locked ? 'locked' : 'unlocked'}">
                <i class="fa-solid fa-key"></i>
            </div>
        </div>
        <div class="buttons">
            <button class="active" onclick="EnterHouse()">Betreten</button>
            <button onclick="OpenGarage()">Garage</button>
            <button onclick="AccessOverview()">Übersicht</button>
            <button onclick="CloseHouse()">Schließen</button>
        </div>`)
    } else if(houseData.Tenants.some(x => x.Name == playername)) {
        $('.house-info').append(`<div class="title">
            <div class="icon"><i class="fa-solid fa-house"></i></div>
            <div class="house-type">Haus</div>
        </div>
        <div class="house-name">${houseData.Name}</div>
        <div class="quality-text">Hausqualität</div>
        <div class="quality-stars"><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star"></i></div>
        <div class="info-box">
            <div class="info">
                <div class="info-title">Inhaber</div>
                <div class="info-text">${houseData.Owner}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Miete pro Tag</div>
                <div class="info-text">$${houseData.Tenants.find(x => x.Name == playername).Rent}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Tür</div>
                <div class="info-text">${houseData.HasGarage ? 'Aufgeschlossen' : 'Abgeschlossen'}</div>
            </div>
            <div class="lock-box ${houseData.Locked ? 'locked' : 'unlocked'}">
                <i class="fa-solid fa-key"></i>
            </div>
        </div>
        <div class="buttons">
            <button class="active" onclick="EnterHouse()">Betreten</button>
            <button onclick="OpenGarage()">Garage</button>
            <button onclick="StopRent()">Ausmieten</button>
            <button onclick="CloseHouse()">Schließen</button>
        </div>`)
    } else {
        $('.house-info').append(`<div class="title">
            <div class="icon"><i class="fa-solid fa-house"></i></div>
            <div class="house-type">Haus</div>
        </div>
        <div class="house-name">${houseData.Name}</div>
        <div class="quality-text">Hausqualität</div>
        <div class="quality-stars"><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star active"></i><i class="fa-solid fa-star"></i></div>
        <div class="info-box">
            <div class="info">
                <div class="info-title">Inhaber</div>
                <div class="info-text">${houseData.Owner}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Derzeitige Mieter</div>
                <div class="info-text">${houseData.Tenants.length}/${houseData.RentalSpaces} Bewohner</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Miete pro Tag</div>
                <div class="info-text">$${houseData.Rent}</div>
            </div>
            <div class="stripe"></div>
            <div class="info">
                <div class="info-title">Tür</div>
                <div class="info-text">${houseData.HasGarage ? 'Aufgeschlossen' : 'Abgeschlossen'}</div>
            </div>
        </div>
        <div class="buttons">
            ${houseData.Locked ? '' : '<button class="active" onclick="EnterHouse()">Betreten</button>'}
            <button class="active" onclick="StartRent()">Einmieten</button>
            <button onclick="CloseHouse()">Schließen</button>
        </div>`)
    }

    $("#renter-info-text").html(`${houseData.Tenants.length}`)
}

function GetHouseQuality() {
    let result = ''
    let i = 0
    for(_ = 0; i < houseData.InteriorId; i++)
        result += '<i class="fa-solid fa-star active"></i>'

    for(_ = 0; i < 5; i++)
        result += '<i class="fa-solid fa-star"></i>'
    
    return result
}

function BuyHouse() {
    mp.trigger('BuyHouse', houseData.Id)
}

function EnterHouse() {
    mp.trigger('EnterHouse', houseData.Id)
}

let selectedVehicle = -1
function TakeVehicle() {
    if(selectedVehicle < 0 || houseData.GarageVehicles.find(x => x.Id == selectedVehicle)?.IsParked) return

    mp.trigger('TakeHouseVehicle', houseData.Id, selectedVehicle)
}

function ParkVehicle() {
    if(selectedVehicle < 0 || houseData.ParkedOutVehicles.find(x => x.Id == selectedVehicle) != null) return

    mp.trigger('ParkHouseVehicle', houseData.Id, selectedVehicle)
}

function SelectVehicle(vehId, type, el) {
    if(type) {
        selectedVehicle = vehId
    } else {
        selectedVehicle = vehId
    }

    Array.from(document.getElementsByClassName('garage-item')).forEach(x => x.className = 'content-item garage-item')
    el.className += ' content-item-active'
}

function OpenGarage() {
    let parkedcontent = document.getElementById('garageparkedcontent')
    let notparkedcontent = document.getElementById('garagenotparkedcontent')
    parkedcontent.innerHTML = ''
    notparkedcontent.innerHTML = ''

    houseData.GarageVehicles.forEach(x => {
        parkedcontent.innerHTML +=
        `<div class="content-item garage-item" onclick="SelectVehicle(${x.Id}, true, this)">
            <div class="icon">${houseData.GarageVehicles.indexOf(x)+1}</div>
            <div class="text">${x.DisplayName}</div>
            <div class="text n2">${x.Note}</div>
            <div class="text n3">${x.Id}</div>
        </div>`
    })

    houseData.ParkedOutVehicles.forEach(x => {
        notparkedcontent.innerHTML +=
        `<div class="content-item garage-item" onclick="SelectVehicle(${x.Id}, false, this)">
            <div class="icon">${houseData.ParkedOutVehicles.indexOf(x)+1}</div>
            <div class="text">${x.DisplayName}</div>
            <div class="text n2">${x.Note}</div>
            <div class="text n3">${x.Id}</div>
        </div>`
    })

    document.getElementById('garage').style.display = 'flex'    
}

function CloseGarage() {
    document.getElementById('garage').style.display = 'none'
}

function EnterBasement() {
    mp.trigger('EnterBasement', houseData.Id)
}

function AccessOverview() {
    let ovw = document.getElementById('overview')
    let content = document.getElementById('content')
    content.innerHTML = ''

    houseData.Tenants.forEach(x => {
        let name = x.Name.split('_')

        content.innerHTML +=
        `<div class="content-item" onclick="AccessSettings(${houseData.Tenants.indexOf(x)})">
            <div class="icon">${houseData.Tenants.indexOf(x)+1}</div>
            <div class="text">${name[0]}</div>
            <div class="text n2">${name[1]}</div>
            <div class="text n3">${x.Rent}</div>
        </div>`
    })
    document.getElementById('houseInfo').style.display = 'none'
    ovw.style.display = 'block'
}

let selectedRenter = -1
function AccessSettings(index) {
    let data = houseData.Tenants[index]
    let name = data.Name.split('_')
    selectedRenter = data.Id
    document.getElementById('sfirstname').innerText = name[0]
    document.getElementById('slastname').innerText = name[1]
    document.getElementById('sprice').value = data.Rent
    document.getElementById('renter-overview').style.display = 'block'
}

function SaveRenter() {
    CloseOverview()
    if(selectedRenter >= 0)
        mp.trigger('SaveRenter', selectedRenter, document.getElementById('sprice').value)
}

function KickRenter() {
    CloseOverview()
    if(selectedRenter >= 0)
        mp.trigger('KickRenter', selectedRenter)
}

function CloseOverview() {
    selectedRenter = -1
    document.getElementById('overview').style.display = 'none'
    document.getElementById('renter-overview').style.display = 'none'
    document.getElementById('houseInfo').style.display = 'block'
}

function StartRent() {
    mp.trigger('StartRent', houseData.Id)
}

function CancelRent() {
    mp.trigger('CancelRent', houseData.Id)
}

function CloseHouse() {
    mp.trigger('Client:House:DestroyHouse')
}