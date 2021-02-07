const express = require("express");
const router = express.Router();
const Todos = require("../models/todos");
const User = require("../models/user");
const cron = require("node-cron");

router.get("/todolists/:userId", (req, res) => {
  Todos.find({ creator: req.params.userId })
    .distinct("title")
    .then((todolist) => {
      console.log(todolist);
      res.status(200).json({
        todos: todolist,
      });
    });
});

router.get("/alltodos/:userId", (req, res) => {
  Todos.find({ creator: req.params.userId }).then((todolist) => {
    console.log(todolist);
    res.status(200).json({
      todosData: todolist,
    });
  });
});

router.post("/addTodo/", (req, res, next) => {
  const todo = new Todos(req.body.newtask);
  console.log(req.body.newtask.creator);
  const userId = req.body.newtask.creator;
  todo
    .save()
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      user.todos.push(todo);
      return user.save();
    });

  res.json(todo);
});

router.get("/userTodoListData/:userId", (req, res) => {
  let outPutObj = [];
  let constructObj = { title: null, color: null, todos: [] };
  Todos.find({ creator: req.params.userId })
    .distinct("title")
    .then((todolists) => {
      todolists.map((title) => {
        constructObj = { ...constructObj, title: title };
        Todos.find({ creator: req.params.userId, title: title }).then(
          (todoList) => {
            constructObj = {
              ...constructObj,
              todoList: todoList,
              color: todoList[0].color,
            };
            outPutObj.push(constructObj);
          }
        );
      });
    });
  res.status(200).json(outPutObj);
});

router.get("/todolist/:id/:title", (req, res) => {
  const filtTitle = req.params.title;
  const creatorId = req.params.id;

  let start = new Date();
  start.setDate(start.getDate() - 1);
  let end = new Date();

  let startOD = new Date();
  startOD.setDate(start.getDate() - 5);
  let endOD = new Date();
  endOD.setDate(endOD.getDate() - 3);
  switch (filtTitle) {
    case "TodaysAgenda":
      Todos.find({
        creator: creatorId,
        createdAt: { $gte: start, $lt: end },
      }).then((todo) => {
        res.status(200).json({
          todoData: todo,
          todoTitle: "TodaysAgenda",
        });
      });
      break;
    case "InCompletes":
      Todos.find({
        creator: creatorId,
        isComplete: false,
      }).then((todo) => {
        res.status(200).json({
          todoData: todo,
          todoTitle: "InCompletes",
        });
      });
      break;
    case "OverDue":
      Todos.find({
        creator: creatorId,
        isComplete: false,
        createdAt: { $lt: endOD },
      }).then((todo) => {
        res.status(200).json({
          todoData: todo,
          todoTitle: "OverDue",
        });
      });
      break;

    default:
      Todos.find({ creator: creatorId, title: filtTitle }).then((todo) => {
        res.status(200).json({
          todoData: todo,
          todoTitle: filtTitle,
        });
      });
  }
});
/*
      filtTitle=="TodaysAgenda"?Todos.find({
        'creator':creatorId , 
        'createdAt': {$gte:start, $lt:end}
      }).then(todo=>{
        res.status(200).json({
          todoData:todo,
          todoTitle:"TodaysAgenda"
        })
      })
     :Todos.find({"creator": creatorId, "title":filtTitle})
       .then(todo => {
         
         res.status(200).json({
           todoData: todo,
           todoTitle: filtTitle
         })
       })
     });

*/
router.get("/todolistCompletes/:userId", (req, res) => {
  Todos.find({ isComplete: true, creator: req.params.userId })
    .countDocuments()
    .then((count) => {
      res.json({ Completes: count });
    });
});

router.get("/todolistCompletes/:userId/:title", (req, res) => {
  Todos.find({
    isComplete: true,
    creator: req.params.userId,
    title: req.params.title,
  })
    .countDocuments()
    .then((count) => {
      res.status(200).json({ listCompletes: count });
    });
});

router.get("/todolisttasksCreated/:userId", (req, res) => {
  Todos.find({ creator: req.params.userId })
    .countDocuments()
    .then((count) => {
      res.json({ totalTasks: count });
    });
});

router.get("/totalincompletes/:userId", (req, res) => {
  Todos.find({ isComplete: false, creator: req.params.userId })
    .countDocuments()
    .then((count) => {
      res.json({ totalTasks: count });
    });
});

router.get("/incompletelisttasks/:userId/:title", (req, res) => {
  Todos.find({
    isComplete: false,
    creator: req.params.userId,
    title: req.params.title,
  })
    .countDocuments()
    .then((count) => {
      res.status(200).json({ incompletes: count });
    });
});

router.get("/todolisttasksCreated/:userId/:title", (req, res) => {
  Todos.find({ creator: req.params.userId, title: req.params.title })
    .countDocuments()
    .then((count) => {
      res.status(200).json({ listTasks: count });
    });
});

router.get("/findTodo/:id", (req, res, next) => {
  Todos.findById(req.params.id, function (err, todo) {
    if (!todo) {
      res.status(404).send("No result found");
    } else {
      res.json(todo);
    }
  });
});

router.patch("/archiveTodo/:userId/:title", (req, res, next) => {
  console.log(req.body.isVisibleData);
  Todos.updateMany(
    { creator: req.params.userId, title: req.params.title, isComplete: true },
    { $set: { isVisible: req.body.isVisibleData } }
  )
    .then(function () {
      res.json("todo updated");
    })
    .catch(function (err) {
      res.status(422).send("todo update failed.");
    });
});

router.patch("/CompleteTodo/:id", (req, res, next) => {
  console.log(req.body.isCompleteData);
  Todos.updateOne(
    { _id: req.params.id },
    { $set: { isComplete: req.body.isCompleteData } }
  )
    .then(function () {
      res.json("todo updated");
    })
    .catch(function (err) {
      res.status(422).send("todo update failed.");
    });
});



router.patch("/toggleRoutine/:id", (req, res) => {
  Todos.updateOne(
    { _id: req.params.id },
    { $set: { isRoutine: req.body.isRoutineData } }
  ).then(
    Todos.findById(req.params.id).then((todo) => {
      let task = cron.schedule(
        "20 01 * * *",
        () => {
          if (todo.isRoutine === true) {
            const newTodo = new Todos({
              title: todo.title,
              creator: todo.creator,
              task: todo.task,
              isComplete: false,
              isVisible: true,
            });
            const userId = todo.creator;
            newTodo
              .save()
              .then(() => {
                return User.findById(userId);
              })
              .then((user) => {
                user.todos.push(todo);
                return user.save();
              });
          } else {
            task.destroy();
          }
        },
        { scheduled: true }
      );
    })
  );
});

router.delete("/deletetodo/:id", (req, res, next) => {
  Todos.findById(req.params.id)
    .then((result) => {
      return User.findById(result.creator);
    })
    .then((user) => {
      user.todos.pull(req.params.id);
      return user.save();
    });

  Todos.findByIdAndRemove(req.params.id).then(function () {
    res.status(200).json("todo deleted");
  });
});

module.exports = router;
