// jobs/autoVerification.js
import cron from 'node-cron';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import { sendEmail } from '../utils/email.js';

// Auto-verify users who meet criteria
const autoVerifyUsers = async () => {
  try {
    console.log('Starting auto-verification process...');
    
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Find unverified users who registered 30+ days ago
    const eligibleUsers = await User.find({
      verified: false,
      createdAt: { $lte: thirtyDaysAgo }
    }).select('_id username email createdAt');
    
    console.log(`Found ${eligibleUsers.length} users eligible for auto-verification check`);
    
    let verifiedCount = 0;
    
    for (const user of eligibleUsers) {
      // Count reviews for this user
      const reviewCount = await Review.countDocuments({ user: user._id });
      
      // Check if user has 5+ reviews
      if (reviewCount >= 5) {
        // Auto-verify the user
        await User.findByIdAndUpdate(user._id, {
          verified: true,
          verifiedAt: new Date(),
          // Optional: Add a note about auto-verification
          verificationNote: 'Auto-verified: Active user with 5+ reviews and 30+ days membership'
        });
        
        verifiedCount++;
        console.log(`Auto-verified user: ${user.username} (${reviewCount} reviews)`);
        
        // Send congratulations email
        try {
          await sendEmail({
            email: user.email,
            subject: 'Account Automatically Verified - IMDB Clone',
            template: 'auto-verification',
            data: {
              username: user.username,
              reviewCount: reviewCount,
              memberSince: user.createdAt.toLocaleDateString()
            }
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError.message);
          // Continue with other users even if email fails
        }
      }
    }
    
    console.log(`Auto-verification completed. Verified ${verifiedCount} users.`);
    
  } catch (error) {
    console.error('Error in auto-verification process:', error);
  }
};

// Schedule cron job to run daily at 2 AM
const startAutoVerificationCron = () => {
  // Run every day at 2:00 AM
  cron.schedule('0 2 * * *', () => {
    console.log('Running daily auto-verification check...');
    autoVerifyUsers();
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('Auto-verification cron job scheduled to run daily at 2:00 AM UTC');
};

// Manual trigger function for testing
const runAutoVerificationNow = async () => {
  console.log('Running auto-verification manually...');
  await autoVerifyUsers();
};

export { startAutoVerificationCron, runAutoVerificationNow };
/* import cron from 'node-cron';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import { sendEmail } from '../utils/email.js';

// Auto-verify users who meet criteria
const autoVerifyUsers = async () => {
  try {
    console.log('Starting auto-verification process...');
    
    // Calculate date 1 minute ago
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    
    // Find unverified users who registered 1+ minute ago
    const eligibleUsers = await User.find({
      verified: false,
      createdAt: { $lte: oneMinuteAgo }
    }).select('_id username email createdAt');
    
    console.log(`Found ${eligibleUsers.length} users eligible for auto-verification check`);
    
    let verifiedCount = 0;
    
    for (const user of eligibleUsers) {
      // Count reviews for this user
      const reviewCount = await Review.countDocuments({ user: user._id });
      
      // Check if user has 5+ reviews
      if (reviewCount >= 0) {
        // Auto-verify the user
        await User.findByIdAndUpdate(user._id, {
          verified: true,
          verifiedAt: new Date(),
          // Optional: Add a note about auto-verification
          verificationNote: 'Auto-verified: Active user with 5+ reviews and 1+ minute membership'
        });
        
        verifiedCount++;
        console.log(`Auto-verified user: ${user.username} (${reviewCount} reviews)`);
        
        // Send congratulations email
        try {
          await sendEmail({
            email: user.email,
            subject: 'Account Automatically Verified - IMDB Clone',
            template: 'auto-verification',
            data: {
              username: user.username,
              reviewCount: reviewCount,
              memberSince: user.createdAt.toLocaleDateString()
            }
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError.message);
          // Continue with other users even if email fails
        }
      }
    }
    
    console.log(`Auto-verification completed. Verified ${verifiedCount} users.`);
    
  } catch (error) {
    console.error('Error in auto-verification process:', error);
  }
};

// Schedule cron job to run every minute
const startAutoVerificationCron = () => {
  // Run every minute
  cron.schedule('* * * * *', () => {
    console.log('Running auto-verification check every minute...');
    autoVerifyUsers();
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('Auto-verification cron job scheduled to run every minute UTC');
};

// Manual trigger function for testing
const runAutoVerificationNow = async () => {
  console.log('Running auto-verification manually...');
  await autoVerifyUsers();
};

export { startAutoVerificationCron, runAutoVerificationNow }; */