document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ACCORDION LOGIC ---
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const item = acc.parentElement;
            const content = acc.nextElementSibling;
            
            // Toggle current
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }

            // Close others (optional, for accordion feel)
            accordions.forEach(otherAcc => {
                const otherItem = otherAcc.parentElement;
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherAcc.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });

    // --- 2. RECYCLING QUIZ ---
    const quizData = [
        {
            question: "Which of these CANNOT be recycled in a standard bin?",
            options: ["Plastic Bottle", "Greasy Pizza Box", "Aluminum Can", "Office Paper"],
            correct: 1, // Index of correct answer
            feedback: "Grease contaminates the paper recycling process!"
        },
        {
            question: "What needs to be done before recycling a milk carton?",
            options: ["Crush it immediately", "Rinse it out", "Remove the label", "Nothing"],
            correct: 1,
            feedback: "Rinsing prevents smells and pests in the recycling facility."
        },
        {
            question: "What type of light bulbs can go in the glass recycling?",
            options: ["Incandescent", "LED", "Fluorescent", "None of them"],
            correct: 3,
            feedback: "Light bulbs use special glass and often contain hazardous materials. Take them to a drop-off."
        },
        {
            question: "How long does a plastic bottle take to decompose?",
            options: ["10 years", "50 years", "100 years", "450+ years"],
            correct: 3,
            feedback: "Plastic persists in the environment for centuries if not recycled."
        },
        {
            question: "Is broke glass recyclable in your curbside bin?",
            options: ["Yes", "No"],
            correct: 1,
            feedback: "Broken glass is a safety hazard for workers. Wrap it and trash it."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const startView = document.getElementById('start-quiz-view');
    const questionView = document.getElementById('question-view');
    const resultView = document.getElementById('result-view');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressFill = document.getElementById('progress-fill');
    const feedbackText = document.getElementById('feedback-text');
    const restartBtn = document.getElementById('restart-quiz-btn');

    startQuizBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', startQuiz);

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        startView.classList.add('hidden');
        resultView.classList.add('hidden');
        questionView.classList.remove('hidden');
        loadQuestion();
    }

    function loadQuestion() {
        const q = quizData[currentQuestionIndex];
        questionText.textContent = q.question;
        feedbackText.classList.add('hidden');
        feedbackText.textContent = "";
        
        // Update Progress
        const progress = ((currentQuestionIndex) / quizData.length) * 100;
        progressFill.style.width = `${progress}%`;

        optionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(index, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedIndex, btn) {
        // Disable clickable
        const allBtns = optionsContainer.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        const q = quizData[currentQuestionIndex];
        const isCorrect = selectedIndex === q.correct;

        if (isCorrect) {
            btn.classList.add('correct');
            score++;
            feedbackText.innerHTML = `<span style="color:var(--color-success)">✔ Correct!</span> ${q.feedback}`;
        } else {
            btn.classList.add('wrong');
            // Highlight correct one
            allBtns[q.correct].classList.add('correct');
            feedbackText.innerHTML = `<span style="color:var(--color-error)">✘ Oops!</span> ${q.feedback}`;
        }

        feedbackText.classList.remove('hidden');

        // Next question delay
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }, 2000);
    }

    function showResult() {
        questionView.classList.add('hidden');
        resultView.classList.remove('hidden');
        
        const resultScore = document.getElementById('result-score');
        const resultMessage = document.getElementById('result-message');
        
        resultScore.textContent = `You scored ${score} out of ${quizData.length}`;
        
        if (score === 5) {
            resultMessage.textContent = "🏆 You’re a Recycling Champion! Amazing functionality knowledge.";
        } else if (score >= 3) {
            resultMessage.textContent = "🌟 Great job! You know the basics well.";
        } else {
            resultMessage.textContent = "📚 Keep learning! Every bit helps.";
        }
    }

    // --- 3. SEARCH TOOL ---
    const database = [
        { name: "Newspaper", type: "recycle", msg: "Clean & Dry. Bin it.", icon: "📰" },
        { name: "Pizza Box (Greasy)", type: "trash", msg: "Grease ruins paper recycling. Compost or Trash.", icon: "🍕" },
        { name: "Pizza Box (Clean)", type: "recycle", msg: "Flatten it. Bin it.", icon: "📦" },
        { name: "Milk Carton", type: "recycle", msg: "Rinse well. Flatten.", icon: "🥛" },
        { name: "Plastic Bottle", type: "recycle", msg: "Empty & Rinse. Keep cap on.", icon: "🥤" },
        { name: "Battery", type: "special", msg: "Fire hazard! Take to e-waste drop-off.", icon: "🔋" },
        { name: "Styrofoam", type: "trash", msg: "Not recyclable in curbside bins.", icon: "🥡" },
        { name: "Aluminum Can", type: "recycle", msg: "Rinse. Don't crush if possible.", icon: "🥫" },
        { name: "Light Bulb", type: "special", msg: "Hazardous. Take to specal facility.", icon: "💡" },
        { name: "Plastic Bag", type: "trash", msg: "Tangles machines. Grocery store drop-off only.", icon: "🛍️" }
    ];

    const searchInput = document.getElementById('item-search');
    const resultsContainer = document.getElementById('search-results');
    const highlight = document.getElementById('search-highlight');
    const hIcon = document.getElementById('highlight-icon');
    const hName = document.getElementById('highlight-name');
    const hStatus = document.getElementById('highlight-status');
    const hInstr = document.getElementById('highlight-instruction');
    const hCard = document.querySelector('.highlight-card');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        resultsContainer.innerHTML = '';
        
        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }

        const matches = database.filter(item => item.name.toLowerCase().includes(query));

        if (matches.length > 0) {
            resultsContainer.classList.remove('hidden');
            matches.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('result-item');
                div.textContent = `${item.icon} ${item.name}`;
                div.addEventListener('click', () => showItemDetails(item));
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.classList.add('hidden');
        }
    });

    function showItemDetails(item) {
        highlight.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        searchInput.value = item.name;

        hIcon.textContent = item.icon;
        hName.textContent = item.name;
        hInstr.textContent = item.msg;

        hStatus.className = 'status-badge'; // reset
        if (item.type === 'recycle') {
            hStatus.textContent = "Recyclable ✔";
            hStatus.style.background = "var(--color-leaf-light)";
            hStatus.style.color = "var(--color-forest)";
            hCard.style.borderColor = "var(--color-success)";
        } else if (item.type === 'trash') {
            hStatus.textContent = "Trash ✘";
            hStatus.style.background = "#ffebee";
            hStatus.style.color = "var(--color-error)";
            hCard.style.borderColor = "var(--color-error)";
        } else {
            hStatus.textContent = "Special Disposal ⚠";
            hStatus.style.background = "#fff3e0";
            hStatus.style.color = "var(--color-orange-dark)";
            hCard.style.borderColor = "var(--color-orange)";
        }
    }

    // --- 4. IMPACT COUNTER ANIMATION ---
    const statsSection = document.getElementById('impact');
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);

});
