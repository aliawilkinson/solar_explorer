
$(document).ready(initializeSolarApp);

var solarBodies = {
    'sun': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [8, 26, 44] },
    'mercury': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [16, 21, 66] },
    'venus': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [21, 28, 16, 41] },
    'earth': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [56, 72, 89] },
    'mars': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [2, 16, 18, 36, 47] },
    'uranus': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [3, 26, 45, 47] },
    'jupiter': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [35, 97, 52] },
    'saturn': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [46, 26, 39, 50, 95] },
    'neptune': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [80, 19, 14] },
    'pluto': { wikiLink: null, videos: [], videoTitles: [], nasaPicture: [4, 3, 1, 2] }
};

function initializeSolarApp() {

    startModalClickHandler();
    populatePlanetModal();
    getWikiText();
    moveBackgroundOnMouseMove();
    shadowModal();
    createRemoveMoveButton();
    astronautMessage();

}

function populatePlanetModal() {
    for (let planet in solarBodies) {
        $(`.${planet}Div`).click(function () {
            renderPlanetInfoInModal(planet);
        });
        $('.modalShadow').click(function () {
            $(this).hide();
        });
        $('.modalBody').click(function () {
            event.stopPropagation();
        })
    }
}

function astronautMessage() {
    $('#astronaut').hover(function () {
        $('#astronautAndButton').append($('<div>')
            .attr('id', 'astronautMessage')
            .addClass('astronautMessage')
            .text('Brought to you by Bora, Hanh, Omer, Brett, and Alia!'));
    },
        function () {
            $('#astronautMessage').remove();
        })
}

function moveBackgroundOnMouseMove() {
    let galaxyBackground = $('.mainDisplayDiv');
    galaxyBackground.on('mousemove', function () {
        galaxyBackground.css('background-position-y', -1 * event.offsetY + 'px');

    });

    populatePictureArr();
    animateBackground($('.mainDisplayDiv'), -.05);
    displayText(solarBodies);
}

function createRemoveMoveButton() {
    let button = $('<button>', {
        'class': 'removeMoveButton',
        'id': 'removeMoveButton',
        'text': 'Vertical Stop',
        'on': {
            'click': toggleBackgroundMovementOff
        }
    });
    $('.astronautAndButton').append(button)
}

function createStartMoveButton() {
    let button = $('<button>', {
        'class': 'startMoveButton',
        'id': 'startMoveButton',
        'text': 'Vertical Start',
        'on': {
            'click': toggleBackgroundMovementOn
        }
    });
    $('.astronautAndButton').append(button)
}

function toggleBackgroundMovementOn() {
    $('#startMoveButton').remove();
    createRemoveMoveButton();
    let galaxyBackground = $('.mainDisplayDiv');
    galaxyBackground.on('mousemove', function () {
        galaxyBackground.css('background-position-y', -1 * event.offsetY + 'px');
    });
}


function toggleBackgroundMovementOff() {
    $('#removeMoveButton').remove();
    createStartMoveButton();
    $('.mainDisplayDiv').off();
}

function errorDisplay() {
    removeLoader();
    var apologyDiv = $('<div>').addClass('apologyDiv');
    apologyDiv.append($('<h1>').text('Lost in Space...'));
    var sadAlien = $('<img>').attr('src', 'images/sad_alien.png');
    apologyDiv.append(sadAlien);
    var smallApology = $('<h3>').text('Please check your internet connection and try again.');
    apologyDiv.append(smallApology);
    $('.contentDiv').append(apologyDiv);
}

function shadowModal() {
    var shadowDiv = $('<div>', {
        'class': 'shadowDiv',
        'id': 'shadowDiv',
        'on': {
            'click': removeModal
        }
    });
    $('body').append(shadowDiv)
}

function startModalClickHandler() {
    $('#bodyId').click(hideStartModal)
}

function hideStartModal() {
    $('#startModal').hide();
}

function getDataFromYoutube(planetInfo) {
    var youtubeAjaxObject = {
        'dataType': 'json',
        'url': 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
        'method': 'POST',
        'timeout': 3000,
        'data': {
            'q': 'solar system ' + planetInfo,
            'maxResults': 3,
            'type': 'video',
            'detailLevel': 'verbose'
        },
        'success': function (result) {
            if (result.success === true) {
                removeLoader();
                var currentSolarBodiesArr = Object.keys(result.data);
                solarBodies.videos = currentSolarBodiesArr;
                for (var i = 0; i < currentSolarBodiesArr.length; i++) {
                    var videoTitles = solarBodies[planetInfo].videoTitles;
                    var title = result.data[currentSolarBodiesArr[i]].snippet.title;
                    videoTitles = videoTitles.push(title);
                }
                renderVideosOnModal(currentSolarBodiesArr, planetInfo);
            } else {
                errorDisplay();
            }
        },
        'error': function (error) {
            errorDisplay()
        }
    };

    $.ajax(youtubeAjaxObject);
}

function renderVideosOnModal(currentSolarBodiesArr, planet) {
    var vidModal = $('<div>', {
        'class': 'videoModal',
        'id': 'videoModal'
    });
    var vidModalBody = $('<div>', {
        'class': 'videoModalBody',
        'id': 'videoModalBody'
    });
    var iFrame = $('<iframe>', {
        'class': 'videoPlayer',
        'id': 'videoPlayer',
        'src': '',
        'frameborder': '0',
        'allow': 'autoplay; encrypted-media'
    }).attr('allowFullscreen', 'allowFullscreen');
    $('#contentDiv').append(vidModal, vidModalBody, iFrame);

    var videoList = $('<ul>').addClass('videoListContainer');
    var videoElements = [];
    for (let i = 0; i < currentSolarBodiesArr.length; i++) {
        var videoLink = $('<li>', {
            text: solarBodies[planet].videoTitles[i],
            'class': 'videoList',
            on: {
                click: function () {
                    loadAndPlayVideo(currentSolarBodiesArr[i]);
                }
            }
        });
        videoElements.push(videoLink)
    }

    loadAndPlayVideo(currentSolarBodiesArr[0]);
    videoList.append(videoElements);
    $('#contentDiv').append(videoList);
}

function loadAndPlayVideo(link) {
    $('#videoModal').show();
    $('#videoPlayer').attr('src', 'https://www.youtube.com/embed/' + link)
}



function renderPlanetInfoInModal(planet) {
    $('#displayModal').empty();

    var planetInfo = solarBodies[planet];

    var infoContainer = $('<div>', {
        'class': 'displayModal',
        'id': 'displayModal'
    });
    var planetTitle = $('<div>', {
        'class': 'modalTitle',
        'id': 'modalTitle',
        'on': {
            'click': removeModal
        }
    });
    var aTag = $('<a>').text(planet.toUpperCase());
    planetTitle.prepend(aTag)
    var modalControls = $('<div>', {
        'class': 'modalControls',
        'id': 'modalControls',
    });
    var imagesButton = $('<button>', {
        'class': 'images buttons',
        'id': 'imageButton',
        text: 'Images',
        'on': {
            click: function () {
                imagesButtonHandler(planet)
            }
        }
    });
    var informationButton = $('<button>', {
        'class': 'information buttons',
        'id': 'infoButton',
        text: 'Information',
        'on': {
            'click': function () {
                infoButtonHandler(planet)
            }
        },
    });
    var videosButton = $('<button>', {
        'class': 'videos buttons',
        'id': 'videoButton',

        'on': {
            'click': function () {
                videoButtonHandler(planet)
            }
        },
        text: 'Videos'
    });

    var planetWikiLink = $('<a>', {
        target: '_blank',
        href: planetInfo.wikiLink,
        text: planet + ' wiki info'
    });
    var contentDiv = $('<div>', {
        'class': 'contentDiv',
        'id': 'contentDiv'
    });

    var videoList = $('<ul>').addClass('videoListContainer');
    var videoElements = [];
    var closeButton = $('<button>', {
        'id': 'closeButton',
        'class': 'closeButton',
        'text': 'x',
        'on': {
            'click': removeModal
        }
    });
    for (let i = 0; i < planetInfo.videos.length; i++) {
        var videoLink = $('<li>', {
            text: 'video ' + i,
            on: {
                click: function () {
                    loadAndPlayVideo(planetInfo.videos[i]);
                }
            }
        });
        videoElements.push(videoLink)
    }
    videoList.append(videoElements);
    planetTitle.append(closeButton);

    modalControls.append(imagesButton, informationButton, videosButton);
    infoContainer.append(planetTitle, contentDiv, modalControls);

    $('#bodyId').append(infoContainer);
    $('#displayModal').show();
    imagesButtonHandler(planet);
    shadowModal();
}

function infoButtonHandler(planet) {
    $('#contentDiv').empty();
    addLoader();
    getWikiText(planet);
    $('#modalTitle').hover(function () {
        $(this).css({
            'color': 'purple',
            'background-color': 'transparent',
            'text-decoration': 'underline'
        });
        $($(this).children()[0]).attr('href', solarBodies[planet].wikiLink);
        $($(this).children()[0]).attr('target', '_blank');
    });
    $('#modalTitle:visited').parent(function () {
        $(this).css({
            'color': 'white',
            'background-color': 'transparent',
            'text-decoration': 'none'
        });
    })
}

function imagesButtonHandler(planet) {
    $('#contentDiv').empty();
    addLoader();
    createCarousel(planet);
}

function videoButtonHandler(planet) {
    $('#contentDiv').empty();
    addLoader();
    getDataFromYoutube(planet);
    loadAndPlayVideo(solarBodies[planet].videos[0]);
}


function removeModal() {
    $('#displayModal').remove();
    $('#shadowDiv').remove();
    this.remove()
}


function loadAndPlayVideo(link) {
    $('#videoModal').show();
    $('#videoPlayer').attr('src', 'https://www.youtube.com/embed/' + link)
}

function getWikiText(planet) {
    if (planet === 'mercury') {
        var link = 'Mercury_(planet)';
        var wikiAjaxObject = {
            'dataType': 'json',
            'url': 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + link + '&callback=?',
            'timeout': 3000,
            'success': function (data) {

                solarBodies[planet].wikiLink = 'https://en.wikipedia.org/wiki/' + link
                removeLoader();
                parseWikiText(data)
            },

            'error': function (error) {
                errorDisplay()
            }
        };
        $.ajax(wikiAjaxObject);
    } else {
        var wikiAjaxObject = {
            'dataType': 'json',
            'url': 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + planet + '&callback=?',
            'timeout': 3000,
            'success': function (data) {
                if (solarBodies[planet] === undefined) {
                    return;
                }
                solarBodies[planet].wikiLink = 'https://en.wikipedia.org/wiki/' + planet;
                removeLoader();

                parseWikiText(data)

            },

            'error': function (error) {
                errorDisplay()
            }
        };
        $.ajax(wikiAjaxObject);
    }
}

function parseWikiText(data) {
    var markup = data.parse.text['*'];
    var infoDiv = $('<div></div>').html(markup);
    infoDiv.find('a').each(function () { $(this).replaceWith($(this).html()); });
    infoDiv.find('sup').remove();
    infoDiv.find('.mw-ext-cite-error').remove();
    var paragraphContentArr = ($(infoDiv).find('.mw-parser-output>p'));
    var textofParagraphContent = '';
    var pContentWithTags = textofParagraphContent;
    for (var k = 0; k < paragraphContentArr.length; k++) {
        pContentWithTags += ('<p>' + paragraphContentArr[k].innerHTML + '</p>')
    }
    removeLoader();
    $('#contentDiv').append(pContentWithTags);
    $('#contentDiv').append(pContentWithTags).addClass('changeText')
}

function populatePictureArr() {
    for (let eachBody in solarBodies) {
        var NasaImagesObject = {
            url: 'https://images-api.nasa.gov/search?q=' + eachBody,
            method: 'GET',
            'timeout': 3000,
            success: resp => {
                for (let i = 0; i < solarBodies[eachBody].nasaPicture.length; i++) {
                    var divToAppend = $('<div>');
                    var imagePath = resp.collection.items[solarBodies[eachBody].nasaPicture[i]].links[0].href;
                    solarBodies[eachBody].nasaPicture[i] = imagePath
                }
            }
        };
        $.ajax(NasaImagesObject)
    }
}

function animateBackground(element, speed, maxTime = Infinity) {
    element = $(element);
    var xpercent = 0;
    var timer = null;
    var intervalTime = 50;
    var elapsedTime = 0;
    maxTime *= 1000;

    function updateBackground() {
        xpercent += speed;
        elapsedTime += intervalTime;
        if (elapsedTime > maxTime) {
            clearInterval(timer);
        }
        element.css('background-position-x', xpercent + '%');
    }
    timer = setInterval(updateBackground, intervalTime);

}




function createCarousel(planetStr) {
    removeLoader();
    var images = solarBodies[planetStr].nasaPicture;
    var carouselContainer = $('<div>', {
        'class': 'carouselContainer'
    });
    var textOverlayDiv = $('<div>', {
        'class': 'text-overlay-div'
    }).append($('<span>', {
        'text': 'IMAGES FROM NASA (CLICK IMAGES TO SEE MORE)'
    }));

    $('.contentDiv').append(carouselContainer);
    for (var nasaIndex = 0; nasaIndex < images.length; nasaIndex++) {
        var planetImageContainer = $('<div>', {
            'class': 'carouselImages'
        });
        $('.carouselContainer').append(planetImageContainer);
        planetImageContainer.css({ 'background-image': 'url(' + images[nasaIndex] + ')' });
        if (nasaIndex === 0) {
            planetImageContainer.addClass('currentImage');
            planetImageContainer.addClass('hide');
        } else {
            planetImageContainer.addClass('hide');
        }
    }
    for (nasaIndexImg = 0; nasaIndexImg < $('.carouselContainer > div').length; nasaIndexImg++) {
        $('.carouselContainer > div').append(textOverlayDiv);
    }
    $('.carouselContainer > div').on('click', rotate);
}

function rotate() {
    $(this).removeClass('currentImage');
    var nextImage = $(this).next();
    if (nextImage.length !== 0) {
        nextImage.addClass('currentImage');
    } else {
        $('.carouselContainer :first-child').addClass('currentImage');
    }
}


function addLoader() {
    var loaderDiv = $('<div>', {
        'class': 'loader'
    });
    $('.contentDiv').append(loaderDiv);
}

function removeLoader() {
    $('.contentDiv').empty();
}

function displayText(planetList) {
    for (let planet in planetList) {
        $('.' + planet + 'Div').hover(function () {
            let planetName = this.className.slice(0, (this.className.length - 3));
            var planetSpan = $('<span>').text(planetName.toUpperCase());
            var planetTextAppear = $('<div>', {
                'class': 'planetText'
            }).append(planetSpan);
            $(this).append(planetTextAppear);
        },
            function () {
                $(this).empty();
            });
    }
}


