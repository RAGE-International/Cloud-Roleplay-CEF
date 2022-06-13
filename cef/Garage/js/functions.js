let GarageVehicles = [];
let GarageId = 0;

function VehicleModel(...args) {
    this.VehId = args[0];
    this.DisplayName = args[1]
    this.Health = args[2];
    this.Fuel = args[3];
    this.Numberplate = args[4];
    this.Km = args[5];
    this.TrunkWeight = args[6];
    this.Note = args[7];
    this.ParkedIn = args[8];
};

// let RAWJSON = '[[{"Id":2,"DisplayName":"zentorno","Health":1,"Fuel":100.0,"NumberPlate":"Test","Km":0.0,"TrunkWeight":500,"Note":"Penis","IsParked":false}], []]';

// InitVehicles(RAWJSON, 1, "PENIS")

function InitVehicles(rawjson, garageId, garagename) {
    $('.text .title').text(garagename)
    GarageId = garageId;

    let ParkedOutVehickles = JSON.parse(rawjson)[0];
    let ParkedInVehickles = JSON.parse(rawjson)[1];

    for (const veh of ParkedInVehickles) {
        AddVehicleToGarge(veh.Id, veh.DisplayName, veh.Health, veh.Fuel, veh.NumberPlate, veh.Km, veh.TrunkWeight, veh.Note, true)
    }

    for (const veh of ParkedOutVehickles) {
        AddVehicleToGarge(veh.Id, veh.DisplayName, veh.Health, veh.Fuel, veh.NumberPlate, veh.Km, veh.TrunkWeight, veh.Note, false)
    }

    LoadGarageVehicles();
}

function AddVehicleToGarge(vehid, displaybame, health, fuel, numberplate, km, trunkweight, note, parkedin) {
    GarageVehicles.push(new VehicleModel(vehid, displaybame, health, fuel, numberplate, km, trunkweight, note, parkedin));
};

function RemoveVehicleFromGarage(vehid) {
    let element = GarageVehicles.find(x => x.VehId == vehid);
    if (element != null) {
        let index = GarageVehicles.indexOf(element);
        GarageVehicles.splice(index, 1);
    }
};

function LoadGarageVehicles() {
    for (const veh of GarageVehicles) {
        console.log(veh);
        if (veh.ParkedIn) {
            let element_one = `
        <div class="car-card" id="veh-id-${veh.VehId}" data="${veh.VehId}">
            <p class="cartitle">${veh.DisplayName}</p>
            <div class="car-frame"><img class="car" src="./img/car.png" alt="">
                <div class="park" onclick="ParkCarOut('${GarageId}','${veh.VehId}')">
                    <img src="./img/take.png" alt="">
                    <span>Ausparken</span>
                </div>
            </div>
            <div class="car-shortinfo">
                <div class="carhealth">
                    <div class="icon-bg"><i class="fa-solid fa-car-crash"></i></div>
                    <p class="healthtext"><span id="health">${veh.Health}</span> %</p>
                </div>
                <div class="fuel">
                    <div class="icon-bg"><i class="fa-solid fa-gas-pump"></i></div>
                    <p class="fueltext"><span>${veh.Fuel.toFixed(2)}</span> L</p>
                </div>
            </div>
            <div class="car-info">
                <p class="carinfotitle">Fahrzeug Informationen</p>
                <div class="info">
                    Nummernschild
                    <span></span> ${veh.Numberplate}
                </div>
                <div class="info">
                    Kilometer
                    <span></span> ${veh.Km} km
                </div>
                <div class="info">
                    Kofferraum
                    <span></span> ${veh.TrunkWeight} kg
                </div>
                <div class="info">
                    Notiz
                    <span></span> ${veh.Note}
                </div>
            </div>
        </div>`;
            $('.parked .car-cards').owlCarousel('add', element_one).owlCarousel('update'); //Importent do not touch its for drag and slide

        } else {
            let element_sec = `
            <div class="car-card" id="veh-id-${veh.VehId}" data="${veh.VehId}">
                <p class="cartitle">${veh.DisplayName}</p>
                <div class="car-frame"><img class="car" src="./img/car2.png" alt="">
                    <div class="parkVehIn" onclick="ParkCarIn('${GarageId}','${veh.VehId}')">
                        <img src="./img/park.png" alt="">
                        <span>Einparken</span>
                    </div>
                </div>
                <div class="car-shortinfo">
                    <div class="carhealth">
                        <div class="icon-bg"><i class="fa-solid fa-car-crash"></i></div>
                        <p class="healthtext"><span id="health">${veh.Health}</span> %</p>
                    </div>
                    <div class="fuel">
                        <div class="icon-bg"><i class="fa-solid fa-gas-pump"></i></div>
                        <p class="fueltext"><span>${veh.Fuel.toFixed(2)}</span> L</p>
                    </div>
                </div>
                <div class="car-info">
                    <p class="carinfotitle">Fahrzeug Informationen</p>
                    <div class="info">
                        Nummernschild
                        <span></span> ${veh.Numberplate}
                    </div>
                    <div class="info">
                        Kilometer
                        <span></span> ${veh.Km} km
                    </div>
                    <div class="info">
                        Kofferraum
                        <span></span> ${veh.TrunkWeight} kg
                    </div>
                    <div class="info">
                        Notiz
                        <span></span> ${veh.Note}
                    </div>
                </div>
            </div>`;

            $('.parkIn .car-cards').owlCarousel('add', element_sec).owlCarousel('update'); //Importent do not touch its for drag and slide
        }
    }
};

function ParkCarOut(garageId, vehId) {
    if (garageId != null && vehId != null) {
        mp.events.call('Client:ParkOutVehicle', parseInt(garageId), parseInt(vehId));
    }
};

function ParkCarIn(garageId, vehId) {
    if (garageId != null && vehId != null) {
        console.log(garageId);
        console.log(vehId);
        mp.events.call('Client:ParkInVehicle', parseInt(garageId), parseInt(vehId));
    }
};

function CloseGarge() {
    mp.events.call('Client:DestroyGarage');
};

function CloseIconHover(state) {
    if (state) {
        $('.icon-bg #close').css('display', 'none')
        $('.icon-bg #icon').fadeIn(100)
    } else {
        $('.icon-bg #icon').css('display', 'none')
        $('.icon-bg #close').fadeIn(100)

    }
};

function RemoveAllOwlElements() {
    for (var i = 0; i < $('.car-card').length; i++) {
        $(".car-cards").trigger('remove.owl.carousel', [i]);
    }
}

// setTimeout(() => {
//     InitVehicles('[{"VehId":1,"DisplayName":"Vehicle 1","Health":100,"Fuel":10099,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":false},{"VehId":2,"DisplayName":"Vehicle 2","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":false},{"VehId":3,"DisplayName":"Vehicle 3","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":false},{"VehId":4,"DisplayName":"Vehicle 4","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":false},{"VehId":5,"DisplayName":"Vehicle 5","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":false},{"VehId":6,"DisplayName":"Vehicle 6","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":true},{"VehId":7,"DisplayName":"Vehicle 7","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":true},{"VehId":8,"DisplayName":"Vehicle 8","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":true},{"VehId":9,"DisplayName":"Vehicle 9","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":true},{"VehId":10,"DisplayName":"Vehicle 10","Health":50,"Fuel":99,"Numberplate":"Bubatz","Km":17899,"TrunkWeight":32,"Note":"Das ist mein Bubatz auto","ParkedIn":true}]');
// }, 1);