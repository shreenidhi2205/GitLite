package com.gitlite.gitlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/blobs")
public class BlobController {
    @Autowired
    private BlobService blobService;

//    @PostMapping
//    public Blob addBlob(@RequestBody String content){
//        return blobService.store(content);
//    }
    //@RequestBody   → data comes from the request body (POST)
    //@PathVariable  → data comes from the URL (GET /blobs/{hash})
    @PostMapping(consumes = "multipart/form-data")
    public Blob addBlob(@RequestParam("file") MultipartFile file) throws IOException {
        String content = new String(file.getBytes());
        return blobService.store(content);
    }

    @GetMapping("/{hash}")
    public Blob getBlob(@PathVariable String hash){
        return blobService.findByHash(hash);
    }

}
