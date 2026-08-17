// ==========================================
// Mobile nav toggle
// ==========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after tapping a link (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ==========================================
// Contact form: validation + submit via EmailJS
// ==========================================

// --- Fill these in after setting up your EmailJS account (see README.md) ---
const EMAILJS_PUBLIC_KEY = 'LBcv2jeA1Lyl1YqkL';
const EMAILJS_SERVICE_ID = 'service_6glbmn8';
const EMAILJS_TEMPLATE_ID = 'template_pfr96oe';

if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

const validators = {
    name: value => value.trim().length >= 2 || 'Please enter your full name.',
    phone: value => /^[\d\s()+\-.]{7,}$/.test(value.trim()) || 'Please enter a valid phone number.',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.'
};

function showFieldError(input, message) {
    input.classList.toggle('invalid', Boolean(message));
    const errorEl = form.querySelector(`[data-error-for="${input.name}"]`);
    if (errorEl) errorEl.textContent = message || '';
}

function validateField(input) {
    const validator = validators[input.name];
    if (!validator) return true;
    const result = validator(input.value);
    showFieldError(input, result === true ? '' : result);
    return result === true;
}

['name', 'phone', 'email'].forEach(fieldName => {
    const input = form.elements[fieldName];
    if (input) {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    }
});

if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Honeypot: if this hidden field got filled in, silently drop the submission
        if (form.elements['_honey'] && form.elements['_honey'].value) {
            return;
        }

        const fieldsValid = ['name', 'phone', 'email']
            .map(name => validateField(form.elements[name]))
            .every(Boolean);

        if (!fieldsValid) {
            formStatus.textContent = 'Please fix the highlighted fields above.';
            formStatus.className = 'form-status error';
            return;
        }

        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            formStatus.textContent = 'Form is not set up yet — add your EmailJS keys in script.js (see README.md).';
            formStatus.className = 'form-status error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-label').textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                name: form.elements['name'].value.trim(),
                phone: form.elements['phone'].value.trim(),
                email: form.elements['email'].value.trim(),
                message: form.elements['message'].value.trim() || '(none provided)'
            });

            formStatus.textContent = "Thanks! Your quote request is on its way — we'll be in touch shortly.";
            formStatus.className = 'form-status success';
            form.reset();
        } catch (err) {
            console.error('[EmailJS] send failed:', err);
            formStatus.textContent = 'Something went wrong sending your message. Please call us directly at (425) 948-9573.';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-label').textContent = 'Send Request';
        }
    });
}
