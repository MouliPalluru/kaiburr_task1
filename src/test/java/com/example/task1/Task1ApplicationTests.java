package com.example.task1;

import com.example.task1.model.Task;
import com.example.task1.model.TaskExecution;
import com.example.task1.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.List;

@SpringBootTest
public class Task1ApplicationTests {

    @Test
    public void contextLoads() {
        // Test that the Spring context loads successfully
    }

    @Test
    public void testTaskModel() {
        // Test Task model creation
        Task task = new Task();
        task.setId("test-123");
        task.setName("Test Task");
        task.setOwner("Test Owner");
        task.setCommand("echo test");
        task.setTaskExecutions(List.of());

        assert task.getId().equals("test-123");
        assert task.getName().equals("Test Task");
        assert task.getOwner().equals("Test Owner");
        assert task.getCommand().equals("echo test");
    }

    @Test
    public void testTaskExecutionModel() {
        // Test TaskExecution model creation
        TaskExecution execution = new TaskExecution();
        execution.setId("exec-123");
        execution.setStartTime(new Date());
        execution.setEndTime(new Date());
        execution.setOutput("test output");

        assert execution.getId().equals("exec-123");
        assert execution.getOutput().equals("test output");
        assert execution.getStartTime() != null;
        assert execution.getEndTime() != null;
    }

    @Test
    public void testCommandValidation() {
        // Test that dangerous commands are rejected
        TaskService taskService = new TaskService(null);
        
        try {
            // This should throw an exception
            taskService.createOrUpdateTask(createTaskWithCommand("rm -rf /"));
            assert false : "Should have thrown exception for dangerous command";
        } catch (IllegalArgumentException e) {
            assert e.getMessage().contains("dangerous");
        }
    }

    private Task createTaskWithCommand(String command) {
        Task task = new Task();
        task.setId("test");
        task.setName("test");
        task.setOwner("test");
        task.setCommand(command);
        task.setTaskExecutions(List.of());
        return task;
    }
}