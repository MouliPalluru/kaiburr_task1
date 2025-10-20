package com.example.task1.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "taskExecutions")
public class TaskExecution {
    @Id
    private String id;
    private Date startTime;
    private Date endTime;
    private String output;
    
    // Constructor without ID - will auto-generate
    public TaskExecution(Date startTime, Date endTime, String output) {
        this.id = UUID.randomUUID().toString();
        this.startTime = startTime;
        this.endTime = endTime;
        this.output = output;
    }
}
