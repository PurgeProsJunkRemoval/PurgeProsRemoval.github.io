// Optional: If you want background submission via FormSubmit without a page redirect
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert('Thank you! Your quote request has been sent successfully to Purge Pros Junk Removal.');
            form.reset();
        } else {
            alert('Oops! There was a problem sending your message. Please try calling us directly at (425) 948-9573.');
        }
    }).catch(error => {
        alert('Oops! There was a problem sending your message. Please try calling us directly at (425) 948-9573.');
    });
});