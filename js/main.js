const inputChores = document.querySelector('.input-chores')
const btnChores = document.querySelector('.btn-chores')
const chores = document.querySelector('.cards')
const totalDisplay = document.querySelector('.total');

function saveToLocalStorage() {
    const cards = []
    const cardEl = document.querySelectorAll('.card');
    cardEl.forEach(card => {
        
        const titleElement = card.querySelector('.card-title');
        const title = titleElement ? titleElement.textContent : '';
        
        const commentBox = card.querySelector('.comment-box')
        const comment = commentBox ? commentBox.value : '';
        
        const valueInput = card.querySelector('.input-cell')
        const value = valueInput ? valueInput.value : '';
        
        if (title || comment || value) {
            cards.push({ title, comment, value });
        }
    });
    
    localStorage.setItem('cards', JSON.stringify(cards))
}

function loadFromLocalStorage() {
    const saveCards = JSON.parse(localStorage.getItem('cards')) || [];
    saveCards.forEach(cardData => {
        createChores(cardData.title, cardData.comment, cardData.value);
    });
    updateTotal();
}


function createCard () {
    const card = document.createElement('div');
    card.classList.add('card');
    
    //cria titulo card
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    card.appendChild(cardTitle)
    
    //card content
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body')
    card.appendChild(cardBody);
    
    //cria comment box
    const commentBox = document.createElement('textarea')
    commentBox.classList.add('comment-box')
    commentBox.placeholder = 'More details...'
    cardBody.appendChild(commentBox)
    
    
    //footer card
    const cardFooter = document.createElement('div')
    cardFooter.classList.add('card-footer');
    card.appendChild(cardFooter)
    
    return card
}

inputChores.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        if (!inputChores.value) return;
        createChores(inputChores.value);
    }
});

function newBtnDelete(card) {
    const cardFooter = card.querySelector('.card-footer');
    
    //cria o btn
    const btnDelete = document.createElement('button');
    btnDelete.innerText = 'Delete';
    btnDelete.setAttribute('class', 'delete button');
    
    cardFooter.appendChild(btnDelete);
    
    btnDelete.addEventListener('click', function(){
        card.remove();
        updateTotal();
        saveToLocalStorage();
    });
    
}

function clearInput() {
    inputChores.value = '';
    inputChores.focus();
}

function createChores(textInput, savedComment = '', savedValue = '') {
   
    const card = createCard();
    const cardTitle = card.querySelector('.card-title');
    cardTitle.textContent = textInput;
    
    const commentBox = card.querySelector('.comment-box')
    commentBox.value = savedComment;
    
    chores.appendChild(card)
    
    createCell(card, savedValue)
    newBtnDelete(card);
    
    saveToLocalStorage();
    clearInput();       
}

function createCell(card, savedValue = '') {
    const cardFooter = card.querySelector('.card-footer')
    
    //cria cell
    const valueInput = document.createElement('input')
    valueInput.setAttribute('class', 'input input-cell')
    valueInput.type = 'text'
    valueInput.placeholder = 'R$';
    valueInput.value = savedValue;
    
    cardFooter.appendChild(valueInput)   
    valueInput.addEventListener('input', updateTotal);  
    
   /*  const numericValue = parseFloat(savedValue.replace(',', '.')) || 0;
    valueInput.value = numericValue.toFixed(2); */
  
}

function updateTotal() {
    let total = 0
    
    const inputs = document.querySelectorAll('.input-cell');
    inputs.forEach(input => {
        const value = parseFloat(input.value.replace(',', '.'))  || 0;
        total += value
    });
    
    totalDisplay.innerHTML = `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
}

btnChores.addEventListener('click', function () {
    if (!inputChores.value) return;
    createChores(inputChores.value);
});

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    updateTotal()
});