package com.gitlite.gitlite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface BranchRepository extends JpaRepository<Branch,Long> {
    Branch findByName(String name);
    Branch findByNameAndRepositoryId(String name, Long repositoryId);
    List<Branch> findByRepositoryId(Long repositoryId);
}
