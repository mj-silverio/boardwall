package com.dashplaygrounds.boardwall.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dashplaygrounds.boardwall.models.UserAccount;
import com.dashplaygrounds.boardwall.repositories.UserAccountRepository;

@Service
public class UserAccountService {
    @Autowired
    private UserAccountRepository userAccountRepository;

    public List<UserAccount> getAllUserAccounts() {
        return userAccountRepository.findAll();
    }

    public UserAccount getOneUserAccountById(String id) {
        return userAccountRepository.findById(id).orElseThrow(() -> new RuntimeException("UserAccount not found"));
    }

    public UserAccount saveUserAccount(UserAccount userAccount) {
        return userAccountRepository.save(userAccount);
    }

    public UserAccount updateOneUserAccountById(String id, UserAccount updatedUser) {
        return userAccountRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            return userAccountRepository.save(updatedUser);
        }).orElseThrow(() -> new RuntimeException("UserAccount not found"));
    }

    public void deleteById(String id) {
        userAccountRepository.deleteById(id);
    }
}
