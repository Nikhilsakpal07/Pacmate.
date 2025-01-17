document.getElementById('packingForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const location = document.getElementById('location').value;
    const activities = document.getElementById('activities').value;

    if (!location || !activities) {
        alert('Please enter both location and activities.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/getSuggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location, activities }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        
        // Display suggestions
        const suggestionsDiv = document.getElementById('suggestions');
        suggestionsDiv.innerHTML = '<h2>Suggestions</h2>';

        const ul = document.createElement('ul');
        data.suggestions.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        suggestionsDiv.appendChild(ul);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching suggestions. Please try again.');
    }
});
