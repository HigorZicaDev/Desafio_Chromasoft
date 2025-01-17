// Função para abrir o modal de novo usuário
document.getElementById('newUserBtn').addEventListener('click', function() {
    // Limpar os campos e título para criar novo usuário
    document.getElementById('registerForm').reset();
    document.getElementById('modalTitle').textContent = "Registrar Usuário";
    document.getElementById('userModal').style.display = "block";  // Exibe o modal
});

// Fechar o modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('userModal').style.display = "none";  // Esconde o modal
});

// Função para abrir o modal de editar usuário
function openEditModal(userId) {
    fetch(`http://127.0.0.1:8000/api/users/${userId}`)
        .then(response => response.json())
        .then((data) => {
            user = data.user;
            // Preencher o formulário com os dados do usuário para edição
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('password').value = '';  // Não preencher senha
            document.getElementById('passwordConfirmation').value = '';  // Não preencher senha
            document.getElementById('userId').value = user.id;  // Preencher o campo oculto com o userId
            document.getElementById('modalTitle').textContent = "Editar Usuário";
            document.getElementById('userModal').style.display = "block";  // Exibe o modal
        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
            alert('Erro ao carregar dados do usuário');
        });
}

// Função para salvar o novo usuário ou editar um existente
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId') ? document.getElementById('userId').value : null;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;

    // Validação básica
    if (password !== passwordConfirmation) {
        alert("As senhas não coincidem!");
        return;
    }

    const user = {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
    };

    const url = userId ? `http://127.0.0.1:8000/api/users/${userId}` : 'http://127.0.0.1:8000/api/register';

    try {
        const response = await fetch(url, {
            method: userId ? 'PUT' : 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            // Registro bem-sucedido
            alert('Registrado com sucesso!');
            window.location.href = 'index.html';
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
                errorContainer.innerHTML = '<p>Erro desconhecido.</p>';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorContainer.innerHTML = '<p>Falha ao tentar se conectar na API.</p>';
    }

});

// Função para renderizar usuários na tabela e adicionar botões de editar
function renderUsers(users) {
    const userContainer = document.getElementById('usersTable');
    if (userContainer) {
        const tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr data-id="${user.id}">
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>
                                <a href="#" class="edit-btn" onclick="openEditModal(${user.id})">Editar</a>
                                <a href="#" class="delete-btn" onclick="deleteUser(${user.id})">Excluir</a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        userContainer.innerHTML = tableHTML;
        addTableActions();
    }
}

// Adicionar ações de edição e exclusão para a tabela
function addTableActions() {
    const userContainer = document.getElementById('usersTable');
    userContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains('edit-btn')) {
            const userId = target.closest('tr').dataset.id;
            openEditModal(userId);
        }

        if (target.classList.contains('delete-btn')) {
            const userId = target.closest('tr').dataset.id;
            deleteUser(userId);
        }
    });
}

// Função para carregar usuários da API
function loadUsers() {
    const loadingElement = document.getElementById('loading');
    const usersTable = document.getElementById('usersTable');

    // Exibe o loading
    loadingElement.style.display = "block";
    usersTable.style.display = "none";

    fetch('http://127.0.0.1:8000/api/users')
        .then(response => response.json())
        .then(data => {
            renderUsers(data.users);
            loadingElement.style.display = "none"; // Esconde o loading
            usersTable.style.display = "block"; // Exibe a tabela
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            loadingElement.style.display = "none"; // Esconde o loading
            usersTable.style.display = "block"; // Exibe a tabela mesmo que vazia
            alert("Erro ao carregar os usuários.");
        });
}


// Função para excluir um usuário
function deleteUser(userId) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        fetch(`http://127.0.0.1:8000/api/users/${userId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert('Usuário excluído com sucesso!');
                loadUsers();  // Recarregar a lista de usuários após exclusão
            })
            .catch(error => {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir o usuário');
            });
    }
}

// Inicializar a lista de usuários quando a página for carregada
window.onload = loadUsers;
