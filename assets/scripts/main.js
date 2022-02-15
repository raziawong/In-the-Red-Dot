const MAP_ZOOM_INITIAL = 11;

function main() {
    let gd_census = [];

    function init() {
        initHeader();

        window.addEventListener('DOMContentLoaded', async function() {

        });
    }

    function initHeader() {
        let navBtn = document.getElementById('header-btn');

        navBtn.addEventListener('click', function() {
            let dropDownMenu = document.getElementById('header-menu');
            navBtn.classList.toggle('active');
            dropDownMenu.classList.toggle('active');
        });
    }

    function initCensus() {
        gd_census = getCensusData();
    }

    init();
}

main();