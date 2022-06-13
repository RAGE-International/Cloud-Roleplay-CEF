(function() {
    const obj = document.querySelector('.navigator-bar .navs');

    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        obj.scrollLeft -= (delta * 50);
        e.preventDefault();
    }

    obj.addEventListener('mousewheel', scrollHorizontally, false);

    function mouseenterfavorites(element) {
        $(element).find(".delete-fav").fadeIn(75);
        $(element).find(".delete-fav").css('display', 'flex')
    }

    function mouseleavefavorites(element) {
        $(element).find(".delete-fav").fadeOut(75);
    }

    $(".switch-control input[type=checkbox]").change(function() {
        let boxId = $(this).attr("id")
        switch (boxId) {
            case "muteCheckbox":
                storage.settings.is_soundmuted = $("#muteCheckbox").prop("checked")
                break;
            case "flymodeCheckbox":
                storage.settings.is_flightmodel = $("#flymodeCheckbox").prop("checked")
                break;
            case "unknownnumber":
                storage.settings.is_number_suppressed = $("#unknownnumber").prop("checked")
                break;
            case "radio-push-talk":
                if ($("#radio-perm-talk").prop("checked")) {
                    $("#radio-perm-talk").prop("checked", false)
                }
                break;
            case "radio-perm-talk":
                if ($("#radio-push-talk").prop("checked")) {
                    $("#radio-push-talk").prop("checked", false)
                }
                break;
            default:
                break;
        }
    });



    $("#iphone .face .screen>.app.navigator .navigator-bar-wrapper .navigator-bar .navs .nav").click(function() {

        var elements = $("#iphone .face .screen>.app.navigator .navigator-bar-wrapper .navigator-bar .navs .nav");

        $(elements).each((index, elem) => {
            $(elem).removeClass('active');
        });

        $(this).addClass('active');

        //TO DO CHANGE NAV LIST
    });
})();

setInterval(() => {
    UpadtePhoneClock();
}, 1000);

setInterval(() => {
    if (typeof storage !== 'undefined') {
        if (!storage.numbers.length) {
            $('.add-number').css('visibility', 'hidden');
        } else {
            $('.add-number').css('visibility', 'visible');
        }
    }
}, 1);