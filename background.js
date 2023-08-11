let objs = {
    body: null,
    inputCity: null,
    btnSearch: null,
    carousel: null,
    preUrl: null,
    btnPrev: null,
    btnNext: null,
    page: {
        cursor: 1,
        total: 1
    },
    toggleButton: null
}

const unsplashKey = `gKIQYmMrv6ATKxeRndxxi4lnFW7VwJ5P3mYt01D6ZoQ`
const strClassSelected = 'selected'

objs.body = document.querySelector('body')
objs.searchBar = document.querySelector('.searchBar')
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel = document.querySelector('.gallery')
objs.nav = document.querySelector('.nav')
objs.btnPrev = document.querySelector('.btnNav.perv')
objs.btnNext = document.querySelector('.btnNav.next')
objs.toggleButton = document.querySelector('.toggleButton');

const cbInput = (evt) => {
    if(evt.key === 'Enter' && objs.inputCity.value.trim().length){
        fetchData()
    }
}
const setKeyEvent = () => {

    objs.inputCity.addEventListener('keyup', cbInput)

    objs.body.addEventListener('keyup', function (evt){
        if(evt.key === 'ArrowLeft'){
            prevPage()
        }
        if(evt.key === 'ArrowRight'){
            nextPage()
        }
    })

    let arrEle = [objs.inputCity, objs.btnPrev, objs.btnNext]
    let evtName = ['keyup', 'click', 'click']
    let arrCB = [cbInput, prevPage, nextPage]

    arrEle.forEach((ele, index) =>{
        ele.addEventListener(evtName[index], arrCB[index])
    })
}

const prevPage = () => {
    if(objs.page.cursor > 1){
        objs.page.cursor--
    }
    fetchData()
}
const nextPage = () => {
    if(objs.page.cursor < objs.page.total){
        objs.page.cursor++
    }
    fetchData()
}

const fetchData = () => {
    const newCity = objs.inputCity.value.trim().toLowerCase() || 'panda'
    fetch(`https://api.unsplash.com/search/photos?client_id=${unsplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}&per_page=20`)
        .then((response) => response.json())
        .then((data) => {
            console.log('data raw: ', data)
            // todo: renderimage carousel
            renderImages(data.results)
            objs.page.total = data.total_pages
            if (objs.page.cursor === 1) {
                const img = data.results[0].urls.full
                objs.body.style.background = `url('${img}') no-repeat center center / 100% fixed`
            }
        })
        .catch((error)=>{
            console.error('Fetch error: ', error)
            displayErrorMessage('Error fetching data. Please check your connection or try it later.')
        })
}

const displayErrorMessage = (message) => {
    let errorEle = document.querySelector('.error')
    if(errorEle){
        errorEle.remove()
    }
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error'
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    objs.body.appendChild(errorMessage);
}

const renderImages = (arrImages)=> {
    // set background image with the new data got
    // const img = arrImages[0].urls.full
    // objs.body.style.background = `url('${img}') no-repeat center center / 100% fixed`
    // create carousel
    createCarousel(arrImages)
}

const updateBackgroundImage = function (url){
    objs.body.style.background = `url('${url}') no-repeat center center / 100% fixed`
}

const setImageSelected = (eleImage) => {
    let images = document.querySelectorAll('[data-index]')
    images.forEach(function (ele){
        ele.className = ''
    })
    eleImage.className = strClassSelected
}


const createCarousel = (arrImages) => {
    //
    objs.carousel.innerHTML = ''
    for(let i = 0; i < arrImages.length; i++){
        let item = document.createElement('div')
        if(i === 0){
            item.className = strClassSelected
        }
        const img = arrImages[i].urls.regular
        item.style.background = `url('${img}') no-repeat center center / 100% 100%`
        item.dataset.index = i
        item.style.animation = 'fadeIn 0.25s forwards'
        item.style.animationDelay = `${0.1 * i}S`

        item.dataset.url = arrImages[i].urls.full
        objs.carousel.appendChild(item)

        item.addEventListener('click', function (evt){
            objs.preUrl = evt.target.dataset.url;
            updateBackgroundImage(evt.target.dataset.url)
            setImageSelected(evt.target)
            // console.log('evt clicked', evt)
        })

        item.addEventListener('mouseover', function (evt){
            let newUrl = evt.target.dataset.url
            // replace the background image temporarily
            if(!objs.preUrl) {
                // save the current image url before replacement
                let str = objs.body.style.background
                // console.log('str bkg: ', str)
                let iStart = str.indexOf('"')
                let iEnd = str.indexOf('"', iStart + 1)
                str = str.slice(iStart + 1, iEnd)
                objs.preUrl = str
                updateBackgroundImage(newUrl)
            }
        })

        item.addEventListener('mouseout', function (evt){
            if(objs.preUrl){
                updateBackgroundImage(objs.preUrl)
                objs.preUrl = null
            }
        })

    }
}

let isCarouselShown = true;


objs.toggleButton.addEventListener('click', function () {
    if (isCarouselShown) {
        objs.carousel.style.display = 'none';
        objs.searchBar.style.display = 'none';
        objs.nav.style.display = 'none';
        objs.toggleButton.textContent = '▲';
        isCarouselShown = false;
    } else {
        objs.carousel.style.display = 'flex';
        objs.searchBar.style.display = 'block';
        objs.nav.style.display = 'flex';
        objs.toggleButton.textContent = '▼';
        isCarouselShown = true;
    }
});


fetchData()
setKeyEvent()
objs.btnSearch.addEventListener('click', fetchData)

