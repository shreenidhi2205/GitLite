package com.gitlite.gitlite;

import ch.qos.logback.core.net.SyslogOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLOutput;


@Service
public class BlobService {

    @Autowired
    private BlobRepository blobRepository;

    public Blob store(String content){
        Blob blob = new Blob();
        blob.setContent(content);
        blob.setHash(HashUtil.hash(content));
        return blobRepository.save(blob);
    }

    public Blob findByHash(String hash){
        if(blobRepository.findByHash(hash)==null){
            throw new ResourceNotFoundException("Blob not found : "+hash);
        }
        return blobRepository.findByHash(hash);
    }
}
