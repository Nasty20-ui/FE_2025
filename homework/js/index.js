const userContainer = document.querySelector('#user-container');
const loadingIndicator = document.querySelector('#loading-indicator');
const form = document.createElement('form');
form.className = 'user-form';
form.style.display = 'none';
const nameField = document.createElement('input');
nameField.type = 'text';
const emailField = document.createElement('input');
emailField.type = 'email';
const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.textContent = 'Update';
const cancelBtn = document.createElement('button');
cancelBtn.type = 'button';
cancelBtn.textContent = 'Cancel';
cancelBtn.addEventListener('click', () => hideForm());

form.append(nameField, emailField, submitBtn, cancelBtn);
userContainer.before(form);
let currentUserId = null;
let currentCard = null;

function toggleLoading(state = true) {
  loadingIndicator.style.display = state ? 'block' : 'none';
}

function showForm() {
  form.style.display = 'flex';
  form.scrollIntoView({ behavior: 'smooth' });
}

function hideForm() {
  form.style.display = 'none';
  form.reset();
  currentUserId = null;
  currentCard = null;
}

function openForm(user, card) {
  currentUserId = user.id;
  currentCard = card;
  nameField.value = user.name;
  emailField.value = user.email;
  showForm();
}

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const name = nameField.value.trim();
  const email = emailField.value.trim();

  if (!name || !email || !currentUserId) {
return;
}

  updateUser(currentUserId, name, email);
});

async function updateUser(id, name, email) {
  toggleLoading(true);
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    if (!response.ok) {
throw new Error('Update failed');
}

    const updatedUser = await response.json();
    if (currentCard) {
      currentCard.querySelector('.fullname').textContent = updatedUser.name;
      currentCard.querySelector('.email-address').textContent = updatedUser.email;
    }

    hideForm();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert('An error occurred while updating.');
  } finally {
    toggleLoading(false);
  }
}

function createCard(user) {
  const card = document.createElement('li');
  card.className = 'profile-card';

  const name = document.createElement('p');
  name.className = 'fullname';
  name.textContent = user.name;

  const email = document.createElement('p');
  email.className = 'email-address';
  email.textContent = user.email;

  const edit = document.createElement('button');
  edit.textContent = 'Edit';
  edit.onclick = () => openForm(user, card);

  const remove = document.createElement('button');
  remove.textContent = 'Delete';
  remove.onclick = async () => {
    toggleLoading(true);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
throw new Error('Delete failed');
}
      card.remove();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error deleting user.');
    } finally {
      toggleLoading(false);
    }
  };

  card.append(name, email, edit, remove);
  userContainer.append(card);
}

async function loadUsers() {
  toggleLoading(true);
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();
    users.forEach(createCard);
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert('Failed to load users.');
  } finally {
    toggleLoading(false);
  }
}

document.addEventListener('DOMContentLoaded', loadUsers);
