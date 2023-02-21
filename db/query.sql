SELECT roles.id, roles.title, departments.name AS department, roles.salary 
FROM departments 
LEFT JOIN roles ON departments.id = roles.department_id;
