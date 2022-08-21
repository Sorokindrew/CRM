(() => {

    // функция создания строки с информацией о клиенте и кнопками изменить / удалить
    function createClientString(client, { onEdit, onDelete, onUpdate }) {
        let row = document.createElement('tr');
        let cell1 = document.createElement('td');
        cell1.textContent = client.id;
        let cell2 = document.createElement('td');
        cell2.textContent = client.surname + ' ' + client.name + ' ' + client.lastName;
        let cell3 = document.createElement('td');
        cell3.textContent = formatDate(client.createdAt)
        let cell4 = document.createElement('td');
        cell4.textContent = formatDate(client.updatedAt);
        let cell5 = document.createElement('td');
        const contactList = client.contacts;
        if (contactList.length > 0) {
            contactList.forEach(el => {
                const contactIcon = document.createElement('div');
                contactIcon.classList.add('contact-icon');
                if (el.type == 'Телефон' || el.type == 'Доп. телефон') {
                    contactIcon.style = "background-image: url('./assets/img/phone.svg');";
                }
                else if (el.type == 'Email') {
                    contactIcon.style = "background-image: url('./assets/img/mail.svg');";
                }
                else if (el.type == 'Facebook') {
                    contactIcon.style = "background-image: url('./assets/img/fb.svg');";
                }
                else if (el.type == 'Vk') {
                    contactIcon.style = "background-image: url('./assets/img/vk.svg');";
                }
                else {
                    contactIcon.style = "background-image: url('./assets/img/other.svg');";
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
        let cell6 = document.createElement('td');
        let buttonWrapper = document.createElement('div');
        let editClientButton = document.createElement('button');
        editClientButton.textContent = 'Изменить';
        editClientButton.id = 'btn-edit';
        editClientButton.classList.add('btn', 'btn-edit')
        editClientButton.addEventListener('click', () => {
            modalEdit(client, { onEdit, onUpdate, element: row });
        });
        let deleteClientButton = document.createElement('button');
        deleteClientButton.textContent = 'Удалить';
        deleteClientButton.id = 'btn-delete';
        deleteClientButton.classList.add('btn', 'btn-delete');
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
        const modal = document.createElement('div');
        const form = document.createElement('form');
        const titleBlock = document.createElement('div');
        const closeButton = document.createElement('button');
        const cancelButton = document.createElement('button');
        modal.classList.add('modal-window');
        form.classList.add('modal-form');
        titleBlock.classList.add('modal-title');
        closeButton.classList.add('close-button', 'btn');
        closeButton.type = 'button';
        cancelButton.textContent = 'Отмена';
        cancelButton.classList.add('btn', 'cancel-button');
        cancelButton.type = 'button'
        form.append(titleBlock);
        form.append(closeButton);
        form.append(cancelButton);
        modal.append(form);
        document.body.append(modal);

        closeButton.addEventListener('click', () => {
            modal.remove()
        });

        cancelButton.addEventListener('click', () => {
            modal.remove()
        });
    }


    //модальное окно создания нового клиента
    function modalCreate({ onSave }) {
        const inputClass = 'modal-input';
        modal();
        const modalWindow = document.querySelector('.modal-window');
        const saveButton = document.createElement('button');
        const contactSection = document.createElement('div');
        const addContactButton = document.createElement('button');
        const name = document.createElement('input');
        const surname = document.createElement('input');
        const lastName = document.createElement('input');
        saveButton.textContent = 'Сохранить';
        const titleBlock = document.querySelector('.modal-title');
        titleBlock.textContent = 'Новый клиент';
        name.classList.add(inputClass);
        surname.classList.add(inputClass);
        lastName.classList.add(inputClass);
        saveButton.classList.add('save-button', 'btn');
        contactSection.classList.add('contact-section');
        addContactButton.textContent = 'Добавить контакт';
        addContactButton.classList.add('btn', 'btn-add-contact')
        addContactButton.type = 'button';
        surname.placeholder = 'Фамилия*';
        surname.required = true;
        name.placeholder = 'Имя*';
        lastName.placeholder = 'Отчество';
        titleBlock.after(lastName);
        titleBlock.after(name);
        titleBlock.after(surname);
        contactSection.append(addContactButton);
        lastName.after(contactSection);
        contactSection.after(saveButton);

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
            let client = {
                'name': name.value,
                'surname': surname.value,
                'lastName': lastName.value,
                'contacts': contacts,
            };
            onSave({ client, element: modalWindow });
        });
    };

    //модальное окно редактирования данных клиента
    async function modalEdit(client, { onEdit, onUpdate, element }) {
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
        saveButton.classList.add('save-button', 'btn');
        contactSection.classList.add('contact-section');
        addContactButton.textContent = 'Добавить контакт';
        addContactButton.classList.add('btn', 'btn-add-contact')
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
        deleteClientConfirm.classList.add('btn', 'btn-delete-confirm');
        deleteClientConfirm.type = 'button';
        deleteClientConfirm.textContent = 'Удалить';
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
        return day + '.' + month + '.' + date.getFullYear() + ' ' + hours + ':' + minutes;
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
        select.classList.add('contact-type')
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
        deleteContactButton.type = 'button';
        deleteContactButton.classList.add('btn', 'contact-delete-button')
        deleteContactButton.style.width = '27px';
        deleteContactButton.style.height = '37px';
        deleteContactButton.addEventListener('click', () => {
            contactWrapper.remove()
        });
        if (contact) {
            select.value = contact.type;
            contactValue.value = contact.value;
        };

        contactWrapper.append(select, contactValue, deleteContactButton);
        return contactWrapper;
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
                fetch(`http://localhost:3000/api/clients/${client.id}`, {
                    method: 'DELETE',
                })
            }
        };

        //запрос информации при загрузке приложения
        const response = await fetch('http://localhost:3000/api/clients')
        const data = await response.json();
        //сортировка по умолчнию (по id)
        data.sort((prev, next)=>prev.id - next.id);
        //построение таблицы клиентов
        data.forEach(client => {
            const clientString = createClientString(client, handlers);
            body.append(clientString);
        });
        const idSort = document.querySelector('#id-sort');
        idSort.addEventListener('click', ()=>{
            data.reverse();
            body.innerHTML = "";
            data.forEach(client => {
                const clientString = createClientString(client, handlers);
                body.append(clientString);
            });
        });

        //кнопка добавления контакта
        document.getElementById('add-button').addEventListener('click', () => {
            modalCreate(handlers);
        });
    };
    window.createClientDb = createClientDb;
})();
