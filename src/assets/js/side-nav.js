function sideNav(nav) {
    $('#sidenav-' + nav).toggleClass('open');
    $('#sidenav-' + (nav == 'left' ? 'right' : 'left')).removeClass('open');
    $('#main').toggleClass('open-' + nav);
    $('#main').removeClass('open-' + (nav == 'left' ? 'right' : 'left'));
}

$(document).ready(function() {
    $('#sidenav-left a').on('click', function() {
        sideNav('left');
    });
    $('#sidenav-right a').on('click', function() {
        sideNav('right');
    });
});