// contact.js - Contact page functionality

// Load contact page settings when page loads
document.addEventListener('DOMContentLoaded', function () {
  loadContactPageSettings();
});

// Load contact page settings from API
async function loadContactPageSettings() {
  try {
    const response = await fetch(`${window.CONFIG.apiBaseUrl}/contact-settings/`);

    if (!response.ok) {
      throw new Error('Failed to load contact page settings');
    }

    const settings = await response.json();
    updateContactPageContent(settings);

    // Hide loading state, show content
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('contact-content').style.display = 'block';
  } catch (error) {
    console.error('Error loading contact page settings:', error);
    // Still hide loading and show content with defaults
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('contact-content').style.display = 'block';
  }
}

// Update page content with settings
function updateContactPageContent(settings) {
  // Update hero section
  document.getElementById('hero-title').textContent = settings.hero_title || 'Get in Touch';
  document.getElementById('hero-subtitle').textContent = settings.hero_subtitle || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.';

  // Update form title
  document.getElementById('form-title').textContent = settings.form_title || 'Send us a Message';

  // Update contact information title if provided
  if (settings.contact_info_title) {
    document.getElementById('contact-info-title').textContent = settings.contact_info_title;
  }

  // Update address section
  if (settings.address_line1) {
    document.getElementById('address-section').style.display = 'block';
    document.getElementById('address-title').innerHTML = `
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            ${settings.address_section_title || 'Visit Us'}
        `;

    let addressHTML = '';
    if (settings.address_line1) addressHTML += `${settings.address_line1}<br>`;
    if (settings.address_line2) addressHTML += `${settings.address_line2}<br>`;
    if (settings.address_line3) addressHTML += `${settings.address_line3}<br>`;
    if (settings.address_line4) addressHTML += `${settings.address_line4}`;

    document.getElementById('address-content').innerHTML = addressHTML;
  }

  // Update phone section
  if (settings.phone_number) {
    document.getElementById('phone-section').style.display = 'block';
    document.getElementById('phone-title').innerHTML = `
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            ${settings.phone_section_title || 'Call Us'}
        `;

    let phoneHTML = `<a href="tel:${settings.phone_number}" class="hover:text-teal-600">${settings.phone_number}</a><br>`;

    if (settings.business_hours) {
      phoneHTML += settings.business_hours.replace(/\n/g, '<br>');
    }

    document.getElementById('phone-content').innerHTML = phoneHTML;
  }

  // Update email section
  if (settings.general_email || settings.support_email || settings.sales_email) {
    document.getElementById('email-section').style.display = 'block';
    document.getElementById('email-title').innerHTML = `
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            ${settings.email_section_title || 'Email Us'}
        `;

    let emailHTML = '';

    if (settings.general_email) {
      emailHTML += `General Inquiries: <a href="mailto:${settings.general_email}" class="hover:text-teal-600">${settings.general_email}</a><br>`;
    }

    if (settings.support_email) {
      emailHTML += `Customer Support: <a href="mailto:${settings.support_email}" class="hover:text-teal-600">${settings.support_email}</a><br>`;
    }

    if (settings.sales_email) {
      emailHTML += `Sales: <a href="mailto:${settings.sales_email}" class="hover:text-teal-600">${settings.sales_email}</a>`;
    }

    document.getElementById('email-content').innerHTML = emailHTML;
  }

  // Update social media section
  if (settings.facebook_url || settings.instagram_url || settings.twitter_url) {
    document.getElementById('social-section').style.display = 'block';
    document.getElementById('social-title').textContent = settings.social_section_title || 'Follow Us';

    let socialHTML = '';

    if (settings.facebook_url) {
      socialHTML += `
                <a href="${settings.facebook_url}" class="text-slate-600 hover:text-teal-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd"></path>
                    </svg>
                </a>
            `;
    }

    if (settings.instagram_url) {
      socialHTML += `
                <a href="${settings.instagram_url}" class="text-slate-600 hover:text-teal-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm5.833 7.5h-1.458c.083.333.125.694.125 1.071 0 2.083-1.667 3.75-3.75 3.75s-3.75-1.667-3.75-3.75c0-.377.042-.738.125-1.071H5.833v4.792c0 .458.375.833.834.833h8.333c.458 0 .833-.375.833-.833V7.5z" clip-rule="evenodd"></path>
                    </svg>
                </a>
            `;
    }

    if (settings.twitter_url) {
      socialHTML += `
                <a href="${settings.twitter_url}" class="text-slate-600 hover:text-teal-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                </a>
            `;
    }

    document.getElementById('social-links').innerHTML = socialHTML;
  }
}

// Contact form submission handler
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Get form elements
      const form = e.target;
      const submitButton = document.getElementById('submit-button');
      const successMessage = document.getElementById('success-message');
      const errorMessage = document.getElementById('error-message');
      const errorText = document.getElementById('error-text');

      // Hide any existing messages
      successMessage.classList.add('hidden');
      errorMessage.classList.add('hidden');

      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      // Get form data
      const formData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
      };

      try {
        // Submit to API
        const response = await fetch(`${window.CONFIG.apiBaseUrl}/contact/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // Show success message
          successMessage.classList.remove('hidden');

          // Clear form
          form.reset();

          // Scroll to message
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Show error message
          errorMessage.classList.remove('hidden');

          // Display specific error if available
          if (data.message) {
            errorText.textContent = data.message;
          } else if (data.detail) {
            errorText.textContent = data.detail;
          } else {
            errorText.textContent = 'Please check your information and try again.';
          }

          // Scroll to message
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (error) {
        console.error('Error submitting form:', error);

        // Show error message
        errorMessage.classList.remove('hidden');
        errorText.textContent = 'Unable to send message. Please try again later.';

        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    });
  }
});