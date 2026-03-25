package org.example.specification;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import org.example.model.Issue;
import org.example.model.Status;
import org.example.model.Priority;

public class IssueSpecification {

    public static Specification<Issue> search(String keyword, Status status, Priority priority) {

        return (Root<Issue> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {

            Predicate predicate = criteriaBuilder.conjunction();

            if (keyword != null && !keyword.isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.like(root.get("title"), "%" + keyword + "%"),
                                criteriaBuilder.like(root.get("description"), "%" + keyword + "%")
                        ));
            }

            if (status != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("priority"), priority));
            }

            return predicate;
        };
    }
}