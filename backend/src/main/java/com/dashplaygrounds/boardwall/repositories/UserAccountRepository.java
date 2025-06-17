package com.dashplaygrounds.boardwall.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dashplaygrounds.boardwall.models.UserAccount;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
    // Custom query methods can be defined here if needed
    // For example:
    // List<UserAccount> findByUsername(String username);
    // Optional<UserAccount> findByEmail(String email);
    // etc.
    // @Query("SELECT u FROM User u WHERE u.name = ?1")
    // List<UserAccount> findAll();

}
