package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/git")
public class GitController {
    @Autowired
    public GitService gitService;

    @PostMapping(value = "/simulate-commit", consumes = "multipart/form-data")
    public SimulateCommitResponse simulateCommit(
            @RequestParam("file") MultipartFile file,
            @RequestParam("branch") String branchName,
            @RequestParam("message") String message,
            @RequestParam("repositoryId") Long repositoryId) throws IOException {

        String fileContent = new String(file.getBytes());
        return gitService.simulateCommit(branchName, message, fileContent, repositoryId);
    }
}
