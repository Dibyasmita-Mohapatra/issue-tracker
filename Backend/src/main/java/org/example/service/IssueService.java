package org.example.service;

import org.example.model.Issue;
import org.example.model.Status;
import org.example.model.Priority;
import org.example.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.example.specification.IssueSpecification;
import org.springframework.data.jpa.domain.Specification;



@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    public Issue createIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    public Issue getIssueById(Long id) {
        return issueRepository.findById(id).orElse(null);
    }

    public Issue updateIssue(Long id, Issue updatedIssue) {
        return issueRepository.findById(id).map(issue -> {
            issue.setTitle(updatedIssue.getTitle());
            issue.setDescription(updatedIssue.getDescription());
            issue.setStatus(updatedIssue.getStatus());
            issue.setPriority(updatedIssue.getPriority());
            return issueRepository.save(issue);
        }).orElse(null);
    }

    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    public List<Issue> getIssuesByStatus(Status status) {
        return issueRepository.findByStatus(status);
    }

    public Page<Issue> getAllIssues(Pageable pageable) {
        return issueRepository.findAll(pageable);
    }

    public Page<Issue> searchIssues(String keyword,
                                    Status status,
                                    Priority priority,
                                    Pageable pageable) {

        Specification<Issue> spec =
                IssueSpecification.search(keyword, status, priority);

        return issueRepository.findAll(spec, pageable);
    }
}