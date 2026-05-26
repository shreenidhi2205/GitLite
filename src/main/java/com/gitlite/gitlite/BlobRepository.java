package com.gitlite.gitlite;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BlobRepository extends JpaRepository<Blob,Long> {
    Blob findByHash(String Hash);
}
