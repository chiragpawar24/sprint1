// ==========================================
// PROFILE SCORE CALCULATOR
// ==========================================

function calculateProfileScore(user) {
  let score = 0;

  // ==========================================
  // 1. SKILLS - 25%
  // ==========================================

  if (user.skills && user.skills.length > 0) {
    const skillCount = user.skills.length;

    if (skillCount >= 5) {
      score += 25;
    } else if (skillCount >= 3) {
      score += 20;
    } else if (skillCount >= 1) {
      score += 10;
    }
  }

  // ==========================================
  // 2. EXPERIENCE - 20%
  // ==========================================

  if (user.experience) {
    score += 20;
  }

  // ==========================================
  // 3. PROJECTS - 15%
  // ==========================================

  if (user.projects && user.projects.length > 0) {
    const projectCount = user.projects.length;

    if (projectCount >= 3) {
      score += 15;
    } else if (projectCount >= 2) {
      score += 12;
    } else {
      score += 7;
    }
  }

  // ==========================================
  // 4. EDUCATION - 10%
  // ==========================================

  if (user.education) {
    score += 10;
  }

  // ==========================================
  // 5. MENTOR RATING - 15%
  // ==========================================

  if (user.averageRating > 0) {
    score +=
      (user.averageRating / 7) * 15;
  }

  // ==========================================
  // 6. STUDENT FEEDBACK - 10%
  // ==========================================

  if (user.totalReviews > 0) {
    if (user.totalReviews >= 20) {
      score += 10;
    } else if (user.totalReviews >= 10) {
      score += 7;
    } else {
      score += 4;
    }
  }

  // ==========================================
  // 7. CERTIFICATIONS - 5%
  // ==========================================

  if (
    user.certifications &&
    user.certifications.length > 0
  ) {
    score += 5;
  }

  // Maximum 100
  score = Math.min(
    Math.round(score),
    100
  );

  return score;
}

module.exports = calculateProfileScore;