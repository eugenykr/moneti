$(document).ready(function() {
    $("ul.tabs__caption").on("click", "li:not(.active)", function() {
        $(this)
            .addClass("active")
            .siblings()
            .removeClass("active")
            .closest("div.tabs")
            .find("div.tabs__content")
            .removeClass("active")
            .eq($(this).index())
            .addClass("active");
    });

    // Spoiler
    $('.accordeon__spoiler-name').on('click', function() {
        if ( !$(this).hasClass('opened') ) {
            $('.accordeon__spoiler-name').removeClass('opened');
            $('.accordeon__spoiler-hide').slideUp(200);
            $(this).addClass('opened');
            $(this).closest('.accordeon__spoiler').find('.accordeon__spoiler-hide').slideDown(200);
        } else {
            $(this).removeClass('opened');
            $(this).closest('.accordeon__spoiler').find('.accordeon__spoiler-hide').slideUp(200);
        }
        return false;
    });

    $('.content-switcher__menu-item').on('click', function () {
       $(this).parents('.content-switcher')
           .find('.content-switcher__menu-item').removeClass('active').end()
           .find('.content-switcher__content-item').removeClass('active')
           .eq($(this).index()).addClass('active');
       $(this).addClass('active');
    });

    // $(window).on('resize scroll', function() {
    //     var reviews = $(".reviews ul");
    //     if ((reviews).isInViewport()) {
    //         reviews.endlessRiver({
    //             speed: 5,
    //             pause:true,
    //         });
    //     }
    // });

    var reviews = $(".reviews ul");
    reviews.endlessRiver({
        speed: 20,
        pause:true,
    });

    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
});