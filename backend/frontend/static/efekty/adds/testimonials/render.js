
// Define global variables
var SERVER = "http://127.0.0.1"; // Add HTTP protocol
var PATH = SERVER + '/efekty/adds/testimonials/';
var PHOTOS = SERVER + '/efekty/adds/testimonials/img/'

async function generateTestimonials() {
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
    testimonialsData.forEach((testimonial) => {
      setTimeout(() => {
        const testimonialCard = document.createElement('div');
        testimonialCard.classList.add('col-md-4', 'mb-5', 'mb-md-0');

        testimonialCard.innerHTML = `
          <div class="card testimonial-card">
            <div class="card-up" style="background-color: ${testimonial.backgroundColor};"></div>
            <div class="avatar mx-auto bg-white">
              <img src="${testimonial.avatarSrc}" class="rounded-circle img-fluid" />
            </div>
            <div class="card-body">
              <h4 class="mb-4">${testimonial.name}</h4>
              <hr />
              <p class="dark-grey-text mt-4">
                <i class="fas fa-quote-left pe-2"></i>${testimonial.comment}
              </p>
            </div>
          </div>
        `;

        testimonialsWrapper.appendChild(testimonialCard);
      }, 0);
    });
  };

  // Sample testimonials data
  const testimonialsData = [
    {
      name: "Maria Smantha",
      avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp",
      comment: "Lorem ipsum dolor sit amet eos adipisci, consectetur adipisicing elit.",
      backgroundColor: "#9d789b"
    },
    {
      name: "Lisa Cudrow",
      avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp",
      comment: "Neque cupiditate assumenda in maiores repudi mollitia architecto.",
      backgroundColor: "#7a81a8"
    },
    {
      name: "John Smith",
      avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
      comment: "Delectus impedit saepe officiis ab aliquam repellat rem unde ducimus.",
      backgroundColor: "#6d5b98"
    }
  ];

  // Generate testimonials when the page is loaded
  window.addEventListener('DOMContentLoaded', generateTestimonials);