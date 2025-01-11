document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;
    const errorContainer = document.getElementById('errorContainer');

    // Limpar mensagens de erro anteriores
    errorContainer.innerHTML = '';

    // Validação local
    if (password !== passwordConfirmation) {
        errorContainer.innerHTML = '<p>Passwords do not match.</p>';
        return;
    }

    // Corpo do JSON para enviar
    const requestData = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok) {
            // Registro bem-sucedido
            alert('Registration successful! Redirecting to login page...');
            window.location.href = 'login.html';
        } else {
            // Exibir erros da API
            if (data.errors) {
                for (const [field, messages] of Object.entries(data.errors)) {
                    messages.forEach((message) => {
                        const errorElement = document.createElement('p');
                        errorElement.textContent = message;
                        errorContainer.appendChild(errorElement);
                    });
                }
            } else {
                errorContainer.innerHTML = '<p>An unknown error occurred.</p>';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorContainer.innerHTML = '<p>Failed to connect to the API.</p>';
    }
});
