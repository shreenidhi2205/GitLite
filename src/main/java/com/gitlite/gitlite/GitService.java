package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GitService {
    @Autowired
    public BlobService blobService;

    @Autowired
    public CommitService commitService;

    @Autowired
    public BranchService branchService;

    @Autowired
    public BranchRepository branchRepository;
    /*
    GitService.simulateCommit() calls branchService.findByName() to check if a branch exists.
    Now that it throws instead of returning null, that will break the first commit on a new branch.
    Fix it in GitService like this:

    ❌ will now throw instead of returning null
    Branch branch = branchService.findByName(branchName);

    ✅ go directly to the repository instead
    Branch branch = branchRepository.findByName(branchName);

    branchService still handles create and updateHead.
    branchRepository is used for null check.
    */


    public SimulateCommitResponse simulateCommit(String branchName, String message, String fileContent, Long repositoryId) {
        Blob blob = blobService.store(fileContent);

        Branch branch = branchRepository.findByNameAndRepositoryId(branchName, repositoryId);
        String parentHash = (branch == null) ? null : branch.getHeadCommitHash();

        Commit commit = commitService.createCommit(message, blob.getHash(), parentHash);

        if (branch == null) {
            branch = branchService.create(branchName, commit.getHash(), repositoryId);
        } else {
            branch = branchService.updateHead(branchName, repositoryId, commit.getHash());
        }

        return new SimulateCommitResponse(blob, commit, branch);
    }
}