package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommitService {

    @Autowired
    public CommitRepository commitRepository;

    public Commit findByHash(String hash) {
        return commitRepository.findFirstByHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("Commit not found: " + hash));
    }

    public Commit createCommit(String message, String blobHash, String parentHash) {
        Commit commit = new Commit();
        commit.setMessage(message);
        commit.setBlobHash(blobHash);
        commit.setParentHash(parentHash);
        commit.setTime(String.valueOf(LocalDateTime.now()));
        String safeParent = (parentHash == null) ? "" : parentHash;
        commit.setHash(HashUtil.hash(blobHash + message + safeParent));
        return commitRepository.save(commit);
    }

    public List<Commit> getHistory(String startHash) {
        List<Commit> history = new ArrayList<>();
        String currentHash = startHash;
        while (currentHash != null) {
            Commit commit = commitRepository.findFirstByHash(currentHash).orElse(null);
            if (commit == null && history.isEmpty()) {
                throw new ResourceNotFoundException("Commit not found: " + startHash);
            }
            if (commit == null) break;
            history.add(commit);
            currentHash = commit.getParentHash();
        }
        return history;
    }
}