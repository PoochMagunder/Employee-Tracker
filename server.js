const express = require("express");
const mySql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


console.log(` 
   _____)                                 ______)                    
  /                /)                    (,  /             /)           
  )__   ___  __   //  __       _   _         /  __  _   _ (/_   _  __ 
 /    /  // (_/_)_(/_(_) (_/__(/__(/_    ) /   / (_(_(_(__/(___(/_/ (_
(_____)    .-/          .-/             (_/                           
          (_/          (_/                                            

       `)

// Connects to database
const db = mySql.createConnection(
  {
    host: "localhost",

    user: "root",

    password: "SuperQuailLute_12",
    database: "employee_db",
  },
  console.log("Connected to employee_db.")
);
// Prompts for different information
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
      "update an employee's role",
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
    choices: [{value:1,name:"Sales"}, {value:2, name:"Engineering"}, {value:3, name:"Finance"}, {value:4, name:"Legal"}, {value:5, name:"Human Resources"}],
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
    choices: [{value:1,
      name:"Sales Lead"},
  { value:2,
    name:"Salesperson"},
  { value:3,
    name:"Lead Engineer"},
  { value:4,
    name:"Software Engineer"},
  { value:5,
    name:"Account Manager"},
  { value:6,
    name:"Accountant"},
  { value:7,
    name:"Legal Team Lead"},
  { value:8,
    name:"Lawyer"},
  { value:9,
    name:"Human Resource Agent"},
],
  },
  {
    type: "list",
    name: "employees_manager",
    message: "Who is the employee's manager",
    choices: [
      { value:1,
        name:"John Doe"},
      { value:2,
        name:"Mike Chan"},
      { value:3,
        name:"Ashley Rodriguez"},
      { value:4,
        name:"Kevin Tupik"},
      { value:5,
        name:"Kunal Singh"},
      { value:6,
        name:"Malia Brown"},
      { value:7,
        name:"Sarah Lourd"},
      { value:8,
        name:"Tom Allen"},
      { value:9,
        name:"Devon Eadie"},
    ]
  },
];

const updateRole = [
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "selected_employee",
    choices: [
      { value:1,
        name:"John Doe"},
      { value:2,
        name:"Mike Chan"},
      { value:3,
        name:"Ashley Rodriguez"},
      { value:4,
        name:"Kevin Tupik"},
      { value:5,
        name:"Kunal Singh"},
      { value:6,
        name:"Malia Brown"},
      { value:7,
        name:"Sarah Lourd"},
      { value:8,
        name:"Tom Allen"},
      { value:9,
        name:"Devon Eadie"},
    ]
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee?",
    name: "new_role",
    choices: [{value:1,
      name:"Sales Lead"},
  { value:2,
    name:"Salesperson"},
  { value:3,
    name:"Lead Engineer"},
  { value:4,
    name:"Software Engineer"},
  { value:5,
    name:"Account Manager"},
  { value:6,
    name:"Accountant"},
  { value:7,
    name:"Legal Team Lead"},
  { value:8,
    name:"Lawyer"},
  { value:9,
    name:"Human Resource Agent"},
]
  }
];
// Prompt Functions
function mainPrompt() {
  inquirer
    .prompt(firstPrompt)
    .then((answer) => {

      if (answer.option === "view all departments") {
        viewAllDepartments()
      }
        
      if (answer.option === "view all roles") {
       viewAllRoles()
      }
  
      if (answer.option === "view all employees") {
        viewAllEmployees()
      }
  
      if (answer.option === "add a department") {
        addNewDepartment()
      }
  
      if (answer.option === "add a role") {
       addNewRole()
      }
  
      if (answer.option === "add an employee") {
        addNewEmployee()
      }
  
      if (answer.option === "update an employee's role") {
      updateEmployeeRole()
      }
})};     

function viewAllDepartments() {
  const sql = `SELECT * from departments AS department`;
  
  db.promise().query(sql)
    .then(([rows]) => {
      console.table(rows)
    })
    .then(() => {
      return mainPrompt()
    })
    .catch(err => console.error(err))
}

function viewAllRoles() {
  const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary from departments 
  LEFT JOIN roles ON departments.id = roles.department_id`;
  
  db.promise().query(sql)
    .then(([rows]) => {
      console.table(rows)
    })
    .then(() => {
      return mainPrompt()
    })
    .catch(err => console.error(err))
}

function viewAllEmployees() {
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
  
        db.promise().query(sql)
          .then(([rows]) => {
            console.table(rows)
          })
          .then(() => {
            return mainPrompt()
          })
          .catch(err => console.error(err))
}

function addNewDepartment() {
  inquirer
          .prompt(addDepartment)
          .then((answer) => {
  const sql = `INSERT INTO departments (name)
  VALUES ('${answer.department}')`;
        
      db.promise().query(sql)
        .then(() => {
        console.log("Added Department to database")
         viewAllDepartments()
        })
        .catch(err => console.error(err))
          
})
}

function addNewRole() {
  inquirer
          .prompt(addRole)
  
          .then(answers => {

            const sql = `INSERT INTO roles (title, salary, department_id)
        VALUES ('${answers.role_name}','${answers.role_salary}','5')`;
            
        db.promise().query(sql)
              console.log("Added new role to database");
              viewAllRoles()
            })
            .catch(err => console.error(err))
}

function addNewEmployee() {
  inquirer
  .prompt(addEmployee)

  .then(answers => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES('${answers.first_name}',
  '${answers.last_name}',
  '5',
  '2')`;
    
db.promise().query(sql)
      console.log("Added new employee to database");
      viewAllEmployees()
    })
    .catch(err => console.error(err))
}

function updateEmployeeRole() {
  inquirer
  .prompt(updateRole)
   .then(answers => {
  const sql = `UPDATE employees SET role_id = ${answers.new_role} WHERE employees.id = ${answers.selected_employee}`;
  

  db.query(sql)
    console.log("Updated selected employee's role")
    viewAllEmployees()
   })
   .catch(err => console.error(err))
}
// Runs Main Prompt on Start
mainPrompt();