package backend.controller;

import backend.model.Employee;
import backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    EmployeeRepository repo;

    @PostMapping("/register")
    public Employee addEmployee(@RequestBody Employee employee) {
        return repo.save(employee);
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
    return repo.findAll();
    }

    @DeleteMapping("/{id}")
public void deleteEmployee(@PathVariable Long id) {
    repo.deleteById(id);
    }

    @GetMapping("/{id}")
public Employee getEmployeeById(@PathVariable Long id){

    return repo.findById(id).orElse(null);

}


@PutMapping("/{id}")
public Employee updateEmployee(@PathVariable Long id,
                               @RequestBody Employee updatedEmployee){

    Employee employee = repo.findById(id).orElse(null);

    if(employee != null){

        employee.setName(updatedEmployee.getName());
        employee.setEmail(updatedEmployee.getEmail());
        employee.setDepartment(updatedEmployee.getDepartment());

        return repo.save(employee);

    }

    return null;

}
}
