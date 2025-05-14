document.addEventListener('DOMContentLoaded', function() {
    // Create floating hearts
    const heartsContainer = document.getElementById('hearts');
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createHeart(heartsContainer);
        }, i * 1000);
    }

    setInterval(() => {
        createHeart(heartsContainer);
    }, 3000);

    // Initialize audio
    const backgroundMusic = document.getElementById('background-music');
    // Try to play music on page load (may be blocked by browser until user interaction)
    backgroundMusic.volume = 0.2; // Set volume to 30% to avoid being too loud
    backgroundMusic.play().catch(error => {
        console.log('Autoplay prevented:', error);
        // Music will play on user interaction (e.g., submit button)
    });

    // Option selection
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            const parent = this.parentElement;
            const isLocation3 = parent.id === 'location3';
            const isFirstOption = Array.from(parent.querySelectorAll('.option')).indexOf(this) === 0;

            // Handle location3 non-first options
            if (isLocation3 && !isFirstOption) {
                e.preventDefault(); // Prevent default click behavior
                // Move this option to a random position within the options-container
                const container = parent; // .options-container
                const containerRect = container.getBoundingClientRect();
                const optionRect = this.getBoundingClientRect();

                // Calculate max boundaries within the container
                const maxX = containerRect.width - optionRect.width;
                const maxY = containerRect.height - optionRect.height;

                // Generate random coordinates
                const randomX = Math.random() * maxX;
                const randomY = Math.random() * maxY;

                // Apply absolute positioning and move
                this.style.position = 'absolute';
                this.style.left = `${randomX}px`;
                this.style.top = `${randomY}px`;
                this.style.transition = 'all 0.5s ease'; // Smooth movement
                this.classList.remove('selected'); // Ensure it’s not selected
                return; // Exit to prevent selection
            }

            // Normal selection logic for first option in location3 or other locations
            parent.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Form submission
    const submitBtn = document.getElementById('submit');
    const dateForm = document.getElementById('date-form');
    const resultSection = document.getElementById('result');
    const choicesSummary = document.getElementById('choices-summary');
    const backBtn = document.getElementById('back');

    submitBtn.addEventListener('click', function() {
        const location1 = document.querySelector('#location1 .option.selected');
        const location2 = document.querySelector('#location2 .option.selected');
        const location3 = document.querySelector('#location3 .option.selected');

        if (!location1 || !location2 || !location3) {
            alert('Xin hãy chọn một lựa chọn cho mỗi địa điểm!');
            return;
        }

        const choices = {
            location1: getOptionInfo(location1),
            location2: getOptionInfo(location2),
            location3: getOptionInfo(location3)
        };

        choicesSummary.innerHTML = `
            <strong>Sau đó mìn iiii:</strong> ${choices.location1.name}<br>
            <strong>Đầu tin mình iii:</strong> ${choices.location2.name}<br>
            <strong>Buổi tối mình sẽeee:</strong> ${choices.location3.name}
        `;

        dateForm.style.display = 'none';
        resultSection.style.display = 'block';

        // Play music if not already playing
        backgroundMusic.play().catch(error => {
            console.log('Music play failed:', error);
        });

        // Show celebration
        celebrateChoice();
    });

    backBtn.addEventListener('click', function() {
        dateForm.style.display = 'block';
        resultSection.style.display = 'none';
        document.getElementById('celebration').style.display = 'none';
        document.getElementById('celebration').innerHTML = '';
        // Reset positions of location3 options
        document.querySelectorAll('#location3 .option').forEach(opt => {
            opt.style.position = '';
            opt.style.left = '';
            opt.style.top = '';
            opt.style.transition = '';
            opt.classList.remove('selected'); // Clear selection
        });
        // Pause music
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset to start
    });

    function getOptionInfo(optionElement) {
        return {
            value: optionElement.getAttribute('data-value'),
            name: optionElement.querySelector('.option-name').textContent,
            desc: optionElement.querySelector('.option-desc').textContent
        };
    }

    function createHeart(container) {
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Random position, size and color
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const animDuration = Math.random() * 3 + 3;
        const delay = Math.random() * 5;

        const colors = ['#ffb6c1', '#ff69b4', '#ffc0cb', '#ffb8e7', '#ff9cc5'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.bottom = '-20px';
        heart.style.backgroundColor = color;
        heart.style.animationDuration = `${animDuration}s`;
        heart.style.animationDelay = `${delay}s`;

        heart.style.opacity = '0';
        container.appendChild(heart);

        setTimeout(() => {
            if (container.contains(heart)) {
                container.removeChild(heart);
            }
        }, (animDuration + delay) * 1000);
    }

    function celebrateChoice() {
        const celebrationContainer = document.getElementById('celebration');
        celebrationContainer.style.display = 'block';
        celebrationContainer.innerHTML = '';

        // Create confetti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            const size = Math.random() * 8 + 5;
            const colors = ['#ffb6c1', '#ff69b4', '#ffc0cb', '#ffb8e7', '#ff9cc5', '#ffffff', '#ffdbe5'];
            const shapes = ['circle', 'square', 'triangle'];

            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;

            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = `${size}px solid transparent`;
                confetti.style.borderRight = `${size}px solid transparent`;
                confetti.style.borderBottom = `${size * 1.5}px solid ${color}`;
            }

            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${Math.random() * 20 - 20}%`;
            confetti.style.opacity = '1';

            const animDuration = Math.random() * 3 + 2;
            const animDelay = Math.random() * 0.5;

            confetti.style.animation = `fall ${animDuration}s ease-in ${animDelay}s forwards`;

            celebrationContainer.appendChild(confetti);
        }

        // Create hearts burst
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createHeart(heartsContainer);
            }, i * 100);
        }
    }
});