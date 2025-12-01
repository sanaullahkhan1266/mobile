/**
 * Password Validation and Strength Checker
 * Enforces password security requirements
 */

export interface PasswordStrength {
    score: number; // 0-4 (0=very weak, 4=very strong)
    feedback: string[];
    isValid: boolean;
    strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
}

/**
 * Validate password strength and return detailed feedback
 */
export const validatePassword = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Check if password exists
    if (!password) {
        return {
            score: 0,
            feedback: ['Password is required'],
            isValid: false,
            strength: 'Very Weak',
        };
    }

    // 1. Minimum length check (8 characters)
    if (password.length < 8) {
        feedback.push('Password must be at least 8 characters');
    } else {
        score++;

        // Bonus for longer passwords
        if (password.length >= 12) {
            score += 0.5;
        }
    }

    // 2. Uppercase check
    if (!/[A-Z]/.test(password)) {
        feedback.push('Add at least one uppercase letter (A-Z)');
    } else {
        score++;
    }

    // 3. Lowercase check
    if (!/[a-z]/.test(password)) {
        feedback.push('Add at least one lowercase letter (a-z)');
    } else {
        score++;
    }

    // 4. Number check
    if (!/\d/.test(password)) {
        feedback.push('Add at least one number (0-9)');
    } else {
        score++;
    }

    // 5. Special character check
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) {
        feedback.push('Add at least one special character (!@#$%^&*)');
    } else {
        score++;
    }

    // 6. Common pattern checks
    const hasRepeatingChars = /(.)\1{2,}/.test(password); // e.g., "aaa" or "111"
    const hasSequentialChars = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);

    if (hasRepeatingChars) {
        feedback.push('Avoid repeating characters (e.g., "aaa")');
        score = Math.max(0, score - 1);
    }

    if (hasSequentialChars) {
        feedback.push('Avoid sequential characters (e.g., "abc", "123")');
        score = Math.max(0, score - 1);
    }

    // 7. Common password check - reduce score significantly
    const commonPasswords = [
        'password', 'password123', '12345678', 'qwerty', 'abc123',
        'letmein', 'admin', 'welcome', 'monkey', 'dragon',
        '111111', '123123', 'sunshine', 'master', 'princess'
    ];

    if (commonPasswords.some(common => password.toLowerCase() === common || password.toLowerCase().includes(common))) {
        feedback.push('Password is too common - choose something more unique');
        score = Math.max(0, score - 2);
    }

    // Cap score at 4
    const finalScore = Math.min(Math.floor(score), 4);

    // Determine strength label
    const strength = getPasswordStrengthLabel(finalScore);

    // Password is valid if it meets minimum requirements
    const isValid = finalScore >= 3 && password.length >= 8;

    return {
        score: finalScore,
        feedback: feedback.length > 0 ? feedback : ['Password meets security requirements'],
        isValid,
        strength,
    };
};

/**
 * Get password strength label from score
 */
export const getPasswordStrengthLabel = (
    score: number
): 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' => {
    switch (score) {
        case 0:
            return 'Very Weak';
        case 1:
            return 'Weak';
        case 2:
            return 'Fair';
        case 3:
            return 'Good';
        case 4:
            return 'Strong';
        default:
            return 'Very Weak';
    }
};

/**
 * Get color for password strength indicator
 */
export const getPasswordStrengthColor = (score: number): string => {
    switch (score) {
        case 0:
        case 1:
            return '#FF3B30'; // Red
        case 2:
            return '#FF9500'; // Orange
        case 3:
            return '#FFCC00'; // Yellow
        case 4:
            return '#34C759'; // Green
        default:
            return '#8E8E93'; // Gray
    }
};

/**
 * Simple check if password meets minimum requirements
 */
export const meetsMinimumRequirements = (password: string): boolean => {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
    );
};

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length: number = 16): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + special;

    let password = '';

    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
};
