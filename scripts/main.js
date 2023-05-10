if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.register(
    '/service-worker.js'
  )
  console.info(
    `%c Service worker registered with scope: ${registration.scope}`,
    'font-weight:bold; color: cyan'
  )
}

async function getFirebaseDatabase(databaseName) {
  const { getDatabase, get, ref } = await import(
    'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js'
  )

  const { initializeApp } = await import(
    'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js'
  )

  const getClientHostname = window.location.hostname

  const urlApi =
    getClientHostname === 'afifurrohman-id.github.io'
      ? 'https://firebase-afif.deno.dev'
      : '/__/firebase/init.json'

  const responseApi = await fetch(urlApi)
  const dataApi = await responseApi.json()
  const firebaseConfig = await dataApi

  const app = initializeApp(firebaseConfig)
  const database = await getDatabase(app)
  const projectRef = ref(await database, databaseName)
  const responseDB = await get(projectRef)
  const data = await responseDB.val()

  return data
}

async function postView() {
  const wrapper = document.getElementById('content')
  const loading = wrapper.querySelector('.loading')

  const dataSnap = await getFirebaseDatabase('posts')
  loading.remove()

  let content = ''
  dataSnap.reverse().forEach((post) => {
    content +=
      /*html*/
      `<a href=${post.url} class="card-article">
            <h1>${post.title}</h1>
            <p>${post.description}</p>
            <p>${post.date}</p>
            <p>read more</p>
          </a>`
  })

  wrapper.insertAdjacentHTML('afterbegin', content)
}

async function socialMediaView() {
  const wrapper = document.querySelector('.social-media')
  const loading = wrapper.querySelector('.loading')

  const dataSnap = await getFirebaseDatabase('social-media')
  loading.remove()

  let content = ''
  dataSnap.forEach((social) => {
    content += /*html*/ `<a href=${social.url} class="social">${social.title}</a>`
  })
  wrapper.insertAdjacentHTML('afterbegin', content)
}

function handleToggle() {
  const body = document.body
  const menu = body.querySelector('.main-menu')
  const toggleMenu = body.querySelector('.toggle-menu')
  const toggleTheme = menu.querySelector('.toggle-theme')

  toggleMenu.addEventListener('click', () => {
    const menuItems = menu.querySelectorAll('a')
    menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        menu.classList.remove('slide')
      })
    })
    menu.classList.toggle('slide')
  })

  // TODO: Revision Code
  function setThemeMode(
    classToAdd = 'dark',
    classToRemove = 'light',
    theme = 'dark'
  ) {
    body.classList.add(classToAdd)
    body.classList.remove(classToRemove)
    localStorage.setItem('theme', theme)
    theme === 'dark'
      ? (toggleTheme.innerHTML = themeIconElement())
      : (toggleTheme.innerHTML = themeIconElement(false))
  }

  toggleTheme.addEventListener('click', () => {
    localStorage.getItem('theme') === 'dark'
      ? setThemeMode('light', 'dark', 'light')
      : setThemeMode()
    menu.classList.remove('slide')
  })

  localStorage.getItem('theme') === 'dark'
    ? setThemeMode()
    : setThemeMode('light', 'dark', 'light')
}

function themeIconElement(isDark = true) {
  const sunIcon = /*html*/ `        
  <svg
  class="toggle-theme-icon"
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='white'
        stroke='white'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      >
        <circle cx='12' cy='12' r='5'></circle>
        <line x1='12' y1='1' x2='12' y2='3'></line>
        <line x1='12' y1='21' x2='12' y2='23'></line>
        <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
        <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line>
        <line x1='1' y1='12' x2='3' y2='12'></line>
        <line x1='21' y1='12' x2='23' y2='12'></line>
        <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line>
        <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
      </svg>`

  const moonIcon = /*html*/ `
      <svg
        class="toggle-theme-icon"
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      >
        <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
      </svg>`

  return isDark ? sunIcon : moonIcon
}

window.addEventListener('scroll', () => {
  const backTopBtn = document.querySelector('.go-top-btn')

  if (window.scrollY >= 300) {
    backTopBtn.style.display = 'flex'
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0 })
    })
  } else backTopBtn.style.display = 'none'
})

document.querySelector('.main-nav') && handleToggle()
document.querySelector('.main-footer') && (await socialMediaView())
document.getElementById('content') && (await postView())
