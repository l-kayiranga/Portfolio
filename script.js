// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            // In a real scenario, you would send this data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            formSuccess.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });
}

// Load blog posts from localStorage and display them
function loadBlogPosts() {
    const blogPostsContainer = document.getElementById('blogPosts');
    if (!blogPostsContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    if (posts.length === 0) {
        blogPostsContainer.innerHTML = '<p>No blog posts yet. Check back later!</p>';
        return;
    }
    
    // Only show the 3 most recent posts on the main page
    const recentPosts = posts.slice(0, 3);
    
    blogPostsContainer.innerHTML = recentPosts.map(post => `
        <div class="blog-post">
            <h3>${post.title}</h3>
            <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
            <p class="post-content">${post.content.substring(0, 150)}...</p>
            <a href="blog-dashboard.html" class="read-more">Read More</a>
        </div>
    `).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
});