const express = require("express");
const router = express.Router();
const TodoTask = require("../models/todoTasks.js");
let isSorted = false;
let typeOfSort = "date";
let displayNone = "";

router.get("/", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page || 1;
  const allTodos = await TodoTask.find().countDocuments();
  const todosPerPage = 4;
  const totalPages = Math.ceil(allTodos / todosPerPage);
  const todosToShow = todosPerPage * page;
  await TodoTask.find()
    .limit(todosToShow)
    .sort([[typeOfSort, sorted]])
    .exec(function (err, tasks) {
      res.render("todo.ejs", {
        sorted,
        page,
        allTodos,
        totalPages,
        todosToShow,
        todosPerPage,
        todoTasks: tasks,
        displayNone,
      });
    });
  let sortList = req.query.sorted;
  if (sortList) {
    isSorted = true;
  }
  if (allTodos === 0) {
    isSorted = false;
  }
  if (allTodos <= 4) {
    displayNone = "display-none";
  }
  if (allTodos > 4) {
    displayNone = "";
  }
});

router.post("/", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = req.query.page;
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/?page=" + page + "&&sorted=" + sorted);
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/remove/:id", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  await TodoTask.deleteOne({ _id: req.params.id });
  let dataLength = await TodoTask.find().countDocuments();
  if (dataLength <= 4) {
    res.redirect("/?page=" + 1 + "&&sorted=" + sorted);
  }
  if (dataLength > 4 && dataLength % 4 >= 1) {
    res.redirect("/?page=" + page + "&&sorted=" + sorted);
  }
  if (dataLength > 4 && dataLength % 4 === 0) {
    res.redirect("/?page=" + (page - 1) + "&&sorted=" + sorted);
  }
});

router
  .get("/edit/:id", (req, res) => {
    let sorted = +req.query.sorted || 1;
    let page = +req.query.page;
    const id = req.params.id;
    const todosPerPage = 4;
    const todosToShow = todosPerPage * page;
    TodoTask.find({})
      .limit(todosToShow)
      .sort([[typeOfSort, sorted]])
      .exec(function (err, tasks) {
        res.render("editTodo.ejs", {
          todoTasks: tasks,
          idTask: id,
          page,
          sorted,
        });
      });
  })
  .post("/edit/:id", async (req, res) => {
    let sorted = +req.query.sorted || 1;
    let page = +req.query.page;
    const id = req.params.id;
    await TodoTask.findByIdAndUpdate(id, {
      content: req.body.content,
    });
    await res.redirect("/?page=" + page + "&&sorted=" + sorted);
  });

router.get("/checked/:id", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  const id = req.params.id;
  const todo = await TodoTask.findById(id);

  if (todo.checked == true) {
    todo.checked = false;
    todo.class = "";
    todo.save();
  } else {
    todo.checked = true;
    todo.class = "checked";
    todo.save();
  }
  await res.redirect("/?page=" + page + "&&sorted=" + sorted);
});

router.get("/cancelEdit", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  await res.redirect("/?page=" + page + "&&sorted=" + sorted);
});

router.get("/showmore", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  let totalPages = +req.query.totalPages;
  if (totalPages === 0) {
    res.redirect("/");
  }
  await res.redirect("/?page=" + (page + 1) + "&&sorted=" + sorted);
});

router.get("/showless", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  await res.redirect("/?page=1&&sorted=" + sorted);
});

router.post("/sort", (req, res) => {
  let value = req.body.example;
  if (value == "oldFirst") {
    typeOfSort = "date";
    value = 1;
  }
  if (value == "newFirst") {
    typeOfSort = "date";
    value = -1;
  }
  if (value == "az") {
    typeOfSort = "content";
    value = 1;
  }
  if (value == "za") {
    typeOfSort = "content";
    value = -1;
  }

  res.redirect("/?sorted=" + value);
});
module.exports = router;
