document.addEventListener('DOMContentLoaded', () => {
    const linkCards = document.querySelectorAll('.link-card');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    linkCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const url = card.getAttribute('href');
            
            // Add a small delay before opening the link
            setTimeout(() => {
                window.open(url, '_blank');
            }, 300);

            // Add a visual feedback effect
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });

    function toggleDarkMode() {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'light') {
        toggleDarkMode();
    }

    // Add fade-in animation to cards
    linkCards.forEach(card => {
        card.classList.add('fade-in');
    });

    // Quotes functionality
    function fetchRandomQuote() {
    fetch('./quotes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(quotes => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];
            document.getElementById('quote-text').textContent = `${randomQuote.quote}`;
            document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
        })
        .catch(error => {
            console.error('Error fetching quote:', error);
            document.getElementById('quote-text').textContent = 'Failed to load quote';
            document.getElementById('quote-author').textContent = '';
        });
}

// Fetch a new quote every 60 seconds
setInterval(fetchRandomQuote, 60000);

// Initial quote fetch
fetchRandomQuote();
});

