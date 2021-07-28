// write your code here
const menu = document.querySelector('div#ramen-menu')
const details = document.querySelector('div#ramen-detail')
const form = document.querySelector('form#ramen-rating')

const newForm = document.querySelector('form#new-ramen')


function renderAllRamens() {
    fetch('http://localhost:3000/ramens')
        .then(r => r.json())
        .then(ramens => {
            // console.log(data)
            ramens.forEach(ramen => {
                createOneRamen(ramen)
            })
        })
}

function createOneRamen(ramen) {
    const img = document.createElement('img')
    img.classList.add('ramen')
    img.dataset.id = ramen.id
    img.src = ramen.image

    menu.append(img)
}

function renderOneRamen(id) {
    return fetch(`http://localhost:3000/ramens/${id}`)
    .then(r => r.json())
}

function updateHomeShow() {
    const first = renderOneRamen(1)
    changeShowPage(first)
}

function changeShowPage(ramenFetch) {
    ramenFetch.then(r => {
        details.querySelector('img').src = r.image
        details.querySelector('h2').textContent = r.name 
        details.querySelector('h3').textContent = r.restaurant
        form.querySelector('input#rating').value = r.rating 
        form.querySelector('textarea#comment').value = r.comment
        form.dataset.id = r.id
    })
}


menu.addEventListener('click', event => {
    if (event.target.matches('img.ramen')) {
        const ramen = renderOneRamen(event.target.dataset.id)
        
        changeShowPage(ramen)

    }
})

form.addEventListener('submit', event => {
    event.preventDefault()

    console.log(event.target[1])

    const rating = event.target[0].value
    const comment = event.target[1].value



    const ramenObj = {
        rating, 
        comment
    }

    fetch(`http://localhost:3000/ramens/${form.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ramenObj)
    })
        .then(r => r.json())
        .then(data => console.log(data))

})

form.addEventListener('click', event => {
    // event.preventDefault()
    if (event.target.matches('button.delete-button')) {
        updateHomeShow()

        menu.querySelector(`img[data-id='${form.dataset.id}']`).remove()

        fetch(`http://localhost:3000/ramens/${form.dataset.id}`, {
            method: 'DELETE'
        })
    }
})

newForm.addEventListener('submit', event => {
    event.preventDefault()

    const name = event.target[0].value
    const restaurant = event.target[1].value
    const image = event.target[2].value
    const rating = event.target[3].value
    const comment = event.target[4].value

    const ramenObj = {
        name, 
        restaurant,
        image,
        rating,
        comment
    }

    newForm.reset()
    fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ramenObj)
    })
        .then(r => r.json())
        .then(createOneRamen)
})


renderAllRamens()
updateHomeShow()