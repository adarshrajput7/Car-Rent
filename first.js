document.addEventListener("DOMContentLoaded", function() {
    const dateInput = document.getElementById("dateInput");

    dateInput.addEventListener("focus", function() {
        this.type = "date"; // Change input type to 'date'
        this.showPicker();  // Open date picker immediately
    });

    dateInput.addEventListener("blur", function() {
        if (!this.value) {
            this.type = "text"; // Change back to 'text' if empty
        }
    });
});




//car card change

function showCard(cardNumber, buttonId) {
    // Pehle sabhi cards ko hide kar do
    document.getElementById('card1').classList.add('hidden');
    document.getElementById('card2').classList.add('hidden');
    document.getElementById('card3').classList.add('hidden');
    
    document.getElementById('card4').classList.add('hidden');
    document.getElementById('card5').classList.add('hidden');
    // Ab sirf selected card show karo
    document.getElementById('card' + cardNumber).classList.remove('hidden');

    // Pehle sabhi buttons ka green color hatado
    document.getElementById('btn1').classList.remove('active');
    document.getElementById('btn2').classList.remove('active');
    document.getElementById('btn3').classList.remove('active');
    
    document.getElementById('btn4').classList.remove('active');
    document.getElementById('btn5').classList.remove('active');

    // Selected button ka color green kar do
    document.getElementById(buttonId).classList.add('active');
}



//nab bar


let prevScrollPos = window.scrollY;

        window.onscroll = function() {
            let currentScrollPos = window.scrollY;

            if (prevScrollPos < currentScrollPos) {
                // Scrolling down, hide navbar
                document.getElementById("navbar").style.top = "-60px";
            } else {
                // Scrolling up, show navbar
                document.getElementById("navbar").style.top = "0";
            }
            prevScrollPos = currentScrollPos;
        };



//card



document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const container = document.querySelector('.slider-container');
    
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;
    let maxTranslate = 0;
    let isAnimating = false;
    
    // Calculate maximum translate value
    function calculateBoundaries() {
        const containerWidth = container.offsetWidth;
        const sliderWidth = slider.scrollWidth;
        maxTranslate = containerWidth - sliderWidth - 40; // Account for padding
        maxTranslate = Math.min(maxTranslate, 0); // Ensure it's not positive
    }
    
    // Initialize boundaries
    calculateBoundaries();
    window.addEventListener('resize', calculateBoundaries);
    
    // Add momentum to the swipe
    function applyMomentum() {
        const cardWidth = cards[0].offsetWidth + 30;
        const velocity = (currentTranslate - prevTranslate) / 5;
        let momentumIndex = currentIndex;
        
        if (velocity < -20 && currentIndex < cards.length - 1) {
            momentumIndex = currentIndex + 1;
        } else if (velocity > 20 && currentIndex > 0) {
            momentumIndex = currentIndex - 1;
        }
        
        // Snap to nearest card with smooth transition
        smoothSnapTo(momentumIndex);
    }
    
    // Smooth snap to specific card index
    function smoothSnapTo(index) {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        
        const cardWidth = cards[0].offsetWidth + 30;
        let targetTranslate = currentIndex * -cardWidth;
        
        // Apply boundaries
        targetTranslate = Math.max(maxTranslate, Math.min(0, targetTranslate));
        
        // If we're at the edges, apply slight bounce effect
        if (targetTranslate >= 0 || targetTranslate <= maxTranslate) {
            targetTranslate = targetTranslate * 0.95;
        }
        
        prevTranslate = targetTranslate;
        currentTranslate = targetTranslate;
        
        slider.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        slider.style.transform = `translateX(${targetTranslate}px)`;
        
        // Reset after animation
        setTimeout(() => {
            slider.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            isAnimating = false;
        }, 500);
    }
    
    // Add event listeners
    cards.forEach((card, index) => {
        card.addEventListener('mousedown', dragStart(index));
        card.addEventListener('touchstart', dragStart(index));
        card.querySelector('img').addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchmove', drag);
    slider.addEventListener('mouseup', dragEnd);
    slider.addEventListener('mouseleave', dragEnd);
    slider.addEventListener('touchend', dragEnd);
    
    prevBtn.addEventListener('click', () => {
        if (!isAnimating && currentIndex > 0) {
            smoothSnapTo(currentIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (!isAnimating && currentIndex < cards.length - 1) {
            smoothSnapTo(currentIndex + 1);
        }
    });
    
    function dragStart(index) {
        return function(event) {
            if (isAnimating) return;
            
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            slider.style.transition = 'none';
            slider.classList.add('dragging');
            animationID = requestAnimationFrame(animation);
        }
    }
    
    function drag(event) {
        if (isDragging && !isAnimating) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
            
            // Apply rubber band effect at boundaries
            if (currentTranslate > 0) {
                currentTranslate = currentTranslate * 0.5;
            } else if (currentTranslate < maxTranslate) {
                currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.5;
            }
        }
    }
    
    function dragEnd() {
        if (isDragging && !isAnimating) {
            cancelAnimationFrame(animationID);
            isDragging = false;
            slider.classList.remove('dragging');
            applyMomentum();
        }
    }
    
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
});

