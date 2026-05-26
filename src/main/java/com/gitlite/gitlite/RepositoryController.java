package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/repositories")
public class RepositoryController {
    @Autowired
    public RepositoryService repositoryService;

    @PostMapping
    public Repository addRepository(@RequestBody Repository repository){
        return repositoryService.create(repository.getName());
    }

    @GetMapping()
    public List<Repository> getRepository(){
        return repositoryService.findAll();
    }
}
