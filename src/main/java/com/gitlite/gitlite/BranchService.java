    package com.gitlite.gitlite;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    @Service
    public class BranchService {

        @Autowired
        public BranchRepository branchRepository;

        public Branch create(String name, String headCommitHash, Long repositoryId){
            Branch branch = new Branch();
            branch.setName(name);
            branch.setHeadCommitHash(headCommitHash);
            branch.setRepositoryId(repositoryId);
            return branchRepository.save(branch);
        }

        public Branch findByName(String name){
            Branch branch = branchRepository.findByName(name);
            if(branch==null){
                throw new ResourceNotFoundException("Branch not found : "+name);
            }
            return branch;
        }

        public Branch updateHead(String name, Long repositoryId, String newHeadHash) {
            Branch branch = branchRepository.findByNameAndRepositoryId(name, repositoryId);
            branch.setHeadCommitHash(newHeadHash);
            return branchRepository.save(branch);
        }
    }
