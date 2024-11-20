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
        
        const color = card.classList.contains('blue') 
        ? 'blue'
        : card.classList.contains('yellow')
            ? 'yellow'
            :card.classList.contains('red')
                ? 'red'
                : 'default'
        
        if (title || comment || value) {
            cards.push({ title, comment, value, color });
        }
    });
    
    localStorage.setItem('cards', JSON.stringify(cards))
}

function loadFromLocalStorage() {
    const saveCards = JSON.parse(localStorage.getItem('cards')) || [];
    saveCards.forEach(cardData => {
        createChores(cardData.title, cardData.comment, cardData.value, cardData.color);
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
    
    //add event edit title
    cardTitle.addEventListener('click', function() {
        editCardTitle(cardTitle)
    })
    
    //card content
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body')
    card.appendChild(cardBody);
    
    //cria comment box
    const commentBox = document.createElement('textarea')
    commentBox.classList.add('comment-box')
    commentBox.placeholder = 'More details...'
    cardBody.appendChild(commentBox)
    
    commentBox.addEventListener('input', saveToLocalStorage);
    
    //footer card
    const cardFooter = document.createElement('div')
    cardFooter.classList.add('card-footer');
    card.appendChild(cardFooter)
    
    //div for btns
    const btnPanel = document.createElement('div')
    btnPanel.classList.add('button-panel');
    cardBody.appendChild(btnPanel)
    
    //cria btns cor
    
    const colors = ['default', 'blue', 'yellow', 'red'];
    colors.forEach(color => {
        const btnColor = document.createElement('button');
        btnColor.classList.add('color-button', color)
        btnColor.setAttribute('data-color', color)
        btnPanel.appendChild(btnColor)
        
        btnColor.addEventListener('click', function() {
            const selectedColor = this.getAttribute('data-color');
            card.classList.remove('blue', 'yellow', 'red', 'default')
            card.classList.add(selectedColor);
            saveToLocalStorage();
        })
    })    
    
    return card
}

inputChores.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        if (!inputChores.value) return;
        createChores(inputChores.value);
    }
});

function editCardTitle(titleElement) {
    const currentTitle = titleElement.textContent;
    
    //edit title
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.classList.add('input', 'input-edit');
    
    titleElement.replaceWith(input)
    
    input.focus();
    
    input.addEventListener('blur', function() {
        const newTitle = input.value.trim() || currentTitle;
        titleElement.textContent = newTitle;
        input.replaceWith(titleElement);
        saveToLocalStorage();
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
}

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

function newBtnRemind(card) {
    const cardFooter = card.querySelector('.card-footer');
    
    //cria o btn
    const btnRemind = document.createElement('button');
    btnRemind.innerText = 'icon';
    btnRemind.setAttribute('class', 'calendar button');
    
    cardFooter.appendChild(btnRemind);
}

function clearInput() {
    inputChores.value = '';
    inputChores.focus();
}

function createChores(textInput, savedComment = '', savedValue = '', savedColor = 'default') {
   
    const card = createCard();
    const cardTitle = card.querySelector('.card-title');
    cardTitle.textContent = textInput;
    
    const commentBox = card.querySelector('.comment-box')
    commentBox.value = savedComment;
    
    card.classList.remove('default', 'blue', 'yellow', 'red');
    card.classList.add(savedColor)
    
    chores.appendChild(card)
    
    createCell(card, savedValue)
    newBtnRemind(card);
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
    valueInput.addEventListener('input', () => {
        updateTotal();
        saveToLocalStorage();
    });  
    
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