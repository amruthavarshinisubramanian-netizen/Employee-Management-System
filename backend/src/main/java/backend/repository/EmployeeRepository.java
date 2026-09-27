package backend.repository;

import backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
    List<Employee> findByStatus(String status);
    Long countByStatus(String status);
    Employee findByEmail(String email);
    List<Employee> findTop5ByOrderByIdDesc();
    List<Employee> findByOrderByPerformanceScoreDesc();
}