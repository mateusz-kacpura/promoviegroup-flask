document.addEventListener('DOMContentLoaded', function() {
    // Nazwa pliku JSON, który chcesz załadować
    const fileName = 'hero.json'; // Możesz tutaj ustawić dynamiczną nazwę pliku, jeśli to potrzebne

    // Pobierz dane z serwera
    fetch(`/get-json?file=${fileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            // Przypisz dane do zmiennej lokalnej
            const date = jsonData;
            console.log('Dane wczytane:', date);

            // Wywołaj funkcje renderujące HTML po załadowaniu danych
            renderContent(date);
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
});

function renderContent(date) {
    document.getElementById('carouselContainer').innerHTML = renderHeaderVideo(date); 

    // Wstawienie wygenerowanego HTML do diva o id "mainSection"
    // const mainSectionHTML = generateMainSectionHTML(date);
    // document.getElementById("mainSection").innerHTML = mainSectionHTML;
    
    // Wstawienie wygenerowanego HTML do diva o id "membersTeamSection"
    document.getElementById('teamSection').innerHTML = generateMembersTeamSectionHTML(date);
    
    // Wstawienie wygenerowanego HTML do diva o id "jumbotronSection"
    const jumbotronSectionHTML = generateJumbotronSectionHTML(date);
    // document.getElementById("jumbotronSection").innerHTML = jumbotronSectionHTML;
    
    // Wstawienie wygenerowanego HTML do diva o id "latestArticles"
    const latestArticlesHTML = generateLatestArticlesHTML(date);
    // document.getElementById("latestArticles").innerHTML = latestArticlesHTML;
    
    // Wstawienie wygenerowanego HTML do diva o id "adventure"
    const adventuresHTML = generateAdventuresHTML(date);
    document.getElementById("adventure").innerHTML = adventuresHTML;
    
    // Wstawienie wygenerowanego HTML do diva o id "partners"
    const partnersHTML = generatePartnersHTML(date);
    document.getElementById("partners").innerHTML = partnersHTML;
    
    // Wstawienie wygenerowanego HTML do diva o id "video"
    const videoHTML = generateVideoHTML(date);
    document.getElementById("video").innerHTML = videoHTML; 
    
    // const clientsHTML = renderClientsSection(date)
    // renderClientsSection(date); // <div id="clients-section"></div> // brakuje prawdopodobnie jakiegoś skryptu bootrap
    // document.getElementById("clients-section").innerHTML = clientsHTML;    
}


function renderHeaderVideo(data) {
    if (typeof data === 'undefined' || !data.carouselItems) {
        console.error('Invalid data:', data);
        return '';
    }
    
    // Ustalamy, która wersja wideo ma zostać użyta w oparciu o szerokość okna
    const isDesktop = window.innerWidth >= 768; // próg można dostosować

    const carouselIndicators = data.carouselItems.map((item, index) => {
        return `<li data-mdb-target="#introCarousel" data-mdb-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>`;
    }).join('');

    const carouselItems = data.carouselItems.map((item, index) => {
        const buttons = item.buttons ? item.buttons.map(button => {
            return `<a class="btn ${button.class} btn-lg m-2" href="${button.url}" target="_blank" role="button">${button.text}</a>`;
        }).join('') : '';

        const heading = item.heading ? `<h1 class="heading d-none d-md-block">${item.heading}</h1>` : '';
        const subheading = item.subheading ? `<h5 class="subheading d-none d-md-block">${item.subheading}</h5>` : '';
        const headingMobile = item.heading ? `<h1 class="heading-mobile d-md-none">${item.heading}</h1>` : '';
        const subheadingMobile = item.subheading ? `<h5 class="subheading-mobile d-md-none">${item.subheading}</h5>` : '';

        // Dla pierwszego slajdu ustawiamy preload "auto", dla kolejnych "none"
        const preloadAttr = index === 0 ? 'auto' : 'none';

        // Generujemy tylko ten element <video>, który jest potrzebny na danym urządzeniu
        let videoMarkup = '';
        if (isDesktop) {
            videoMarkup = `
                <video class="video-desktop" preload="${preloadAttr}" style="min-width: 100%; min-height: 100%;" playsinline autoplay muted loop>
                    <source src="${item.videoSrc}" type="video/mp4" />
                </video>
            `;
        } else {
            videoMarkup = `
                <video class="video-mobile" preload="${preloadAttr}" style="min-width: 100%; min-height: 100%;" playsinline autoplay muted loop>
                    <source src="${item.videoMobileSrc}" type="video/mp4" />
                </video>
            `;
        }

        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="video-container mt-5 mt-md-3 position-relative">
                    ${videoMarkup}
                    <!-- Dodatkowa warstwa z kropkowaniem i licznikami -->
                    <div class="additional-overlay position-absolute top-0 start-0 w-100 h-100" style="pointer-events: none;">
                        <!-- Kropkowanie -->
                        <div class="dots-overlay" style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
                            background-size: 10px 10px;
                        "></div>
                        
                    </div>
                </div>
                <div class="mask d-flex justify-content-center align-items-center">
                    <!-- Warstwy tekstowe dostosowane do urządzeń mobilnych i desktop -->
                    <div class="text-white text-center p-4 mobile-overlay d-md-none" style="background: rgba(255, 255, 255, 0.7); max-width: 90%; margin: auto;">
                        ${headingMobile}
                        ${subheadingMobile}
                        ${buttons}
                    </div>
                    <div class="text-white text-center p-4 desktop-overlay d-none d-md-block" style="background: rgba(255, 255, 255, 0.7); max-width: 60%; margin: auto;">
                        ${heading}
                        ${subheading}
                        ${buttons}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div id="introCarousel" class="carousel slide carousel-fade shadow-2-strong" data-mdb-ride="carousel">
            <ol class="carousel-indicators">
                ${carouselIndicators}
            </ol>
            <div class="carousel-inner">
                ${carouselItems}
            </div>
            <a class="carousel-control-prev" href="#introCarousel" role="button" data-mdb-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#introCarousel" role="button" data-mdb-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    `;
}


// document.addEventListener('DOMContentLoaded', function() {
//     // Pobierz przycisk
//     var button = document.querySelector('[id="telefon"]');
//     // Ustaw zdarzenie na kliknięcie przycisku
//     button.addEventListener('click', function() {
//         // Ustaw numer telefonu
//         var phoneNumber = "567 874 992"; /* date.mainSection.phoneNumber ;  */
//         // Wstaw numer telefonu wewnątrz przycisku
//         button.textContent = phoneNumber;
        
//         // Po 5 sekundach przywróć oryginalny tekst przycisku
//         setTimeout(function() {
//             button.textContent = date.mainSection.button1Text;
//         }, 5000);
//     });
// });

function generateMainSectionHTML(date) {
    return `
    <div date-draggable="false" style="position: relative;">
        <section draggable="false" class="overflow-hidden pt-0" date-v-271253ee="">
            <section class="mb-10">
                <!-- Background image -->
                <div class="p-5 text-center bg-image" style="background-image: url('${date.mainSection.backgroundURL}'); height: 500px; background-size: cover; background-position: 50% 50%; background-color: rgba(0, 0, 0, 0);" date-builder-edit="background" date-builder-name="background1" aria-controls="#picker-editor"></div>
                <!-- Background image -->
                <div class="container">
                    <div class="card mx-4 mx-md-5 text-center shadow-5-strong" style=" margin-top: -170px; background: hsla(0, 0%, 100%, 0.7); backdrop-filter: blur(30px); ">
                        <div class="card-body px-4 py-5 px-md-5">
                            <h1 class="display-3 fw-bold ls-tight mb-4">
                                <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">${date.mainSection.title1}</span>
                                <br>
                                <span class="text-primary" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${date.mainSection.title2}</span>
                            </h1>
                            <a class="btn btn-primary btn-lg py-3 px-5 mb-2 mb-md-0 me-md-2" id="telefon" role="button" date-builder-edit="button" date-builder-name="button1" aria-controls="#picker-editor">${date.mainSection.button1Text}</a>
                            <a class="btn btn-link btn-lg py-3 px-5 mb-2 mb-md-0" date-ripple-color="primary" href="oferta" role="button" date-builder-edit="button" date-builder-name="button2" aria-controls="#picker-editor">${date.mainSection.button2Text}</a>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    </div>
    `;
}

function generateMembersTeamSectionHTML(date) {
    let membersTeamSectionHTML = `
    <div date-draggable="false" style="position: relative;">
        <section draggable="false" class="container pt-5" date-v-271253ee="">
            <section class="mb-10 text-center">
                <h2 class="fw-bold mb-5">
                    <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">${date.membersTeamSection.teamTitle}</span>
                    <u class="text-primary" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${date.membersTeamSection.teamSubtitle}</u>
                </h2>
                <div id="teamList" class="row gx-lg-5">
    `;
    
    date.membersTeamSection.members.forEach((member, index) => {
        membersTeamSectionHTML += generateMemberCardHTML(member, index, date);
    });
    
    membersTeamSectionHTML += `
                </div>
                <div id="memberDetails" class="member-details" style="display: none;">
                    <!-- Dynamic content for details will be injected here -->
                </div>
            </section>
        </section>
    </div>
    `;
    
    return membersTeamSectionHTML;
}

function generateMemberCardHTML(member, index, date) {
    let memberCardHTML = `
        <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
            <div class="card">
                <div class="bg-image hover-overlay ripple" date-ripple-color="light">
                    <img src="${member.imageURL}" class="w-100" date-builder-edit="image" date-builder-name="image1" alt="${member.name}" aria-controls="#picker-editor" onclick="try { showMemberDetails(${index}, ${JSON.stringify(date).replace(/"/g, '&quot;')}) } catch(err) { console.error('Error:', err); }">
                    <svg class="position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="left: 0; bottom: 0">
                        <path fill="#fff" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                <div class="card-body">
                    <h5 class="fw-bold" date-builder-edit="text" date-builder-name="text3" contenteditable="false" onclick="try { showMemberDetails(${index}, ${JSON.stringify(date).replace(/"/g, '&quot;')}) } catch(err) { console.error('Error:', err); }">${member.name}</h5>
                    <p class="text-muted" date-builder-edit="text" date-builder-name="text4" contenteditable="false">${member.role}</p>
                    <ul class="list-unstyled mb-0">
    `;
    
    member.socialIcons.forEach((icon, iconIndex) => {
        memberCardHTML += `
            <a href="${member.socialLinks[iconIndex]}" class="px-1">
                <i class="${icon}" date-builder-edit="icon" aria-controls="#picker-editor"></i>
            </a>
        `;
    });
    
    memberCardHTML += `
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    return memberCardHTML;
}


function showMemberDetails(index, date) {
    const member = date.membersTeamSection.members[index];
    if (!member) {
        console.error('Nie można znaleźć członka z indeksem:', index);
        return;
    }

    let biography = member.details.biography || 'Brak informacji';
    let experience = member.details.expirience || 'Brak informacji';
    let techniques = member.details.techniques || 'Brak informacji';
    let projects = member.details.projects || 'Brak informacji';

    let techniquesHTML = techniques ? `<ul>${techniques.split(',').map(technique => `<li>${technique.trim()}</li>`).join('')}</ul>` : '<p>Brak informacji</p>';
    let projectsHTML = projects ? `<ul>${projects.split(',').map(project => `<li>${project.trim()}</li>`).join('')}</ul>` : '<p>Brak informacji</p>';

    let detailsHTML = `
    <div class="row">
        <div class="col-md-4">
            <img src="${member.imageURL}" alt="${member.name}" class="img-fluid mb-3">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
            <div class="navigation-buttons mt-3">
                <button class="btn btn-primary me-2" onclick='showPreviousMember(${index}, ${JSON.stringify(date)})'>Poprzedni</button>
                <button class="btn btn-primary" onclick='showNextMember(${index}, ${JSON.stringify(date)})'>Następny</button>
            </div>
        </div>
        <div class="col-md-8">
            <button class="btn btn-secondary mb-3 mt-3 float-end" onclick="hideMemberDetails()">&#10005; Wróć do listy członków</button>
            <div style="clear: both;"></div>
            <div class="details-content text-start">
                <h4>Biografia</h4>
                <p>${biography}</p>
                <h4>Doświadczenie</h4>
                <p>${experience}</p>
                <h4>Techniki</h4>
                ${techniquesHTML}
                <h4>Projekty</h4>
                ${projectsHTML}
            </div>
        </div>
    </div>`;

    document.getElementById('teamList').style.display = 'none';
    const memberDetails = document.getElementById('memberDetails');
    if (!memberDetails) {
        console.error('Nie można znaleźć elementu z id "memberDetails"');
        return;
    }
    memberDetails.innerHTML = detailsHTML;
    memberDetails.style.display = 'block';
}

function hideMemberDetails() {
    document.getElementById('teamList').style.display = 'flex';
    document.getElementById('memberDetails').style.display = 'none';
}

function showPreviousMember(currentIndex, date) {
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    showMemberDetails(previousIndex, date);
}

function showNextMember(currentIndex, date) {
    const nextIndex = currentIndex < date.membersTeamSection.members.length - 1 ? currentIndex + 1 : currentIndex;
    showMemberDetails(nextIndex, date);
}

function generateJumbotronSectionHTML(date) {
    return `
    <div class="container py-5">
        <div class="row align-items-center">
            <div class="col-lg-6 mb-5 mb-lg-0">
                <div class="card cascading-right text-center bg-white bg-opacity-50 backdrop-blur shadow-lg">
                    <div class="card-body px-4 pb-5 pt-md-0 px-md-5 ">
                        <h1 class="my-5 display-4 fw-bold ls-tight">
                            <span>${date.jumbotron.title1}</span>
                            <br>
                            <span class="text-primary">${date.jumbotron.title2}</span>
                        </h1>
                        <a class="btn btn-primary btn-lg py-3 px-5 mb-2 mb-md-0 me-md-2" href="kontakt" role="button">${date.jumbotron.button1Text}</a>
                        <a class="btn btn-link btn-lg py-3 px-5" href="oferta" role="button">${date.jumbotron.button2Text}</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-5 mb-lg-0">
                <img src="${date.jumbotron.imageURL}" class="w-100 rounded-4 shadow-4" alt="">
            </div>
        </div>
    </div>
    `;
}

function generateLatestArticlesHTML(date) {
    let latestArticlesHTML = `
    <div date-draggable="false" style="position: relative;">
        <section draggable="false" class="container pt-5" date-v-271253ee="">
            <section class="mb-10">
                <h2 class="fw-bold mb-5 text-center" date-builder-edit="text" date-builder-name="text1" contenteditable="false">Najnowsze artykuły</h2>
    `;

    date.latestArticles.forEach(article => {
        latestArticlesHTML += `
            <div class="row gx-lg-5 mb-5 align-items-center">
                <div class="col-md-6 mb-4 mb-md-0">
                    <img src="${article.imageURL}" class="w-100 shadow-4-strong rounded-4 mb-4" alt="" date-builder-edit="image" date-builder-name="image1" aria-controls="#picker-editor">
                </div>
                <div class="col-md-6 mb-4 mb-md-0">
                    <h3 class="fw-bold" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${article.title}</h3>
                    <div class="mb-2 text-danger small">
                        <i class="fas fa-money-bill me-2" date-builder-edit="icon" date-builder-name="icon1" aria-controls="#picker-editor"></i>
                        <span date-builder-edit="text" date-builder-name="text3" contenteditable="false">${article.category}</span>
                    </div>
                    <p class="text-muted" date-builder-edit="text" date-builder-name="text4" contenteditable="false">${article.description1}</p>
                    <p class="text-muted" date-builder-edit="text" date-builder-name="text5" contenteditable="false">${article.description2}</p>
                    <a class="btn  btn-primary" href="#" role="button" date-builder-edit="button" date-builder-name="button1" aria-controls="#picker-editor">Read more</a>
                </div>
            </div>
        `;
    });

    latestArticlesHTML += `
            </section>
        </section>
    </div>
    `;
    
    return latestArticlesHTML;
}


function generateAdventuresHTML(date) {
    return `
    <div date-draggable="false" style="position: relative;">
        <section draggable="false" class="container pt-5" date-v-271253ee="">
            <section class="mb-10 text-center">
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <h2 class="mb-4 display-3 fw-bold ls-tight">
                            <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">${date.adventure.title1}</span>
                            <br>
                            <span class="text-primary" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${date.adventure.title2}</span>
                        </h2>
                        <p class="text-muted lead" date-builder-edit="text" date-builder-name="text3" contenteditable="false">${date.adventure.description}</p>
                        <a class="btn btn-primary btn-lg py-3 px-5 mb-2 mb-md-0 me-md-2" id="telefon" role="button" date-builder-edit="button" date-builder-name="button1" href="kontakt" aria-controls="#picker-editor">${date.jumbotron.button1Text}</a>
                    </div>
                </div>
            </section>
        </section>
    </div>
    `;
}

function generatePartnersHTML(date) {
    return `
    <div date-draggable="false" style="position: relative;">
        <section draggable="false" class="container pt-5" date-v-271253ee="">
            <section class="mb-10 text-center">
                <h2 class="fw-bold mb-6">
                    <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">${date.partners.text1}</span>
                    <u class="mx-2" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${date.partners.text2}</u>
                    <span date-builder-edit="text" date-builder-name="text3" contenteditable="false">${date.partners.text3}</span>
                </h2>
                <div class="row">
                    ${date.partners.images.map((image, index) => `
                        <div class="col-lg-3 col-6 mb-5 mb-lg-0">
                            <img src="${image}" class="img-fluid px-4 px-md-5" alt="" date-builder-edit="image" date-builder-name="image${index + 1}" aria-controls="#picker-editor">
                        </div>
                    `).join('')}
                </div>
            </section>
        </section>
    </div>
    `;
}

function generateVideoHTML(date) {
    if (!date || !date.video || !date.video.images || !date.video.videos) {
        console.error('Invalid data for video rendering:', date);
        return '';
    }

    return `
    <!-- Start your project here-->
    <div class="container d-flex justify-content-center mt-5">
        <!-- Modal gallery -->
        <section class="">
            <!-- Section: Images -->
            <section class="">
                <h2 class="fw-bold mb-5 text-center" data-builder-edit="text" data-builder-name="text1" contenteditable="false">Nasze filmy</h2>
                <div class="row">
                    ${date.video.images.map((imageUrl, index) => `
                        <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
                            <div class="bg-image hover-overlay ripple shadow-1-strong rounded" data-ripple-color="light">
                                <img src="${imageUrl}" class="w-100"/>
                                <a href="#!" data-mdb-toggle="modal" data-mdb-target="#exampleModal${index + 1}">
                                    <div class="mask" style="background-color: rgba(251, 251, 251, 0.2);"></div>
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- Section: Images -->

            <!-- Section: Modals -->
            <section class="">
                ${date.video.videos.map((videoUrl, index) => `
                    <!-- Modal ${index + 1} -->
                    <div class="modal fade" id="exampleModal${index + 1}" tabindex="-1" aria-labelledby="exampleModal${index + 1}Label" aria-hidden="false">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="ratio ratio-16x9">
                                    <iframe src="${videoUrl}" title="YouTube video" allowfullscreen></iframe>
                                </div>
                                <div class="text-center py-3">
                                    <button type="button" class="btn btn-primary" data-mdb-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </section>
            <!-- Section: Modals -->
        </section>
        <!-- Modal gallery -->
    </div>
    <!-- End your project here-->
    `;
}



function renderClientsSection(date) {
    var clientsSection = document.getElementById('clients-section');
    var clientsHTML = `
      <div class="site-section bg-light">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <h4 class="font-weight-bold">Nasi partnerzy</h4>
            </div>
          </div>

          <div class="owl-logos owl-carousel">
    `;
    
    // Dodanie logo klientów do sekcji
    date.forEach(function(client) {
      clientsHTML += `
        <div class="item">
          <img src="${client}" alt="Image" class="img-fluid">
        </div>
      `;
    });

    clientsHTML += `
          </div>
        </div>
      </div>
    `;
    clientsSection.innerHTML = clientsHTML;
}

