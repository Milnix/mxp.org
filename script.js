document.getElementById('getAnswerBtn').addEventListener('click', async function () {
    const userQuestion = document.getElementById('problemInput').value.trim();

    if (userQuestion === '') {
        alert("Please enter a question.");
    } else {
        try {
            const aiResponse = await getCURLResponse(userQuestion);
            const aiResponseElement = document.getElementById('aiResponse');
            aiResponseElement.innerHTML = `<p><strong>AI Response:</strong> ${aiResponse}</p>`;
            aiResponseElement.style.display = 'block';
        } catch (error) {
            console.error('Error fetching AI response:', error);
            alert('An error occurred while fetching the AI response.');
        }
    }
});

async function getCURLResponse(userQuestion) {
    const response = await fetch('/get_answer', {
        method: 'POST',
        body: JSON.stringify({
            userQuestion: userQuestion,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch AI response');
    }

    const data = await response.json();
    return data.aiResponse;
}
