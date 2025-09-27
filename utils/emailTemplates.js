// utils/emailTemplates.js
// Add this template to your existing email templates

export const autoVerificationTemplate = {
  'auto-verification': {
    subject: 'Congratulations! Your Account is Now Verified - IMDB Clone',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your account is now verified</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi <strong>{{username}}</strong>,</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We're excited to let you know that your account has been <strong>automatically verified</strong> based on your active participation in our community!
          </p>
          
          <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px;">Why were you verified?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #555;">
              <li style="margin-bottom: 8px;">📅 You've been a member for over 30 days</li>
              <li style="margin-bottom: 8px;">⭐ You've written <strong>{{reviewCount}} helpful reviews</strong></li>
              <li style="margin-bottom: 8px;">🏆 You're an active and valuable community member</li>
              <li>📝 Member since: <strong>{{memberSince}}</strong></li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #0284c7; font-size: 18px;">What's new for you:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #555;">
              <li style="margin-bottom: 8px;">✍️ Create and publish articles about movies and shows</li>
              <li style="margin-bottom: 8px;">✅ Your reviews now display a verified badge</li>
              <li style="margin-bottom: 8px;">🌟 Higher visibility for your contributions</li>
              <li>🎯 Access to additional platform features</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thank you for being such an engaged member of our community. Your reviews and contributions help make IMDB Clone a better place for all movie and TV enthusiasts!
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              View Your Profile
            </a>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/articles/create" 
               style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Write Your First Article
            </a>
          </div>
          
          <p style="font-size: 16px; color: #333;">
            Keep up the great work!<br>
            <strong>The IMDB Clone Team</strong>
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
            This is an automated message based on your account activity.<br>
            Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Congratulations {{username}}!
      
      Your account has been automatically verified based on your active participation in our community!
      
      Why were you verified?
      - You've been a member for over 30 days
      - You've written {{reviewCount}} helpful reviews  
      - You're an active and valuable community member
      - Member since: {{memberSince}}
      
      What's new for you:
      - Create and publish articles about movies and shows
      - Your reviews now display a verified badge
      - Higher visibility for your contributions
      - Access to additional platform features
      
      Thank you for being such an engaged member of our community. Your reviews and contributions help make IMDB Clone a better place for all movie and TV enthusiasts!
      
      Keep up the great work!
      The IMDB Clone Team
    `
  }
};