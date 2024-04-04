package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Badge;
import com.bezkoder.springjwt.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Badge findByUserIdAndStatus(Long userId, String status);
    Badge findByUserId(Long userId);
    List<Badge> findByUser(User user);

}
