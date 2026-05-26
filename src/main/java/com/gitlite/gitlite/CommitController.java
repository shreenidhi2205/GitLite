package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commits")
public class CommitController {
    @Autowired
    public CommitService commitService;

//    @PostMapping
//    public Commit addCommit(@RequestBody String message, String blobHash , String parentHash){
//        return commitService.createCommit(message, blobHash , parentHash);
//    }
    // @RequestBody can only be used once per method, it maps entire request body to a single object
    //Hence we create a request Wrapper class CommitRequest.java

    @PostMapping
    public Commit addCommit(@RequestBody CommitRequest request){
        return commitService.createCommit(request.message,request.blobHash,request.parentHash);
    }


    @GetMapping("/{startHash}")
    public List<Commit> getHistory(@PathVariable String startHash){
        return commitService.getHistory(startHash);
    }
}
