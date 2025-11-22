document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // EmailJS initialization (placeholder keys)
    emailjs.init("user_xxxxxxxxxxxxx");
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        emailjs.sendForm('service_xxxxxxxxx', 'template_xxxxx', this)
            .then(function() {
                alert('¡Mensaje enviado exitosamente!');
            }, function(error) {
                alert('Error al enviar el mensaje: ' + JSON.stringify(error));
            });
    });
});
