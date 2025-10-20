package com.example.task1.service;

import com.example.task1.model.Task;
import com.example.task1.model.TaskExecution;
import com.example.task1.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public Task createOrUpdateTask(Task task) {
        validateCommand(task.getCommand());
        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<Task> findTasksByName(String name) {
        return taskRepository.findByNameContainingIgnoreCase(name);
    }

    public TaskExecution executeTask(String taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found with id: " + taskId);
        }

        Task task = taskOpt.get();
        TaskExecution execution = new TaskExecution();
        execution.setId(java.util.UUID.randomUUID().toString());
        execution.setStartTime(new Date());

        try {
            // Execute the command - detect OS and use appropriate shell
            ProcessBuilder processBuilder = new ProcessBuilder();
            String os = System.getProperty("os.name").toLowerCase();
            
            if (os.contains("windows")) {
                // Use cmd for Windows
                processBuilder.command("cmd", "/c", task.getCommand());
            } else {
                // Use sh for Unix/Linux/Mac
                processBuilder.command("sh", "-c", task.getCommand());
            }
            
            Process process = processBuilder.start();
            
            // Read the output
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            // Wait for the process to complete
            int exitCode = process.waitFor();
            execution.setEndTime(new Date());
            execution.setOutput(output.toString());
            
            if (exitCode != 0) {
                execution.setOutput("Command failed with exit code: " + exitCode + "\n" + output.toString());
            }
            
        } catch (IOException | InterruptedException e) {
            execution.setEndTime(new Date());
            execution.setOutput("Error executing command: " + e.getMessage());
            log.error("Error executing command for task {}: {}", taskId, e.getMessage());
        }

        // Add execution to task (guard against null list)
        if (task.getTaskExecutions() == null) {
            task.setTaskExecutions(new java.util.ArrayList<>());
        }
        task.getTaskExecutions().add(execution);
        taskRepository.save(task);

        return execution;
    }

    private void validateCommand(String command) {
        if (command == null || command.trim().isEmpty()) {
            throw new IllegalArgumentException("Command cannot be null or empty");
        }

        // Basic security validation - prevent dangerous commands
        String lowerCommand = command.toLowerCase().trim();
        String[] dangerousCommands = {
            "rm -rf", "del /f", "format", "fdisk", "mkfs", "dd if=", "shutdown", "reboot",
            "halt", "poweroff", "init 0", "init 6", "sudo", "su -", "passwd", "chmod 777",
            "chown", "useradd", "userdel", "groupadd", "groupdel", "visudo", "crontab",
            "at", "systemctl", "service", "killall", "pkill", "kill -9", "> /dev/sda",
            "curl", "wget", "nc", "netcat", "telnet", "ssh", "scp", "rsync"
        };

        for (String dangerous : dangerousCommands) {
            if (lowerCommand.contains(dangerous)) {
                throw new IllegalArgumentException("Command contains potentially dangerous operation: " + dangerous);
            }
        }

        // Prevent commands that try to access system files
        if (lowerCommand.contains("/etc/") || lowerCommand.contains("/sys/") || 
            lowerCommand.contains("/proc/") || lowerCommand.contains("/dev/")) {
            throw new IllegalArgumentException("Command attempts to access system directories");
        }
    }
}
