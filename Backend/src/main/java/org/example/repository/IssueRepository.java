package org.example.repository;

import org.example.model.Issue;
import org.example.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long>,JpaSpecificationExecutor<Issue> {

    List<Issue> findByStatus(Status status);
}

