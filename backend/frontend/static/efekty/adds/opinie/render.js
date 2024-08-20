 // Dane w formacie JSON
 var data = {
    hero: {
      backgroundImage: "efekty/adds/opinie/images/DSC05482-1-2.jpg",
      title: "Oferta Usług Fotograficznych, Filmowych, Dronowych i Transmisji na Stronę Internetową",
      description: "Nasz zespół oferuje kompleksowe usługi w zakresie fotografii, filmowania, dronów oraz transmisji na stronę internetową. Jesteśmy gotowi uchwycić najważniejsze chwile i dostarczyć wyjątkowe treści wizualne dla Państwa."
    },
    about: {
      title: "Odkryj wyjątkowy świat fotografii i filmu",
      description: "Wejdź w świat magii i emocji, jaką oferuje fotografia i film. Nasze projekty przeniosą Cię w niezwykłe podróże, gdzie każde zdjęcie opowiada własną historię.",
      buttonText: "Zamów u nas film",
      image1: "efekty/adds/opinie/images/431220026_930507098566627_1926631657014937817_n.jpg",
      image2: "efekty/adds/opinie/images/433112654_1562209211229027_546412977909240967_n.jpg"
    },
    clients: [
      "efekty/adds/hero/assets/loga/294797940_479086210808504_8667669129994940009_n.png",
      "efekty/adds/hero/assets/loga/1706801724412.jpg",
      "efekty/adds/hero/assets/loga/1706801724426.jpg",
      "efekty/adds/hero/assets/loga/da635a33-ac6f-4f65-b6eb-fee731bbd382_kopia.jpg",
      "efekty/adds/hero/assets/loga/Logo Fundacja (1).png"
    ],
    testimonials: [
      {
        photo: "efekty/adds/opinie/images/klienci/pawelmiszczynski.jpg",
        author: "Paweł Miszczynski",
        occupation: "Chiropraktyk i Fizjoterapeuta",
        quote: "Współpraca z Pro Movie Group okazała się niezwykle satysfakcjonująca. Ich profesjonalizm oraz umiejętność realizacji projektów video przekroczyły moje oczekiwania. Od pierwszego kontaktu do końcowego montażu, cały proces przebiegał sprawnie i efektywnie. Firma wykazała się zrozumieniem naszych potrzeb oraz dostosowaniem się do harmonogramu pracy. Efekty ich pracy były imponujące i zdecydowanie poleciłbym ich usługi wszystkim poszukującym wysokiej jakości produkcji video.",
        social: {
          facebook: "https://www.facebook.com/pawel.miszczynski",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com"
        }
      },
      {
        photo: "efekty/adds/opinie/images/klienci/jakubwitek.jpg",
        author: "Jakub Witek",
        occupation: "Prezes Zarządu Orły Polska Fundacja Promocji i Wspierania Sportu",
        quote: "Realizacje materiałów wideo z organizowanych przez nas wydarzeń od lat powierzamy Pro Movie Group. To projekt złożony z profesjonalistów, którzy, doskonale radząc sobie z uwiecznianiem tego co dla naszej fundacji najważniejsze i czym później możemy się dzielić z naszymi odbiorcami. Serdecznie polecam.",
        social: {
          facebook: "https://facebook.com/JakubWitekPL",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com"
        }
      },
      {
        photo: "efekty/adds/opinie/images/klienci/aniagacek.jpg",
        author: "Ania Gacek",
        occupation: "Klient",
        quote: "Chcielibyśmy serdecznie polecić firmę Pana Grzegorza, który kręcił dla nas klip z okazji 15 rocznicy ślubu. Jego profesjonalizm i zaangażowanie były widoczne na każdym kroku. Pan Grzegorz uchwycił wszystkie ważne momenty w sposób naturalny i pełen emocji, co sprawiło że film jest dla nas wspaniałą pamiątką na całe życie. Gorąco polecamy jego usługi wszystkim którzy szukają profesjonalnego i utalentowanego kamerzysty. Ania i Robert",
        social: {
          facebook: "https://facebook.com/ania.gacek.96",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com"
        }
      }
    ],    
    aboutUs: {
      videoSrc: "logo_1080p.mp4",
      title: "Kim Jesteśmy",
      description: "Firma Pro Movie Group to zespół pasjonatów filmu i fotografii, którzy od lat tworzą wyjątkowe projekty dla naszych klientów. Nasze doświadczenie i zaangażowanie pozwoliło nam zdobyć uznanie w branży oraz zbudować silne relacje z naszymi klientami. Nasza firma powstała z miłości do sztuki filmowej i fotografii. Jesteśmy dumni z naszych osiągnięć i ciągle dążymy do doskonałości w tym, co robimy. Zaufaj nam, aby uwiecznić ważne chwile Twojego życia i przekształcić je w niezapomniane wspomnienia.",
      bulletPoints: [
        "Doświadczenie i pasja w tworzeniu filmów i zdjęć",
        "Uznanie w branży i silne relacje z klientami",
        "Zaufaj nam, aby uwiecznić ważne chwile Twojego życia",
        "Ciągłe dążenie do doskonałości i innowacyjność"
      ],
    },
    contact: {
      backgroundImage: "efekty/adds/opinie/images/DSC05454_crop.jpg",
      title: "Gotowi by utrwalić Twoje wyjątkowe chwile",
      buttonLink: "kontact",
      buttonText: "kontakt"
    }
};



// Funkcja do renderowania sekcji Hero
function renderHeroSection(data) {
  var heroSection = document.getElementById('hero-section');
  heroSection.innerHTML = `
    <div class="hero-slant overlay" data-stellar-background-ratio="0.5" style="background-image: url('${data.hero.backgroundImage}')">
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-lg-7 intro">
            <h1 class="text-white font-weight-bold mb-4">${data.hero.title}</h1>
            <p class="text-white mb-4">${data.hero.description}</p>
            <form id="sign-up-form" class="sign-up-form d-flex">
              <input type="email" id="email" class="form-control" placeholder="Wpisz adres email" required>
              <input type="submit" class="btn btn-primary" value="Zapisz się">
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="slant" style="background-image: url('efekty/adds/service-website-template/images/slant.svg');"></div>
  `;

  // Obsługa wysyłania formularza
  document.getElementById('sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    fetch('/save_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Email zapisany pomyślnie');
      } else {
        alert('Wystąpił błąd: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
}

  // Funkcja do renderowania sekcji o nas
  function renderAboutSection(data) {
    var aboutSection = document.getElementById('about-section');
    aboutSection.innerHTML = `
      <div class="site-section about-section">
        <div class="container">
          <div class="row align-items-center justify-content-between">
            <div class="col-lg-4">
              <h2 class="section-title mb-4">${data.about.title}</h2>
              <p>${data.about.description}</p>
              <p class="mt-4"><a href="kontakt" class="btn btn-primary btn-md">${data.about.buttonText}</a></p>
            </div>
            <div class="col-lg-7 pl-lg-5 position-relative">
              <div class="section-stack">
                <div class="image-stack">
                  <div class="image-stack__item image-stack__item--top">
                    <img src="${data.about.image1}" alt="Fotografia filmowa">
                  </div>
                  <div class="image-stack__item image-stack__item--bottom">
                    <img src="${data.about.image2}" alt="Fotografia filmowa">
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Funkcja do renderowania sekcji Clients
  function renderClientsSection(data) {
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
    data.forEach(function(client) {
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

// Funkcja do renderowania sekcji Testimonials
function renderTestimonialSection(data) {
  var testimonialSection = document.getElementById('testimonial-section');
  var testimonialHTML = `
    <div class="testimonial-section">
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-lg-4 mb-5 section-title" data-aos="fade-up" data-aos-delay="0">
            <h2 class="mb-4 font-weight-bold heading">Opinie naszych klientów</h2>
            <p class="mb-4">Zobacz, co nasi klienci mówią o współpracy z nami.</p>
            <p><a href="galeria" class="btn btn-primary">Zobacz naszą galerię</a></p>
          </div>
          <div class="col-lg-7" data-aos="fade-up" data-aos-delay="100">
            <div class="testimonial--wrap">
              <div class="owl-single owl-carousel no-dots no-nav">
  `;

  // Dodanie opinii klientów do sekcji
  data.testimonials.forEach(function(testimonial) {
    testimonialHTML += `
    <div class="testimonial-item">
    <div class="d-flex align-items-center mb-4">
      <div class="photo mr-3">
        <img src="${testimonial.photo}" alt="Image" class="img-fluid">
      </div>
      <div class="author">
        <cite class="d-block mb-0">${testimonial.author}</cite>
        <span>${testimonial.occupation}</span>
        <div class="social-icons">
          <ul class="social list-unstyled d-flex">
            <li class="mr-2">
              <a href="${testimonial.social.facebook}" style="background: none !important; border-radius: 0 !important; padding: 3 !important; color: #6c757d !important; font-size: 1.2rem; transition: color 0.3s ease;">
                <i class="fab fa-facebook-f"></i>
              </a>
            </li>
            <li class="mr-2">
              <a href="${testimonial.social.twitter}" style="background: none !important; border-radius: 0 !important; padding: 3 !important; color: #6c757d !important; font-size: 1.2rem; transition: color 0.3s ease;">
                <i class="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="${testimonial.social.instagram}" style="background: none !important; border-radius: 0 !important; padding: 3 !important; color: #6c757d !important; font-size: 1.2rem; transition: color 0.3s ease;">
                <i class="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
        <blockquote>
          <p>&ldquo;${testimonial.quote}&rdquo;</p>
        </blockquote>
      </div>
    `;
  });

  testimonialHTML += `
              </div>
              <div class="custom-nav-wrap">
                <a href="#" class="custom-owl-prev"><span class="icon-keyboard_backspace"></span></a>
                <a href="#" class="custom-owl-next"><span class="icon-keyboard_backspace"></span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  testimonialSection.innerHTML = testimonialHTML;
}

function renderAboutUsSection(data) {
  const aboutUsSection = document.getElementById('about-us-section');
  
  // Generowanie sekcji HTML
  const aboutUsHTML = `
    <div class="site-section" style="position: relative;">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6" style="position: relative;"> 
            <video class="img-fluid rounded" autoplay loop muted playsinline style="top: -20%; left: -20%; width: 140%; height: 140%; z-index: -1;">
              <source src="${data.aboutUs.videoSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="col-lg-6 pl-lg-5">
            <h3 class="mb-4 font-weight-bold">${data.aboutUs.title}</h3>
            <p>${data.aboutUs.description}</p>
            <ul class="list-check list-unstyled primary">
              ${data.aboutUs.bulletPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Ustawienie wygenerowanego HTML do sekcji
  aboutUsSection.innerHTML = aboutUsHTML;
}


  // Funkcja do renderowania sekcji Kontakt
  function renderContactSection(data) {
    var contactSection = document.getElementById('contact-section');
    contactSection.innerHTML = `
      <div class="site-section overlay site-cover-2" style="background-image: url('${data.contact.backgroundImage}')">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto text-center">
              <h2 class="text-white mb-4">${data.contact.title}</h2>
              <p class="mb-0"><a href="${data.contact.buttonLink}" rel="noopener" class="btn btn-primary">${data.contact.buttonText}</a></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  // Wywołanie funkcji renderujących sekcje
  renderHeroSection(data);
  renderAboutSection(data);
  renderClientsSection(data.clients);
  renderTestimonialSection(data);
  renderAboutUsSection(data);
  renderContactSection(data);
  //renderFooterSection(data);
