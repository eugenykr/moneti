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
});