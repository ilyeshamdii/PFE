package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.Badge;
import com.bezkoder.springjwt.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BadgeService {
    @Autowired
    private BadgeRepository badgeRepository;
    public boolean hasAcceptedBadge(Long userId) {
        // Check if the user has a badge with status "accepter"
        Badge badge = badgeRepository.findByUserIdAndStatus(userId, "accepter");
        return badge != null;
    }
    public String findBadgeStatusByUserId(Long userId) {
        // Retrieve the badge status for the user
        Badge badge = badgeRepository.findByUserId(userId);
        return badge != null ? badge.getStatus() : null;
    }
    public void acceptBadge(Long badgeId) {
        Badge badge = badgeRepository.findById(badgeId).orElseThrow(() -> new RuntimeException("Badge not found"));
        badge.setStatus("accepter");
        badgeRepository.save(badge);
    }

    public void refuseBadge(Long badgeId) {
        Badge badge = badgeRepository.findById(badgeId).orElseThrow(() -> new RuntimeException("Badge not found"));
        badge.setStatus("refuser");
        badgeRepository.save(badge);
    }
}