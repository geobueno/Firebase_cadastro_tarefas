var database = firebase.database();
var userID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
    getTasksFromDB();
    $(".add-tasks").click(addTasksClick);
});

function addTasksClick(event) {
    event.preventDefault();

    var newTask = $(".tasks-input").val();
    var taskFromDB = addTaskToDB(newTask);
    crudListItem(newTask, taskFromDB.key)
}

function addTaskToDB(text) {
    return database.ref("tasks/" + userID).push({
        text: text
    });
}

function getTasksFromDB() {
    database.ref("tasks/" + userID).once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                crudListItem(childData.text, childKey)
            });
        });
}

function crudListItem(text, key) {
    $(".tasks-list").append(`
    <li>
      <span>${text}</span>
      <button class="delete" data-task-id=${key}>Deletar</button>
      <button class="edit" data-task-id=${key}>Editar</button>
    </li>`);

    $(`button.delete[data-task-id="${key}"]`).click(function() {
        database.ref("tasks/" + userID + "/" + key).remove();
        $(this).parent().remove();
    });

    $(`button.edit[data-task-id="${key}"]`).click(function() {
        database.ref("tasks/" + userID + "/" + key).remove();
        $(this).parent().remove();
        $(".tasks-list").append(`
        <li>
        <textarea>${text}</textarea>
          <button class="delete" data-task-id=${key}>Deletar</button>
          <button class="edit" data-task-id=${key}>Update</button>
        </li>`);






    });

}