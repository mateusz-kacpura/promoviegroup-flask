// Define global variables
var SERVER = "http://127.0.0.1"; // Add HTTP protocol
var PATH = SERVER + '/efekty/adds/workers/';
var PHOTOS = SERVER + '/efekty/adds/workers/img/'

const recipesData = [
    {
        imgSrc: PHOTOS + "433061866_1140234047108452_4872021976055656571_n.jpg",
        title: "Operator",
        author: "Grzegorz"
    },
    {
        imgSrc: PHOTOS + "433067033_2737889969692596_8248258868955805753_n.jpg",
        title: "Montażystka",
        author: "Justyna"
    },
    {
        imgSrc: PHOTOS + "435516323_1547186842494005_8099306880215657994_n.jpg",
        title: "Fotograf",
        author: "Mateusz"
    }
];

async function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

async function loadJS(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

async function loadAssets() {
    const paths = [
        'workers.css',
        'workers.js'
    ];

    await Promise.all(paths.map(path => {
        if (path.startsWith('http')) {
            // Jeśli ścieżka zaczyna się od "http", sprawdzamy rozszerzenie pliku
            if (path.endsWith('.css')) {
                return loadCSS(path);
            } else if (path.endsWith('.js')) {
                return loadJS(path);
            }
        } else if (path.endsWith('.css')) {
            return loadCSS(PATH + path);
        } else if (path.endsWith('.js')) {
            return loadJS(PATH + path);
        }
    }));
}

// Call the function to load assets
loadAssets().then(() => {
    // Call the function to generate recipes after assets are loaded
    generateRecipes();
});


// Function to generate recipes asynchronously
async function generateRecipes() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    recipesData.forEach((recipe, index) => {
        setTimeout(() => {
            const swiperSlide = document.createElement('div');
            swiperSlide.classList.add('swiper-slide', 'post', 'new-post');
    
            swiperSlide.innerHTML = `
                <img class="post-img" src="${recipe.imgSrc}" alt="recipe" />
                <div class="post-body">
                    <img class="post-avatar" src="${PHOTOS}user.png" alt="avatar" />
                    <div class="post-detail">
                        <h2 class="post-name barlow-condensed-thin">${recipe.title}</h2>
                        <p class="post-author barlow-condensed-thin">${recipe.author}</p>
                    </div>
                    <div class="post-actions">
                        <a class="post-like" href="javascript:void(0)">
                            <i class="fas fa-heart"></i>
                        </a>
                        <button class="post-actions-controller" data-target="post${index + 1}" aria-controls="post-actions-content" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis fa-2xl"></i>
                        </button>
                        <div class="post-actions-content" id="post${index + 1}" data-visible="false" aria-hidden="true">
                            <ul role="list" data-spacing="small">
                                <li>
                                    <a class="post-actions-link" href="javascript:void(0)">
                                        <i class="fa-solid fa-folder-open"></i>
                                        <span>Add to Collection</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="post-actions-link" href="javascript:void(0)">
                                        <i class="fa-solid fa-eye"></i>
                                        <span>Show the Recipe</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="post-actions-link" href="javascript:void(0)">
                                        <i class="fa-solid fa-user-plus"></i>
                                        <span>Follow the User</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
    
            swiperWrapper.appendChild(swiperSlide);

            // Dodaj klasę dla animacji nowych postów
            swiperSlide.classList.add('slideInRightAnimation');
    
            // Usuń klasę po zakończeniu animacji
            swiperSlide.addEventListener('animationend', function() {
                swiperSlide.classList.remove('slideInRightAnimation');
            });

             // Dodaj obsługę tooltipów
             const tooltipLinks = swiperSlide.querySelectorAll('.post-actions-link');
             tooltipLinks.forEach(link => {
                 link.addEventListener('mouseover', function() {
                     const tooltip = this.querySelector('span');
                     tooltip.style.display = 'block';
                 });
                 link.addEventListener('mouseout', function() {
                     const tooltip = this.querySelector('span');
                     tooltip.style.display = 'none';
                 });
             });
    
        });
    });
};


