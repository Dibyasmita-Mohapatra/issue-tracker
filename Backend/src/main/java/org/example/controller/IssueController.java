package org.example.controller;

import org.example.model.Issue;
import org.example.model.Status;
import org.example.model.Priority;

import org.example.service.IssueService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.domain.Specification;

@RestController
@RequestMapping("/issues")
@CrossOrigin(origins = "http://localhost:3000")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    public Issue createIssue(@Valid @RequestBody Issue issue) {
        return issueService.createIssue(issue);
    }

    @GetMapping
    public Page<Issue> getAllIssues(Pageable pageable) {
        return issueService.getAllIssues(pageable);
    }

    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id);
    }

    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable Long id, @Valid @RequestBody Issue issue) {
        return issueService.updateIssue(id, issue);
    }

    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return "Issue deleted successfully";
    }

    @GetMapping("/status/{status}")
    public List<Issue> getIssuesByStatus(@PathVariable Status status) {
        return issueService.getIssuesByStatus(status);
    }

    @GetMapping("/search")
    public Page<Issue> searchIssues(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            Pageable pageable) {

        return issueService.searchIssues(keyword, status, priority, pageable);
    }
}