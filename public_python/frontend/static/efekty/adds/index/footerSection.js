var data = {
    nav: {
            menu: "#menuContainer",
            items: [
                { text: "O nas", href: "/o-nas" },
                { text: "Oferta", href: "/oferta" },
                { text: "Galeria", href: "/galeria" },
                { text: "Opinie", href: "/opinie" }
            ],
            button: "kontakt"
        },
    footer: {
        tittle1: "O nas",
        tittle2: "Kontakt z nami", 
        tittle3: "Nawigacja",
        about: "ProMovieGroup to grupa zajmująca się fotografią, produkcją filmową i transmisjami na strony internetowe. Zaufali nam już liczni klienci. Obsługujemy medialnie największą w Polsce imprezę sportową kobiet.",
        socialLinks: [
        { platform: "Facebook", link: "#" },
        { platform: "Twitter", link: "#" },
        { platform: "Instagram", link: "#" },
        { platform: "Dribbble", link: "#" },
        { platform: "LinkedIn", link: "#" }
        ],
        navigation: [
        { name: "Strona główna", link: "o-nas" },
        { name: "O nas", link: "o-nas" },
        { name: "Wsparcie", link: "wsparcie" },
        { name: "Oferta", link: "oferta" },
        { name: "Galeria", link: "galeria" },
        { name: "Polityka prywatności", link: "#" },
        { name: "Opinie", link: "opinie" },
        { name: "Kontakt", link: "kontakt" },
        { name: "FAQ", link: "faq" },
        ],
        copyright: "Copyright © " + new Date().getFullYear(),
        designer: { name: "ProMovieGroup", link: "#" }
    }
};

// Generowanie HTML dla navbara na podstawie danych JSON
function generateNavbar(data) {
            return `
            <nav id="menuContainer" class="navbar navbar-expand-lg navbar-light bg-white shadow-2 px-4">
                <a class="navbar-brand" href="/o-nas" draggable="false">
                    <img src="logo.svg" height="16" alt="Logo" loading="lazy" style="margin-top: -1px" data-builder-edit="image" data-builder-name="image1" aria-controls="#picker-editor" draggable="false">
                </a>
                <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarButtonsExample" aria-controls="navbarButtonsExample" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse justify-content-center" id="navbarButtonsExample">
                <ul id="menuItems" class="navbar-nav me-auto mb-lg-0">
                                        ${generateMenuItems(data.nav.items)}
                    </ul>
                    <div class="text-center"> <!-- Centrowanie przycisku -->
                        <button type="button"  href="/kontakt" class="btn btn-primary btn-rounded"  data-builder-edit="button" data-builder-name="button1" aria-controls="#picker-editor" onclick="window.location.href='/kontakt'">${data.nav.button}</button>
                    </div>
            </nav>
            `;
        }

// Generowanie HTML dla elementów menu na podstawie danych JSON
function generateMenuItems(items) {
    return items.map(item => `<li class="nav-item text-center " style="font-family: 'Chakra Petch', sans-serif; font-size: 20px">
                                    <a class="nav-link" href="${item.href}">${item.text}</a>
                                </li>`).join('');
}

// Wstawienie wygenerowanego navbara do kontenera
document.getElementById('navbarContainer').innerHTML = generateNavbar(data);



// Funkcja do renderowania sekcji Stopki zgodnie z MDB
function renderFooterSection(data) {
var footerSection = document.getElementById('footer-section');
footerSection.innerHTML = `
    <div class="site-footer" style="padding: 30px 0; background-color: #f8f9fa; color: #6c757d;">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-lg-4">
                    <div class="widget">
                        <h3>${data.footer.tittle1}</h3>
                        <p>${data.footer.about}</p>
                    </div>
                    <div class="widget">
                        <h3>${data.footer.tittle2}</h3>
                        <ul class="social list-unstyled d-flex justify-content-between">
                            ${data.footer.socialLinks.map(link => `<li><a href="${link.link}" style="color: #6c757d;"><i class="fab fa-${link.platform.toLowerCase()}"></i></a></li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-12">
                            <div class="widget">
                                <h3>${data.footer.tittle3}</h3>
                            </div>
                        </div>
                        ${data.footer.navigation.map(nav => `
                        <div class="col-6 col-sm-6 col-md-4">
                            <div class="widget">
                                <ul class="links list-unstyled">
                                    <li><a href="${nav.link}" style="color: #6c757d;">${nav.name}</a></li>
                                </ul>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="row justify-content-center text-center copyright" style="margin-top: 50px; font-size: 14px;">
                <div class="col-md-8">
                    <p>${data.footer.copyright}</p>
                    <p>Designed by <a href="${data.footer.designer.link}" style="color: #6c757d;">${data.footer.designer.name}</a></p>
                </div>
            </div>
        </div>
    </div>
`;
}
renderFooterSection(data);