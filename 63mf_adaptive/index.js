$(document).ready(function () {

//    first step in registration
//     $(document).on("click", function (e) {
//         var container = $(".own__gender");
//
//         if(container.has(e.target).length === 1){
//             container.addClass("open");
//         } else if(container.has(e.target).length === 0){
//             container.removeClass("open");
//             container.toggleClass("closed");
//         }
//
//     });
    $(".own__gender").on("click", function () {
        $(".own__gender").toggleClass("closed");
        $(".own__gender").toggleClass("open");

    });
    $(".selector-item").on("click", function () {
       $(".selector-item").each(function () {
           $(this).removeClass("selected");
       });
       $(this).addClass("selected");
        var ownGender = $(".landing__selector-selected").text($(this).text());
       console.log(ownGender);
    });

//    end first step

//    Second step in registration

    for(var i = 1943; i <= 1999; i++) {
        $(".year-birth .landing_selector-option").append("<span class='selector-item'>" + i + "</span>");
    };
//    End of second step
    
    $(".btn-next").on("click", function () {
        $(".progress-item.active").next().addClass("active");
        // $(".progress-item").removeClass("active");
        $(this).parent(".landing__reg__step").removeClass("active");
        $(".step1").next().addClass("active");
    })
});