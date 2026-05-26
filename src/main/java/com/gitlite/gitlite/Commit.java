package com.gitlite.gitlite;

import jakarta.persistence.*;



@Entity
@Table(name = "commits")
public class Commit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 64)
    private String blobHash;

    @Column(nullable = true, length=64)
    private String parentHash;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false, length = 64)
    private String hash;

    public Commit(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getBlobHash() {
        return blobHash;
    }

    public void setBlobHash(String blobHash) {
        this.blobHash = blobHash;
    }

    public String getParentHash() {
        return parentHash;
    }

    public void setParentHash(String parentHash) {
        this.parentHash = parentHash;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }
}
