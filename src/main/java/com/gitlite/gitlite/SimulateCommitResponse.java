package com.gitlite.gitlite;
/*
 In real Git, git commit does all of that atomically in one command.
POST /simulate-commit replicates that:
1. Receive: file + branch name + commit message
2. Store the file → get blobHash
3. Find the branch → get current headCommitHash as parentHash
4. Create a commit → get new commitHash
5. Update branch head → point to new commitHash
6. Return everything in one response
*/

public class SimulateCommitResponse {
    public Blob blob;
    public Commit commit;
    public Branch branch;

    public SimulateCommitResponse(Blob blob , Commit commit , Branch branch){
        this.blob = blob;
        this.commit = commit;
        this.branch = branch;
    }
}
