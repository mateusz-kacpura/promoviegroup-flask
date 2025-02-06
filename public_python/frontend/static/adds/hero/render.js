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
    
    document.getElementById('damiangrabarski').innerHTML = generateDamianGrabarskiSectionHTML(date);
    // Po wstawieniu elementów do DOM dodajemy efekt 3D do kafelek

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
    
    add3DEffectToCards();

    // const clientsHTML = renderClientsSection(date)
    // renderClientsSection(date); // <div id="clients-section"></div> // brakuje prawdopodobnie jakiegoś skryptu bootrap
    // document.getElementById("clients-section").innerHTML = clientsHTML;    
}

// Funkcja dodająca efekt 3D do wszystkich kafelek z klasą "card"
function add3DEffectToCards() {
    // Pobranie wszystkich elementów z klasą "card"
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      // Po wejściu myszką – ustawienie płynnego przejścia
      card.addEventListener('mouseenter', function() {
        card.style.transition = 'transform 0.2s ease-out';
      });
  
      // Obsługa ruchu myszy nad kartą
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // pozycja kursora wewnątrz kafelki (oś X)
        const y = e.clientY - rect.top;  // pozycja kursora wewnątrz kafelki (oś Y)
  
        // Wyznaczenie środka elementu
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Obliczenie odchylenia względem środka (w skali od -1 do 1)
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // Ustalanie maksymalnych kątów obrotu (np. 15 stopni) oraz powiększenia (np. 1.1)
        const rotateX = deltaY * -15; // minus, aby efekt był bardziej naturalny
        const rotateY = deltaX * 15;
        const scale = 1.1;
        
        // Ustawienie transformacji – perspektywa, obrót oraz skalowanie
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      });
  
      // Przy opuszczaniu kafelki reset transformacji
      card.addEventListener('mouseleave', function() {
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }
  

function renderHeaderVideo(date) {
    if (typeof date === 'undefined' || !date.carouselItems) {
        console.error('Invalid data:', date);
        return '';
    }
    
    // Ustalamy, która wersja wideo ma zostać użyta w oparciu o szerokość okna
    const isDesktop = window.innerWidth >= 768; // próg można dostosować

    const carouselIndicators = date.carouselItems.map((item, index) => {
        return `<li data-mdb-target="#introCarousel" data-mdb-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>`;
    }).join('');

    const carouselItems = date.carouselItems.map((item, index) => {
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

// Funkcja generująca sekcję z filmografią Damiana Grabarskiego
function generateDamianGrabarskiSectionHTML(date) {
    // Używamy właściwości "photo" lub domyślnego obrazka
    const photoURL = date.membersTeamSection.members[3].imageURL;
    
    let html = `
      <section class="py-5 bg-light">
        <div class="container">
          <!-- Nagłówek z kartą prezentującą Damiana -->
          <div class="text-center mb-5">
  <div class="card shadow-sm" style="max-width: 400px; margin: 30px auto; border-top: 1px solid #ccc; border-left: 1px solid #ccc; border-right: 1px solid #ccc; border-bottom: none; border-radius: 10px 10px 0 0; overflow: hidden;">
    <div class="view overlay ripple" data-mdb-ripple-color="light">
      <img src="${photoURL}" class="card-img-top img-fluid" alt="${date.name} Photo"
           style="height: 400px; object-fit: cover; filter: brightness(1.1);">
      <a href="#!">
        <div class="mask" style="background-color: rgba(0, 0, 0, 0);"></div>
      </a>
    </div>
    <div class="card-body" style="position: relative; padding: 40px 15px 0 15px; background-color: #d3d3d3;">
      <h2 class="card-title fw-bold">${date.name}</h2>
    </div>
    <div style="line-height: 0;">
<svg viewBox="0 0 500 100" preserveAspectRatio="none" style="display: block; width: 100%; transform: rotate(180deg);">
  <path d="M0,30 C150,0 350,60 500,30 L500,100 L0,100 Z" style="fill: #d3d3d3;"></path>
</svg>

    </div>
  </div>
            <p class="lead text-muted animated fadeInUp mt-3">Profesjonalna filmografia</p>
          </div>
    `;
    
    // Przechodzimy przez kategorie filmografii
    const filmography = date.filmography;
    const categoryNames = {
      cinematography: 'Film fabularny / Krótkometrażowy',
      camera_operator: 'Operator kamery w produkcji serialowej',
      making_of: 'Making Of',
      additional_photography: 'Dodatkowe zdjęcia',
      acting: 'Aktorstwo'
    };
    
    Object.keys(filmography).forEach(category => {
      const items = filmography[category];
      const sectionTitle = categoryNames[category] || category;
    
      html += `
          <div class="mb-5">
            <h3 class="mb-4 animated fadeIn">${sectionTitle}</h3>
            <div class="row">
      `;
    
      // Każdy film jako oddzielna pionowa karta
      items.forEach(item => {
        html += `
            <div class="col-md-6 col-lg-4 mb-3">
              <div class="card shadow-sm animated fadeInUp" style="cursor: pointer;"
                   onclick="showFilmDetails(this)"
                   data-film-title="${item.title}"
                   data-film-year="${item.year}"
                   data-film-type="${item.type}"
                   data-film-description="${item.description ? item.description.replace(/"/g, '&quot;') : ''}"
                   data-film-poster="${item.poster ? item.poster : ''}"
                   data-film-page="${item.filmPage ? item.filmPage : ''}">
        `;
        if (item.poster) {
          html += `
                <div class="view overlay ripple" data-mdb-ripple-color="light">
                  <img src="${item.poster}" class="card-img-top img-fluid img-thumbnail hover-zoom" alt="${item.title} Poster"
                       style="height: 500px; object-fit: cover;">
                  <a href="#!">
                    <div class="mask" style="background-color: rgba(0, 0, 0, 0.15);"></div>
                  </a>
                </div>
          `;
        }
        html += `
                <div class="card-body">
                  <h5 class="card-title fw-bold">
                    ${item.title} <small class="text-muted">(${item.year})</small>
                  </h5>
                  <p class="card-text">${item.type}</p>
                </div>
              </div>
            </div>
        `;
      });
    
      html += `
            </div>
          </div>
      `;
    });
    
    html += `
        </div>
      </section>
    `;
    
    return html;
  }
    
  // Funkcja otwierająca modal z detalami filmu w stylu korporacyjnym
  function showFilmDetails(element) {
    const title = element.dataset.filmTitle;
    const year = element.dataset.filmYear;
    const type = element.dataset.filmType;
    const description = element.dataset.filmDescription;
    const poster = element.dataset.filmPoster;
    const filmPage = element.dataset.filmPage;
    
    // Ustawienie tytułu modalu z pogrubieniem
    document.getElementById('filmModalLabel').innerHTML = `<span class="fw-bold">${title} (${year})</span>`;
    const modalBody = document.getElementById('filmModalBody');
    let modalContent = '';
    
    if (poster) {
      modalContent += `
        <div class="view overlay mb-3 ripple" data-mdb-ripple-color="light">
          <img src="${poster}" alt="${title} Poster" class="img-fluid rounded"
               style="max-height: 300px; object-fit: cover;">
          <a href="#!">
            <div class="mask" style="background-color: rgba(0,0,0,0.1);"></div>
          </a>
        </div>
      `;
    }
    modalContent += `<p class="mb-2"><strong>Typ:</strong> ${type}</p>`;
    if (description) {
      modalContent += `<p class="mb-2">${description}</p>`;
    }
    if (filmPage) {
      modalContent += `<a href="${filmPage}" target="_blank" class="btn btn-outline-primary">Zobacz stronę filmu</a>`;
    }
    modalBody.innerHTML = modalContent;
    
    // Dodanie animacji wejścia do modalu (przy użyciu Animate.css)
    let filmModalEl = document.getElementById('filmModal');
    filmModalEl.querySelector('.modal-dialog').classList.add('animate__animated', 'animate__fadeInDown');
    
    // Wyświetlenie modalu przy użyciu Bootstrap
    let filmModal = new bootstrap.Modal(filmModalEl);
    filmModal.show();
  }
  
  
// Przykładowa funkcja generująca sekcję z członkami zespołu
function generateMembersTeamSectionHTML(date) {
    // Przyjmujemy, że w obiekcie date mamy sekcję membersTeamSection z odpowiednimi danymi
    let membersTeamSectionHTML = 
    `<div date-draggable="false" style="position: relative;">
        <section draggable="false" class="container card pt-5" date-v-271253ee="">
            <section class="mb-10 text-center">
                <h2 class="fw-bold mb-5">
                    <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">
                        ${date.membersTeamSection.teamTitle}
                    </span>
                    <u class="text-primary" date-builder-edit="text" date-builder-name="text2" contenteditable="false">
                        ${date.membersTeamSection.teamSubtitle}
                    </u>
                </h2>
                <!-- Opakowujemy karuzelę w kontenerze z overflow hidden -->
                <div id="teamList" class="row gx-lg-5">
                    <div id="carouselContainer" style="overflow: hidden; width: 100%;">
                        <div id="carouselWrapper" style="display: flex; gap: 15px; transition: transform 0.5s ease;">`;
    
    // Iteracja po członkach zespołu
    date.membersTeamSection.members.forEach((member, index) => {
        membersTeamSectionHTML += generateMemberCardHTML(member, index, date);
    });
    
    membersTeamSectionHTML += 
                        `</div>
                    </div>
                </div>
                <div id="memberDetails" class="member-details" style="display: none;">
                    <!-- Dynamicznie ładowana zawartość szczegółów -->
                </div>
            </section>
        </section>
    </div>`;
    
    return membersTeamSectionHTML;
}

// Przykładowa funkcja generująca kartę członka zespołu – możesz dostosować zawartość i klasy
function generateMemberCardHTML(member, index, date) {
    return `
      <div class="col-md-4 mb-3 animated fadeInUp">
        <div class="card shadow-sm" style="cursor: pointer;" onclick="showMemberDetails(${index})">
          <img src="${member.photo}" class="card-img-top" alt="${member.name} Photo">
          <div class="card-body text-center">
            <h5 class="card-title">${member.name}</h5>
            <p class="card-text">${member.role}</p>
          </div>
        </div>
      </div>
    `;
}

function generateMembersTeamSectionHTML(date) {
    // Zapamiętujemy przekazany obiekt date globalnie dla potrzeb karuzeli
    window.carouselData = date;

    let membersTeamSectionHTML = 
    `<div date-draggable="false" style="position: relative;">
        <section draggable="false" class="container pt-5" date-v-271253ee="">
            <section class="mb-10 text-center">
                <h2 class="fw-bold mb-5">
                    <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">${date.membersTeamSection.teamTitle}</span>
                    <u class="text-primary" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${date.membersTeamSection.teamSubtitle}</u>
                </h2>
                <!-- Opakowujemy karuzelę w kontenerze z overflow hidden -->
                <div id="teamList" class="row gx-lg-5">
                    <div id="carouselContainer" style="overflow: hidden; width: 100%;">
                        <div id="carouselWrapper" style="display: flex; gap: 15px; transition: transform 0.5s ease;">`;
    
    date.membersTeamSection.members.forEach((member, index) => {
        membersTeamSectionHTML += generateMemberCardHTML(member, index, date);
    });
    
    membersTeamSectionHTML += 
                        `</div>
                    </div>
                </div>
                <div id="memberDetails" class="member-details" style="display: none;">
                    <!-- Dynamicznie ładowana zawartość szczegółów -->
                </div>
            </section>
        </section>
    </div>`;
    
    // Po wyrenderowaniu HTML inicjujemy karuzelę – przyjmujemy, że elementy są już w DOM
    setTimeout(() => {
        initializeCarousel(date);
    }, 0);
    
    return membersTeamSectionHTML;
}

function generateMemberCardHTML(member, index, date) {
    let memberCardHTML = 
    `<div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
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
                <ul class="list-unstyled mb-0">`;
    
    member.socialIcons.forEach((icon, iconIndex) => {
        memberCardHTML += 
            `<a href="${member.socialLinks[iconIndex]}" class="px-1">
                <i class="${icon}" date-builder-edit="icon" aria-controls="#picker-editor"></i>
            </a>`;
    });
    
    memberCardHTML += 
                `</ul>
            </div>
        </div>
    </div>`;
    
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

    let detailsHTML = 
    `<div class="row">
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

    // Zatrzymujemy karuzelę, gdy otwarty jest panel szczegółów
    stopCarousel();
}

function hideMemberDetails() {
    document.getElementById('teamList').style.display = 'flex';
    document.getElementById('memberDetails').style.display = 'none';
    // Po zamknięciu panelu uruchamiamy karuzelę ponownie
    startCarousel();
}

function showPreviousMember(currentIndex, date) {
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    showMemberDetails(previousIndex, date);
}

function showNextMember(currentIndex, date) {
    const nextIndex = currentIndex < date.membersTeamSection.members.length - 1 ? currentIndex + 1 : currentIndex;
    showMemberDetails(nextIndex, date);
}

// -------------------------
// FUNKCJONALNOŚĆ KARUZELI
// -------------------------

let carouselInterval = null;
let touchStartX = 0;
let touchEndX = 0;

function startCarousel() {
    if (!carouselInterval) {
        carouselInterval = setInterval(() => {
            // Przesuwamy karuzelę tylko, gdy panel szczegółów jest ukryty
            if (document.getElementById('memberDetails').style.display === 'none') {
                slideNext();
            }
        }, 2000);
    }
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// Funkcja przesuwa karuzelę w lewo o szerokość jednego elementu + odstęp
function slideNext() {
    const wrapper = document.getElementById('carouselWrapper');
    if (!wrapper) return;
    const firstCard = wrapper.children[0];
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const cardGap = 15; // odstęp, musi być zgodny z wartością gap w stylu
    wrapper.style.transform = `translateX(-${cardWidth + cardGap}px)`;
    
    wrapper.addEventListener('transitionend', function handler() {
        // Po zakończeniu animacji przenosimy pierwszy element na koniec
        wrapper.appendChild(firstCard);
        wrapper.style.transition = 'none';
        wrapper.style.transform = 'translateX(0)';
        // Wymuszenie reflow
        void wrapper.offsetWidth;
        wrapper.style.transition = 'transform 0.5s ease';
        wrapper.removeEventListener('transitionend', handler);
    });
}

// Funkcja przesuwa karuzelę w prawo (używana przy swipe)
function slidePrev() {
    const wrapper = document.getElementById('carouselWrapper');
    if (!wrapper) return;
    const cards = wrapper.children;
    if (cards.length === 0) return;
    const lastCard = cards[cards.length - 1];
    const cardWidth = lastCard.offsetWidth;
    const cardGap = 15; // taki sam odstęp jak w slideNext
    
    // Przenosimy ostatni element na początek
    wrapper.insertBefore(lastCard, wrapper.firstChild);
    wrapper.style.transition = 'none';
    wrapper.style.transform = `translateX(-${cardWidth + cardGap}px)`;
    // Wymuszenie reflow
    void wrapper.offsetWidth;
    wrapper.style.transition = 'transform 0.5s ease';
    wrapper.style.transform = 'translateX(0)';
}

// Inicjalizacja karuzeli: ustawienie automatycznego przesuwania oraz obsługi dotyku
function initializeCarousel(date) {
    const carouselContainer = document.getElementById('carouselContainer');
    if (!carouselContainer) return;
    
    carouselContainer.addEventListener('touchstart', handleTouchStart, false);
    carouselContainer.addEventListener('touchmove', handleTouchMove, false);
    carouselContainer.addEventListener('touchend', handleTouchEnd, false);
    
    startCarousel();
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    const threshold = 50; // Minimalna odległość przesunięcia w px
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > threshold) {
        // Zatrzymujemy automatyczne przesuwanie podczas obsługi gestu
        stopCarousel();
        if (diff > 0) {
            // Swipe w lewo – przesuwamy do następnego
            slideNext();
        } else {
            // Swipe w prawo – przesuwamy do poprzedniego
            slidePrev();
        }
        // Po krótkim czasie restartujemy automatyczną karuzelę
        setTimeout(() => {
            startCarousel();
        }, 2000);
    }
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
    <style>
        /* Styl obrazu i transformacje */
        .partner-image {
            transition: transform 0.3s;
            /* Ustawienie perspektywy, by efekt 3D był bardziej zauważalny */
            transform: perspective(500px) var(--random-tilt, rotateX(0deg) rotateY(0deg));
        }
        /* Efekt falowania z uwzględnieniem losowego pochylania */
        .partner-image:hover {
            animation: wave 1.5s ease-in-out infinite;
        }
        @keyframes wave {
            0% { transform: perspective(500px) var(--random-tilt, rotateX(0deg) rotateY(0deg)) translateY(0); }
            50% { transform: perspective(500px) var(--random-tilt, rotateX(0deg) rotateY(0deg)) translateY(-10px); }
            100% { transform: perspective(500px) var(--random-tilt, rotateX(0deg) rotateY(0deg)) translateY(0); }
        }
    </style>
    <div date-draggable="false" style="position: relative;">
    <section draggable="false" class="container pt-5" date-v-271253ee="">
        <section class="mb-10 text-center">
            <h2 class="fw-bold mb-6">
                <span date-builder-edit="text" date-builder-name="text1" contenteditable="false">${date.partners.text1}</span>
                <u class="mx-2" date-builder-edit="text" date-builder-name="text2" contenteditable="false">${date.partners.text2}</u>
                <span date-builder-edit="text" date-builder-name="text3" contenteditable="false">${date.partners.text3}</span>
            </h2>
            <div class="row justify-content-center gx-5 gy-5"> <!-- Dodane odstępy -->
                ${date.partners.images.map((image, index) => `
                    <div class="card col-lg-3 col-6">
                        <img src="${image}" class="img-fluid p-3 partner-image" alt="" date-builder-edit="image" date-builder-name="image${index + 1}" aria-controls="#picker-editor">
                    </div>
                `).join('')}
            </div>
        </section>
    </section>
</div>

    <script>
        // Po załadowaniu dokumentu dodajemy nasłuchiwanie na zdarzenia dla każdego obrazka
        document.addEventListener("DOMContentLoaded", function() {
            const images = document.querySelectorAll('.partner-image');
            images.forEach(img => {
                img.addEventListener("mouseenter", () => {
                    // Generujemy losowe kąty obrotu dla osi X i Y w zakresie od -15 do 15 stopni
                    const rotateX = Math.floor(Math.random() * 31) - 15;
                    const rotateY = Math.floor(Math.random() * 31) - 15;
                    // Ustawiamy zmienną CSS --random-tilt, którą wykorzystujemy w transform
                    img.style.setProperty("--random-tilt", \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`);
                });
            });
        });
    </script>
    `;
}


function generateVideoHTML(date) {
    if (!date || !date.video || !date.video.images || !date.video.videos) {
        console.error('Invalid data for video rendering:', date);
        return '';
    }

    // Zapamiętujemy przekazany obiekt date globalnie dla potrzeb karuzeli
    window.videoCarouselData = date;

    let videoHTML = `
    <!-- Start your project here-->
    <div class="container mt-5">
        <!-- Video Carousel -->
        <section>
            <!-- Section: Videos -->
            <h2 class="fw-bold mb-5 text-center" data-builder-edit="text" data-builder-name="text1" contenteditable="false">Nasze filmy</h2>
            
            <!-- Carousel Container -->
            <div id="videoCarouselContainer" style="overflow: hidden; width: 100%;">
                <div id="videoCarouselWrapper" style="display: flex; transition: transform 0.5s ease;">
                    ${date.video.images.map((imageUrl, index) =>
                        generateVideoItemHTML(imageUrl, index)
                    ).join('')}
                </div>
            </div>
        </section>
        <!-- Video Carousel -->

        <!-- Section: Modals -->
        ${date.video.videos.map((videoUrl, index) =>
            generateVideoModalHTML(videoUrl, index)
        ).join('')}
        <!-- Section: Modals -->
    </div>
    <!-- End your project here-->`;

    // Inicjalizujemy karuzelę po wyrenderowaniu HTML
    setTimeout(() => {
        initializeVideoCarousel(date);
    }, 0);

    return videoHTML;
}

function generateVideoItemHTML(imageUrl, index) {
    return `
        <div class="video-item card rounded-4 m-3" style="flex-shrink: 0; border-radius: 20px; overflow: hidden;">
            <div class="bg-image hover-overlay ripple shadow-1-strong rounded-4" data-ripple-color="light" style="border-radius: 20px;">
                <img src="${imageUrl}" class="w-100" style="border-radius: 20px;"/>
                <a href="#!" data-mdb-toggle="modal" data-mdb-target="#exampleModal${index + 1}">
                    <div class="mask rounded-4" style="background-color: rgba(251, 251, 251, 0.2); border-radius: 20px;"></div>
                </a>
            </div>
        </div>
    `;
}


function generateVideoModalHTML(videoUrl, index) {
    return `
        <!-- Modal ${index + 1} -->
        <div class="modal fade" id="exampleModal${index + 1}" tabindex="-1" aria-labelledby="exampleModal${index + 1}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="ratio ratio-16x9">
                        <iframe src="${videoUrl}" title="YouTube video" allowfullscreen></iframe>
                    </div>
                    <div class="text-center py-3">
                        <button type="button" class="btn btn-primary" data-mdb-dismiss="modal">Zamknij</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeVideoCarousel(date) {
    const carouselContainer = document.getElementById('videoCarouselContainer');
    const carouselWrapper = document.getElementById('videoCarouselWrapper');
    const videoItems = document.getElementsByClassName('video-item');
    let currentIndex = 0;
    let itemWidth;

    function updateItemWidth() {
        const containerWidth = carouselContainer.offsetWidth;
        if (window.innerWidth >= 992) {
            // Widok desktopowy
            itemWidth = containerWidth / 3;
        } else {
            // Widok mobilny
            itemWidth = containerWidth;
        }
        // Ustawiamy szerokość każdego elementu
        for (let i = 0; i < videoItems.length; i++) {
            videoItems[i].style.width = itemWidth + 'px';
        }
        // Aktualizujemy pozycję karuzeli
        carouselWrapper.style.transform = 'translateX(-' + (itemWidth * currentIndex) + 'px)';
    }

    // Inicjalizujemy szerokość elementów
    updateItemWidth();

    // Obsługa zmiany rozmiaru okna
    window.addEventListener('resize', updateItemWidth);

    function shiftCarousel() {
        currentIndex++;
        if (currentIndex > videoItems.length - (window.innerWidth >= 992 ? 3 : 1)) {
            currentIndex = 0;
        }
        carouselWrapper.style.transform = 'translateX(-' + (itemWidth * currentIndex) + 'px)';
    }

    // Uruchamiamy automatyczne przesuwanie
    let shiftInterval = setInterval(shiftCarousel, 2000);

    // Opcjonalnie: zatrzymanie karuzeli po najechaniu myszą
    carouselContainer.addEventListener('mouseenter', function() {
        clearInterval(shiftInterval);
    });

    carouselContainer.addEventListener('mouseleave', function() {
        shiftInterval = setInterval(shiftCarousel, 2000);
    });
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

