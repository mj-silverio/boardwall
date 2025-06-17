package com.dashplaygrounds.boardwall.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dashplaygrounds.boardwall.models.UserAccount;
import com.dashplaygrounds.boardwall.services.UserAccountService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/user-accounts")
public class UserAccountControllerV1 {

    @Autowired
    private UserAccountService userAccountService;
    // Get all users
    @GetMapping
    public List<UserAccount> getAllUsers() {
        List<UserAccount> result = userAccountService.getAllUserAccounts();
        log.info("Fetched all users: {}", result);
        return result;
    }

    // Get a specific user by ID
    @GetMapping("/{id}")
    public UserAccount getUserById(@PathVariable String id) {
        UserAccount user = userAccountService.getOneUserAccountById(id);
        log.info("Fetched user with ID {}: {}", id, user);
        return user;
    }

    // Create a new user
    @PostMapping
    public UserAccount createUser(@RequestBody UserAccount user) {
        log.info("Creating new user: {}", user);
        UserAccount result = userAccountService.saveUserAccount(user);
        log.info("Created user: {}", result);
        return result;
    }

    // Update an existing user
    @PutMapping("/{id}")
    public UserAccount updateUser(@PathVariable String id, @RequestBody UserAccount updatedUser) {
        log.info("Updating user with ID {}: {}", id, updatedUser);
        UserAccount result = userAccountService.updateOneUserAccountById(id, updatedUser);
        if (result == null) {
            log.error("User with ID {} not found", id);
            return null;
        } else {
            log.info("result: {}", result);
        }
        return result;
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable String id) {
        log.info("Deleting user with ID {}", id);
        userAccountService.deleteById(id);
        return "{\"id\": \"" + id + "\"}";
    }
}
