/**
 * Training Project
 * Source: flexcourses.com
 * */

const NotesObj = new Notes();
window.onload = getAllNotes;

let notesArea = document.getElementById('notes');

reverseBtn.onclick = reverseOrder;
clearAllBtn.onclick = clearAllNotes;

async function clearAllNotes(){

    if(confirm('Are you sure?')){
        let request = await NotesObj.clear();
        request.onsuccess = () => {
            notesArea.innerHTML = '';
        }
    }else{
        return false;
    }


}

function reverseOrder(){
    NotesObj.reverseOrder = !NotesObj.reverseOrder;
    getAllNotes();
}

document.addEventListener('submit', (e) => {
    e.preventDefault();
    let target = e.target;

    if(target && target.classList.contains('add-note')){
        addNote(target);
    }else if(target && target.classList.contains('update-note')){
        let note = {
            id: parseInt(target.dataset.id),
            text: target.querySelector('textarea').value
        };

        updateNote(note);
    }

})

document.addEventListener('click', (e) => {

    let {target} = e;
    if(target && target.classList.contains('delete')){
        let noteId = parseInt(target.dataset.id);
        deleteNote(noteId)
    }else if(target && target.classList.contains('edit')){
        // let noteId = parseInt(target.dataset.id);
        // deleteNote(noteId)
        editNote(target)
    }

})

async function addNote(target){
    let textarea = target.querySelector('textarea');
    let newNote = textarea.value;

    let add = await NotesObj.add({text: newNote});
    add.onsuccess = () => {
        getAllNotes();
        textarea.value = '';
    }
}

async function deleteNote(noteId){

    if(confirm('Are you sure?')){
        let deleteRequest = await NotesObj.delete(noteId);

        deleteRequest.onsuccess = () => {
            document.getElementById('note-'+noteId).remove()
        };

        deleteRequest.onerror = () => {
            alert('Error while delete');
        }
    }else{
        return false;
    }


}

function editNote(note){
    let noteContainer = document.getElementById('note-'+note.dataset.id);
    let oldText = noteContainer.querySelector('.text').innerText;
    let form = `<form class="update-note" data-id="${note.dataset.id}">
                <textarea>${oldText}</textarea>
                <button class="btn" type="submit">??????????</button>
                </form>`;
    noteContainer.innerHTML = form;
}

async function updateNote(note){
    let updateRequest = await NotesObj.update(note);
    updateRequest.onsuccess = getAllNotes;
}

async function getAllNotes(){

    let request = await NotesObj.all();
    let notesArray = [];

    request.onsuccess = () => {

        let cursor = request.result;

        if(cursor){
            notesArray.push(cursor.value);
            cursor.continue()
        }else{
            displayNotes(notesArray)
        }
    }
}

function displayNotes(notes){

    let ULElement = document.createElement('ul');

    for(let i = 0; i < notes.length; i++){

        let LIElement = document.createElement('li');
        let note = notes[i];
        LIElement.className = 'note';
        LIElement.id = 'note-'+note.id;
        LIElement.innerHTML = `
        <div class="">
        <img src="imgs/edit-icon.png" class="edit" data-id="${note.id}" alt="">
        <img src="imgs/delete-icon.png" class="delete" data-id="${note.id}" alt="">
        </div>
        <div class="text">${note.text}</div>
        `;

        ULElement.append(LIElement);

    }

    notesArea.innerHTML = '';
    notesArea.append(ULElement)


}


async function clearAll(){
    let request = await NotesObj.clear();
}

let mybutton =document.getElementById("Btn");

window.onscroll = function() {scrollFunction()};

function scrollFunction(){
    if (document.body.scrollTop > 20 || 
    document.documentElement.scrollTop > 20){
        mybutton.style.display = "block";
    } else{
        mybutton.style.display = "none";
    }
}

function topFunction(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}