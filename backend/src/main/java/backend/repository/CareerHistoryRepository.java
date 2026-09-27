package backend.repository;

import backend.model.CareerHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerHistoryRepository extends JpaRepository<CareerHistory, Long> {
    List<CareerHistory> findByEmployeeIdOrderByYearAsc(Long employeeId);
    void deleteByEmployeeId(Long employeeId);
}
