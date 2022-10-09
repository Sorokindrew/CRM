(() => {

    // функция создания строки с информацией о клиенте и кнопками изменить / удалить
    function createClientString(client, { onEdit, onDelete, onUpdate }) {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.textContent = client.id;
        cell1.style = "font-size: 12px; line-height: 16px; color: #B0B0B0;"
        const cell2 = document.createElement('td');
        cell2.textContent = client.surname + ' ' + client.name + ' ' + client.lastName;
        const cell3 = document.createElement('td');
        const createdSpan = document.createElement('span');
        cell3.textContent = formatDate(client.createdAt).date;
        createdSpan.textContent = formatDate(client.createdAt).time;
        createdSpan.style.color = '#B0B0B0';
        createdSpan.style.paddingLeft = '7px';
        cell3.append(createdSpan);
        const cell4 = document.createElement('td');
        const updatedSpan = document.createElement('span');
        cell4.textContent = formatDate(client.updatedAt).date;
        updatedSpan.textContent = formatDate(client.updatedAt).time;
        updatedSpan.style.color = '#B0B0B0';
        updatedSpan.style.paddingLeft = '7px';
        cell4.append(updatedSpan);
        const cell5 = document.createElement('td');
        const contactList = client.contacts;
        if (contactList.length > 0) {
            contactList.forEach(el => {
                const contactIcon = document.createElement('div');
                contactIcon.classList.add('contact-icon');
                if (el.type == 'Телефон' || el.type == 'Доп. телефон') {
                    contactIcon.style = "background-image: url('../assets/img/phone.svg');";
                }
                else if (el.type == 'Email') {
                    contactIcon.style = "background-image: url('../assets/img/mail.svg');";
                }
                else if (el.type == 'Facebook') {
                    contactIcon.style = "background-image: url('../assets/img/fb.svg');";
                }
                else if (el.type == 'Vk') {
                    contactIcon.style = "background-image: url('../assets/img/vk.svg');";
                }
                else {
                    contactIcon.style = "background-image: url('../assets/img/other.svg');";
                }
                tippy(contactIcon, {
                    content: `${el.type}: ${el.value}`
                });
                cell5.style.display = 'flex';
                cell5.style.alignItems = 'center';
                cell5.style.flexWrap = 'wrap';
                cell5.style.paddingRight = '40px';
                cell5.append(contactIcon);
            });
        }
        const cell6 = document.createElement('td');
        const buttonWrapper = document.createElement('div');
        const editClientButton = document.createElement('button');
        // <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        // const editButtonSpinner = document.createElement('span');
        // editButtonSpinner.classList.add('spinner-border', 'spinner-border-sm', 'text-secondary');
        // editButtonSpinner.setAttribute('role', 'status')
        editClientButton.textContent = 'Изменить';
        editClientButton.id = 'btn-edit';
        editClientButton.classList.add('btn-reset', 'btn-edit');
        // editClientButton.appendChild(editButtonSpinner);
        editClientButton.addEventListener('click', () => {
            modalEdit(client, { onEdit, onUpdate, onDelete, element: row });
        });
        const deleteClientButton = document.createElement('button');
        deleteClientButton.textContent = 'Удалить';
        deleteClientButton.id = 'btn-delete';
        deleteClientButton.classList.add('btn-reset', 'btn-delete');
        deleteClientButton.addEventListener('click', () => {
            modalDelete(client, { onDelete, element: row });

        });
        buttonWrapper.append(editClientButton, deleteClientButton);
        cell6.append(buttonWrapper);
        row.append(cell1, cell2, cell3, cell4, cell5, cell6)

        return row;
    };


    //создание модального окна и формы
    function modal() {
        document.body.style.overflowY = 'hidden';
        const modal = document.createElement('div');
        const modalContent = document.createElement('div');
        const form = document.createElement('form');
        const titleBlock = document.createElement('div');
        const errorBlock = document.createElement('div');
        const closeButton = document.createElement('button');
        const cancelButton = document.createElement('button');
        const deleteClientButton = document.createElement('button');
        modal.classList.add('modal-window');
        modalContent.classList.add('modal-content')
        form.classList.add('modal-form');
        form.id = 'modal-form';
        errorBlock.id = 'errorBlock';
        titleBlock.classList.add('modal-title');
        closeButton.classList.add('close-button', 'btn-reset');
        closeButton.type = 'button';
        cancelButton.textContent = 'Отмена';
        cancelButton.classList.add('btn-reset', 'cancel-button');
        cancelButton.type = 'button'
        deleteClientButton.textContent = 'Удалить клиента';
        deleteClientButton.classList.add('btn-reset', 'delete-button');
        deleteClientButton.type = 'button'
        form.append(titleBlock);
        form.append(errorBlock);
        form.append(closeButton);
        form.append(cancelButton);
        form.append(deleteClientButton);
        modalContent.append(form);
        modal.append(modalContent);
        modalContent.setAttribute('data-simplebar', true);
        document.body.append(modal);

        closeButton.addEventListener('click', () => {
            modal.remove()
            document.body.style.overflowY = 'scroll';

        });

        cancelButton.addEventListener('click', () => {
            modal.remove()
            document.body.style.overflowY = 'scroll';

        });
    }


    //модальное окно создания нового клиента
    function modalCreate({ onSave }) {
        const inputClass = 'modal-input';
        const inputFieldLabel = 'input-label'
        modal();
        const modalWindow = document.querySelector('.modal-window');
        const saveButton = document.createElement('button');
        const contactSection = document.createElement('div');
        const addContactButton = document.createElement('button');
        const nameLabel = document.createElement('label');
        const name = document.createElement('input');
        const surnameLabel = document.createElement('label');
        const surname = document.createElement('input');
        const lastNameLabel = document.createElement('label');
        const lastName = document.createElement('input');

        saveButton.textContent = 'Сохранить';
        const titleBlock = document.querySelector('.modal-title');
        titleBlock.textContent = 'Новый клиент';
        name.classList.add(inputClass);
        surname.classList.add(inputClass);
        lastName.classList.add(inputClass);
        nameLabel.classList.add(inputFieldLabel);
        surnameLabel.classList.add(inputFieldLabel);
        lastNameLabel.classList.add(inputFieldLabel);

        saveButton.classList.add('save-button', 'btn-reset');
        contactSection.classList.add('contact-section');
        addContactButton.textContent = 'Добавить контакт';
        addContactButton.classList.add('btn-reset', 'btn-add-contact')
        addContactButton.type = 'button';
        surname.placeholder = 'Фамилия*';
        surname.required = true;
        name.placeholder = 'Имя*';
        name.required = true;
        nameLabel.append(name);
        surnameLabel.append(surname);
        lastNameLabel.append(lastName);
        lastName.placeholder = 'Отчество';
        titleBlock.after(lastNameLabel);
        titleBlock.after(nameLabel);
        titleBlock.after(surnameLabel);
        contactSection.append(addContactButton);
        lastName.after(contactSection);
        const errorBlock = document.getElementById('errorBlock')
        errorBlock.after(saveButton);
        const deleteClientButton = document.querySelector('.delete-button');
        deleteClientButton.style.display = 'none';

        addContactButton.addEventListener('click', () => {
            addContactButton.before(addContactField());
        });

        name.addEventListener('focus', () => {
            errorBlock.innerHTML = '';
            name.classList.remove('invalid');
            surname.classList.remove('invalid');
            if (!nameLabel.textContent.includes('Имя*')) {
                name.before('Имя*');
            }
            name.focus();
            name.select();
        })
        surname.addEventListener('focus', () => {
            errorBlock.innerHTML = '';
            name.classList.remove('invalid');
            surname.classList.remove('invalid');
            if (!surnameLabel.textContent.includes('Фамилия*')) {
                surname.before('Фамилия*');
            }
            surname.focus();
            surname.select();
        })
        lastName.addEventListener('focus', () => {
            errorBlock.innerHTML = '';
            name.classList.remove('invalid');
            surname.classList.remove('invalid');
            if (!lastNameLabel.textContent.includes('Отчество')) {
                lastName.before('Отчество');
            }
            lastName.focus();
            lastName.select();
        })

        saveButton.addEventListener('click', async (e) => {
            e.preventDefault();
            let contacts = [];
            let arr = Array.from(document.querySelectorAll('.contact-wrapper'));
            arr.forEach(el => {
                let contactType = el.querySelector('.contact-type').value;
                let contactValue = el.querySelector('.contact-value').value;
                contacts.push({ type: contactType, value: contactValue });
            });
            let client = {
                'name': name.value,
                'surname': surname.value,
                'lastName': lastName.value,
                'contacts': contacts,
            };
            let check = checkInput({ name, surname })
            if (check)
                errorBlock.innerHTML = check;

            else
                onSave({ client, element: modalWindow });
        });

    };

    //модальное окно редактирования данных клиента
    async function modalEdit(client, { onEdit, onUpdate, onDelete, element }) {
        const inputClass = 'modal-input';
        modal();
        let clientData = await onEdit(client);
        const modalWindow = document.querySelector('.modal-window');
        const saveButton = document.createElement('button');
        const contactSection = document.createElement('div');
        const addContactButton = document.createElement('button');
        const name = document.createElement('input');
        const surname = document.createElement('input');
        const lastName = document.createElement('input');
        saveButton.textContent = 'Сохранить';
        const titleBlock = document.querySelector('.modal-title');
        titleBlock.textContent = 'Изменить данные ';
        const id = document.createElement('span');
        id.textContent = `ID: ${client.id}`;
        id.classList.add('span-id');
        titleBlock.append(id);
        name.classList.add(inputClass);
        surname.classList.add(inputClass);
        lastName.classList.add(inputClass);
        saveButton.classList.add('save-button', 'btn-reset');
        contactSection.classList.add('contact-section');
        addContactButton.textContent = 'Добавить контакт';
        addContactButton.classList.add('btn-reset', 'btn-add-contact')
        addContactButton.type = 'button';
        // surname.placeholder = 'Фамилия*';
        surname.value = clientData.surname;
        surname.required = true;
        // name.placeholder = 'Имя*';
        name.value = clientData.name;
        // lastName.placeholder = 'Отчество';
        lastName.value = clientData.lastName;
        titleBlock.after(lastName);
        titleBlock.after(name);
        titleBlock.after(surname);
        contactSection.append(addContactButton);
        lastName.after(contactSection);
        contactSection.after(saveButton);
        const cancelButton = document.querySelector('.cancel-button');
        const deleteClientButton = document.querySelector('.delete-button');
        cancelButton.style.display = 'none';
        console.log(deleteClientButton)

        deleteClientButton.addEventListener('click', () => {
            const modal = document.querySelector('.modal-window');
            modal.remove();
            document.body.style.overflowY = 'scroll';

            modalDelete(client, { onDelete, element });
        });


        let contactList = client.contacts;
        contactList.forEach(contact => {
            addContactButton.before(addContactField({ contact }));
        })

        addContactButton.addEventListener('click', () => {
            addContactButton.before(addContactField());
        });

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            let contacts = [];
            let arr = Array.from(document.querySelectorAll('.contact-wrapper'));
            arr.forEach(el => {
                let contactType = el.querySelector('.contact-type').value;
                let contactValue = el.querySelector('.contact-value').value;
                contacts.push({ type: contactType, value: contactValue });
            });

            let clientUpdate = {
                id: `${clientData.id}`,
            };
            if (clientData.name != name.value) {
                clientUpdate.name = name.value;
            }
            if (clientData.surname != surname.value) {
                clientUpdate.surname = surname.value;
            }
            if (clientData.lastName != lastName.value) {
                clientUpdate.lastName = lastName.value;
            }
            if (contacts.length != clientData.contacts.length) {
                clientUpdate.contacts = contacts;
            }
            else if (ifContactChanged(clientData.contacts, contacts)) {
                clientUpdate.contacts = contacts;
            }
            else console.log('contacts do not change');
            element.remove();
            onUpdate({ clientUpdate, element: modalWindow });
        });

    };

    //модальное окно удаления клиента
    function modalDelete(client, { onDelete, element }) {
        modal();
        const modalWindow = document.querySelector('.modal-window');
        const titleBlock = document.querySelector('.modal-title');
        titleBlock.textContent = 'Удалить клиента';
        titleBlock.style = 'text-align: center';
        const confirmMessage = document.createElement('div');
        confirmMessage.textContent = 'Вы действительно хотите удалить данного клиента?';
        confirmMessage.classList.add('confirm-message');
        const deleteClientConfirm = document.createElement('button');
        deleteClientConfirm.classList.add('btn-reset', 'btn-delete-confirm');
        deleteClientConfirm.type = 'button';
        deleteClientConfirm.textContent = 'Удалить';
        const deleteClientButton = document.querySelector('.delete-button');
        deleteClientButton.style.display = 'none';
        deleteClientConfirm.addEventListener('click', () => {
            element.remove();
            onDelete({ client, element: modalWindow });
        });
        const cancelButton = document.querySelector('.cancel-button');
        titleBlock.after(confirmMessage);
        cancelButton.before(deleteClientConfirm);
    }


    //Преобразование даты и времени из ISOstring
    function formatDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return {
            date: day + '.' + month + '.' + date.getFullYear(),
            time: hours + ':' + minutes
        };
    };


    //функция проверки изменения контактов
    function ifContactChanged(contacts, contactsNew) {
        for (let contact of contacts) {
            let isFound = false;
            for (let newContact of contactsNew) {
                if (contact.type == newContact.type && contact.value == newContact.value) isFound = true;
            }
            if (!isFound) return true;
        }
        return false
    }


    //Функция добавления контакта
    function addContactField({ contact } = {}) {
        const contactWrapper = document.createElement('div');
        contactWrapper.classList.add('contact-wrapper');

        const select = document.createElement('select');
        select.classList.add('contact-type');


        const phone = document.createElement('option');
        const addPhone = document.createElement('option');
        const email = document.createElement('option');
        const vk = document.createElement('option');
        const fb = document.createElement('option');
        const other = document.createElement('option');
        phone.textContent = 'Телефон';
        phone.value = 'Телефон';
        addPhone.textContent = 'Доп. телефон';
        addPhone.value = 'Доп. телефон';
        email.textContent = 'Email';
        email.value = 'Email';
        vk.textContent = 'Vk';
        vk.value = 'Vk';
        fb.textContent = 'Facebook';
        fb.value = 'Facebook';
        other.textContent = 'Другое';
        other.value = 'Другое';
        select.append(phone, addPhone, email, vk, fb, other);

        const contactValue = document.createElement('input');
        contactValue.classList.add('contact-value')
        const deleteContactButton = document.createElement('button');
        deleteContactButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"/>
        </svg>`;


        deleteContactButton.classList.add('btn-reset', 'contact-delete-button')
        deleteContactButton.style.width = '27px';
        deleteContactButton.style.height = '37px';
        tippy(deleteContactButton, {
            content: `Удалить контакт`
        });
        deleteContactButton.addEventListener('click', () => {
            contactWrapper.remove()
        });
        if (contact) {
            select.value = contact.type;
            contactValue.value = contact.value;
        };

        contactWrapper.append(select, contactValue, deleteContactButton);
        const choices = new Choices(select, {
            searchEnabled: false,
            shouldSort: false,
            itemSelectText: '',
        });
        return contactWrapper;
    }
    //запрос данных с сервера
    async function getData() {
        //запрос актуальной информации с данными существующих клиентов с сервера
        const response = await fetch('http://localhost:3000/api/clients')
        const spinner = document.getElementById('spinner');
        if (response) spinner.style.display = 'none';
        return await response.json();
    }
    //поиск данных по введенному значению
    async function searchData(searchString, body) {
        const response = await fetch(`http://localhost:3000/api/clients?search=${searchString}`);
        const data = await response.json();
        body.innerHTML = '';
        renderData({ data, body })
    }

    //Функция валидация полей формы ФИО клиента
    function checkInput({ name, surname }) {
        let response = '';
        const regEx = /[А-ЯA-Z][а-яa-z]+/;
        if (!name.value) response = response + 'Задайте имя клиента<br>';
        else if (name.value.length < 4) response = response + 'Имя должно быть более трех символов<br>';
        else if (!name.value.match(/^[А-ЯA-Z]/)) response = response + 'Имя должно начинаться с заглавной буквы<br>';
        else if (!name.value.match(regEx)) response = response + 'Имя должно содержать только буквы<br>';
        if (!surname.value) response = response + 'Задайте фамилию клиента<br>';
        else if (surname.value.length < 4) response = response + 'Фамилия должна быть более трех символов<br>';
        else if (!surname.value.match(/^[А-ЯA-Z]/)) response = response + 'Фамилия должна начинаться с заглавной буквы<br>';
        else if (!surname.value.match(regEx)) response = response + 'Фамилия должна содержать только буквы<br>';
        if (response.includes('Имя') || response.includes('имя')) name.classList.add('invalid');
        if (response.includes('Фамилия') || response.includes('фамилию')) surname.classList.add('invalid');
        let contactSelectToCheck = Array.from(document.querySelectorAll('.contact-type'));
        let contactValueToCheck = Array.from(document.querySelectorAll('.contact-value'));
        for (let index = 0; index < contactSelectToCheck.length; index++) {
            if (contactSelectToCheck[index].value == 'Email') {
                const regExEmail = /\w+@\w+.[^0-9_\s\W]{2,4}/;
                if (!contactValueToCheck[index].value.match(regExEmail)) response = response + 'Неверный формат электронной почты<br>';
            }
            else if (contactSelectToCheck[index].value == 'Телефон' || contactSelectToCheck[index].value == 'Доп. телефон') {
                const regExPhone = /\+7 \([0-9]{3,5}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/;
                if (!contactValueToCheck[index].value.match(regExPhone)) response = response + 'Введите телефон в формате +7 (495) 333-33-33<br>';

            }
        }


        if (response) return response;
    }


    //функция отрисовки данных таблицы
    function renderData({ data, body }) {
        //построение таблицы клиентов
        data.forEach(client => {
            const clientString = createClientString(client, handlers);
            body.append(clientString);
        });
    };


    //функция сортировки и изменения иконки порядка сортировки
    function sortData(data, value) {
        const svg = document.getElementById(`${value}-svg`);
        //сортировка по возрастанию 
        if (svg._sort == 'down' || !svg._sort) {
            svg._sort = 'up';
            svg.style = 'transform: none;';
            if (value == 'id') {
                data.sort((prev, next) => prev[`${value}`] - next[`${value}`]);
            }
            else {
                data.sort((prev, next) => {
                    if (prev[`${value}`] < next[`${value}`]) return -1;
                    else if (prev[`${value}`] > next[`${value}`]) return 1;
                    else {
                        if (value == 'surname') {
                            if (prev.name < next.name) return -1;
                            else if (prev.name > next.name) return 1;
                            else {
                                if (prev.lastName < next.lastName) return -1;
                                else if (prev.lastName > next.lastName) return 1;
                                else return 0;
                            }
                        }
                    };
                })
            }
        }
        //сортировка по убыванию 
        else {
            svg.style = 'transform: rotate(180deg); transform-origin: center;';
            svg._sort = 'down';
            if (value == 'id') {
                data.sort((prev, next) => next[`${value}`] - prev[`${value}`]);
            }
            else {
                data.sort((prev, next) => {
                    if (prev[`${value}`] < next[`${value}`]) return 1;
                    else if (prev[`${value}`] > next[`${value}`]) return -1;
                    else {
                        if (value == 'surname') {
                            if (prev.name < next.name) return 1;
                            else if (prev.name > next.name) return -1;
                            else {
                                if (prev.lastName < next.lastName) return 1;
                                else if (prev.lastName > next.lastName) return -1;
                                else return 0;
                            }
                        }
                    };
                })

            }
        }
    }





    //Функция создания приложения
    async function createClientDb(body) {
        handlers = {
            async onEdit(client) {
                const response = await fetch(`http://localhost:3000/api/clients/${client.id}`)
                const data = await response.json();
                return data
            },

            async onUpdate({ clientUpdate, element }) {
                const response = await fetch(`http://localhost:3000/api/clients/${clientUpdate.id}`, {
                    method: "PATCH",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify(clientUpdate),
                });
                if (response.status == 200 || response.status == 201) {
                    element.remove();
                    const clientData = await response.json();
                    body.append(createClientString(clientData, handlers));
                }
                else {
                    console.log()
                }
            },
            async onSave({ client, element }) {

                const response = await fetch(`http://localhost:3000/api/clients/`, {
                    method: "POST",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify(client),
                });

                if (response.status == 200 || response.status == 201) {
                    element.remove();
                    const clientData = await response.json();
                    body.append(createClientString(clientData, handlers));
                };
            },
            onDelete({ client, element }) {
                element.remove()
                document.body.style.overflowY = 'scroll';
                fetch(`http://localhost:3000/api/clients/${client.id}`, {
                    method: 'DELETE',
                })
            }
        };

        let data = await getData();
        //сортировка по умолчнию (по id)
        sortData(data, 'id');
        renderData({ data, body });

        // обработчики кнопок сортировки
        const buttonSort = document.querySelectorAll('.js-sort-btn');
        buttonSort.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.id;
                data = await getData();
                buttonSort.forEach(el => {
                    el.classList.remove('js-sort-btn--active')
                });
                button.classList.add('js-sort-btn--active');
                let value = id.replace('-sort', '');
                sortData(data, value);
                body.innerHTML = '';
                renderData({ data, body });
            })
        })


        //поиск
        document.getElementById('search').addEventListener('input', () => {

            const searchTimeout = setTimeout(() => {
                let searchString = document.getElementById('search').value;
                searchData(searchString, body);
            }, 3000)
        });

        //кнопка добавления контакта
        document.getElementById('add-button').addEventListener('click', () => {
            modalCreate(handlers);
        });
    };
    window.createClientDb = createClientDb;
})();
