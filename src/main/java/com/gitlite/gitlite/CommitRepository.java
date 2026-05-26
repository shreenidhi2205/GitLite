package com.gitlite.gitlite;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommitRepository extends JpaRepository<Commit, Long> {
    Optional<Commit> findFirstByHash(String hash);
}