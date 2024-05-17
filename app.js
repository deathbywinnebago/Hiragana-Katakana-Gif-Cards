let flashCards = [];
let currentCardIndex = 0;
let attempts = 0;
let correctCount = 0;
let totalCount = 0;

function showNextCard() {
    if (flashCards.length === 0) {
        document.getElementById('card').textContent = 'Loading cards...';
        return;
    }
    currentCardIndex = Math.floor(Math.random() * flashCards.length);
    document.getElementById('card').textContent = flashCards[currentCardIndex].question;
    document.getElementById('answer').value = '';
    document.getElementById('status').textContent = '';
    attempts = 0;

    totalCount++; // Increment the total count each time a new card is presented
    document.getElementById('total-count').textContent = "Total Cards Presented: " + totalCount;
}

function checkAnswer() {
    const answerInput = document.getElementById('answer');
    const userAnswer = answerInput.value.trim();
    if (userAnswer.toLowerCase() === flashCards[currentCardIndex].answer.toLowerCase()) {
        correctCount++; // Increment correct count on correct answer
        document.getElementById('correct-count').textContent = "Correct Answers: " + correctCount;
        answerInput.classList.remove('input-error'); // Remove error styling on correct answer
        showNextCard();
    } else {
        attempts++;
        // answerInput.classList.add('input-error'); // Add error styling on wrong answer
        if (attempts >= 3) {
            document.getElementById('status').textContent = "Correct answer: " + flashCards[currentCardIndex].answer;
            setTimeout(() => {
                showNextCard();
                answerInput.classList.remove('input-error'); // Reset the error state for new card
            }, 2000); // Shows the next card after 2 seconds
        } else {
            document.getElementById('status').textContent = "Try again!";
        }
    }
}

function loadFlashCards() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split(/\r?\n/); // Splitting by new line, handling both Unix and Windows endings
            flashCards = lines.map(line => {
                const parts = line.split(','); // Change here if using a different delimiter
                return { question: parts[0].trim(), answer: parts[1].trim() };
            });
            showNextCard();
        })
        .catch(error => {
            document.getElementById('card').textContent = 'Failed to load cards.';
            console.error('Error loading the flash cards:', error);
        });
}

document.getElementById('submit').addEventListener('click', checkAnswer);
document.getElementById('answer').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

window.onload = loadFlashCards;
