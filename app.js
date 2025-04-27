
let flashCards = [];
let currentCardIndex = 0;
let attempts = 0;
let correctCount = 0;
let totalCount = 0;
let correctPercent = 0;
let stats = {}; // character -> { shown: number, correct: number }

if (sessionStorage.getItem('flashcardStats')) {
    stats = JSON.parse(sessionStorage.getItem('flashcardStats'));
}

function saveStats() {
    sessionStorage.setItem('flashcardStats', JSON.stringify(stats));
}

function loadAnimeGif() {
    const gifIndex = Math.floor(Math.random() * 40) + 1;
    document.getElementById('anime-gif').src = `gifs/${gifIndex}.gif`;
}

function selectNextCard() {
    let weightedList = [];

    flashCards.forEach((card, index) => {
        const char = card.question;
        const stat = stats[char] || { shown: 0, correct: 0 };
        const accuracy = stat.shown > 0 ? stat.correct / stat.shown : 0;

        let weight = 1;
        if (stat.shown === 0) {
            weight = 5;
        } else if (accuracy < 0.6) {
            weight = 4;
        } else if (accuracy < 0.8) {
            weight = 2;
        }

        for (let i = 0; i < weight; i++) {
            weightedList.push(index);
        }
    });

    currentCardIndex = weightedList[Math.floor(Math.random() * weightedList.length)];
}

function showNextCard() {
    if (flashCards.length === 0) {
        document.getElementById('card').textContent = 'Loading cards...';
        return;
    }

    selectNextCard();

    document.getElementById('card').textContent = flashCards[currentCardIndex].question;
    const answerInput = document.getElementById('answer');
    answerInput.value = '';
    answerInput.disabled = false;
    answerInput.focus();
    answerInput.classList.remove('input-error');
    document.getElementById('status').textContent = '';
    attempts = 0;

    totalCount++;
    document.getElementById('total-count').textContent = "Total Cards Presented: " + totalCount;
    document.getElementById('correct-percent').textContent = "% correct: " + ((correctCount / totalCount) * 100).toFixed(1);

    loadAnimeGif();
}

function checkAnswer() {
    const answerInput = document.getElementById('answer');
    const userAnswer = answerInput.value.trim();
    const correctAnswer = flashCards[currentCardIndex].answer.trim();
    const char = flashCards[currentCardIndex].question;

    if (!stats[char]) {
        stats[char] = { shown: 0, correct: 0 };
    }

    stats[char].shown++;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        correctCount++;
        stats[char].correct++;
        document.getElementById('correct-count').textContent = "Correct Answers: " + correctCount;
        answerInput.classList.remove('input-error');
        showNextCard();
    } else {
        attempts++;
        answerInput.classList.add('input-error');
        if (attempts >= 3) {
            document.getElementById('status').textContent = `Out of attempts! Correct answer was: ${correctAnswer}`;
            answerInput.disabled = true;
            setTimeout(showNextCard, 1500);
        } else {
            document.getElementById('status').textContent = `Try again! Attempts: ${attempts}`;
        }
    }

    saveStats();
}

function startApp() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            flashCards = text.trim().split('\n').map(line => {
                const [question, answer] = line.split(',').map(part => part.trim());
                return { question, answer };
            });

            showNextCard();
        });
}

document.getElementById('submit').addEventListener('click', checkAnswer);
document.getElementById('answer').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkAnswer();
    }
});

window.onload = startApp;
