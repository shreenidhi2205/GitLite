package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")

public class BranchController {
    @Autowired
    public BranchService branchService;

    @Autowired
    public BranchRepository branchRepository;

    @PostMapping
    public Branch addBranch(@RequestBody BranchRequest request){
        return branchService.create(request.name, request.headCommitHash, request.repositoryId);
    }

    @GetMapping
    public List<Branch> getAllBranches(@RequestParam(required = false) Long repositoryId) {
        if (repositoryId != null) {
            return branchRepository.findByRepositoryId(repositoryId);
        }
        return branchRepository.findAll();
    }

    @GetMapping("/{name}")
    public Branch getBranch(@PathVariable String name){
        return branchService.findByName(name);
    }

    @PutMapping("/{name}")
    //public Branch updateBranchHead(@RequestBody BranchRequest request){
    //The PUT /branches/{name} endpoint should identify which branch to update from the URL, and
    // only take newHeadHash from the body.
    public Branch updateBranchHead(@PathVariable String name, @RequestBody UpdateHeadRequest request) {
        return branchService.updateHead(name, request.repositoryId, request.newHeadHash);
    }
}
