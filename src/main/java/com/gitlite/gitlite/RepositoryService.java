package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepositoryService {

    @Autowired
    public RepositoryRepository repositoryRepository;

    public Repository create(String name){
        Repository repository = new Repository();
        repository.setName(name);
        return repositoryRepository.save(repository);
    }

   public List<Repository> findAll(){
        return repositoryRepository.findAll();
   }
}
