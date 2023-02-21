const express = require("express");
const mySql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mySql.createConnection(
  {
    host: "localhost",

    user: "root",

    password: "SuperQuailLute_12",
    database: "employee_db",
  },
  console.log("Connected to employee_db.")
);

const firstPrompt = [
  {
    type: "list",
    message: "Choose an option",
    name: "option",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee",
    ],
  },
];

const addDepartment = [
  {
    type: "input",
    name: "department",
    message: "Enter new department name",
  },
];

const addRole = [
  {
    type: "input",
    name: "role_name",
    message: "Enter new role name",
  },

  {
    type: "input",
    name: "role_salary",
    message: "What is the salary of the role?",
  },

  {
    type: "list",
    name: "roles_department",
    message: "Which department does this role belong to?",
    choices: ["Sales", "Engineering", "Finance", "Legal"],
  },
];

const addEmployee = [
  {
    type: "input",
    name: "first_name",
    message: "Enter employee's first name",
  },
  {
    type: "input",
    name: "last_name",
    message: "Enter employee's last name",
  },
  {
    type: "list",
    name: "employee_role",
    message: "What is the employee's role",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer",
    ],
  },
  {
    type: "list",
    name: "employees_manager",
    message: "Who is the employee's manager",
    choices: [
      "None",
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Kunal Singh",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
    ],
  },
];

const updateRole = [
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "option",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Kunal Singh",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
    ],
  },
];

inquirer

  .prompt(firstPrompt)

  .then((answer) => {
    if (answer.option === "view all departments") {
      const sql = `SELECT * from departments AS department`;

      db.query(sql, (err, response) => {
        if (err) {
          response.status(500).json({ error: err.message });
          return;
        } else {
          console.table(response);
          return inquirer.prompt(firstPrompt);
        }
      });
    }

    if (answer.option === "view all roles") {
      const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary from departments LEFT JOIN roles ON departments.id = roles.department_id`;

      db.query(sql, (err, response) => {
        if (err) {
          response.status(500).json({ error: err.message });
          return;
        } else {
          console.table(response);
          return inquirer.prompt(firstPrompt);
        }
      });
    }

    if (answer.option === "view all employees") {
      const sql = `SELECT
    e1.id,
    e1.first_name,
    e1.last_name,
    roles.title AS title,
    departments.name AS department,
    roles.salary
    FROM employees e1
    LEFT JOIN roles ON e1.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id;`;

      db.query(sql, (err, response) => {
        if (err) {
          console.log({ error: err.message });
          return;
        } else {
          console.table(response);
          return inquirer.prompt(firstPrompt);
        }
      });
    }

    if (answer.option === "add a department") {
      inquirer
        .prompt(addDepartment)

        .then(answer, (res) => {
          const sql = `INSERT INTO departments (name)
    VALUES (?)`;
          const params = answer.department;

          db.query(sql, params, (err, response) => {
            console.table(response);
            return inquirer.prompt(firstPrompt);
          });
        });
    }

    if (answer.option === "add a role") {
      inquirer
        .prompt(addRole)

        .then(answers, (res) => {
          const sql = `INSERT INTO roles (title, salary, department)
      VALUES (?)`;
          const params =
            (answers.role_name, answers.role_salary, answers.role_department);

          db.query(sql, params, (err, response) => {
            console.table(response);
            return inquirer.prompt(firstPrompt);
          });
        });
    }

    if (answer.option === "add an employee") {
      inquirer
        .prompt(addEmployee)

        .then(answers, (res) => {
          const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES(?)`;
          const params =
            (answers.first_name,
            answers.last_name,
            answers.employee_role,
            answers.employees_manager);

          db.query(sql, params, (err, response) => {
            console.table(response);
            return inquirer.prompt(firstPrompt);
          });
        });
    }

    if (answer.option === "update an employees role") {
      inquirer.prompt(updateRole);

      const sql = `UPDATE employees SET  = ? WHERE id = ?`;
      const params = [req.body.review, req.params.id];

      db.query(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
          res.json({
            message: "Movie not found",
          });
        } else {
          res.json({
            message: "success",
            data: req.body,
            changes: result.affectedRows,
          });
        }
      });
    }
  });
