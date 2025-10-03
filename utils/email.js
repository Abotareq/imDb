import nodemailer from "nodemailer";
import { autoVerificationTemplate } from "./emailTemplates.js";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
/*   tls: {
    rejectUnauthorized: false, 
  }, */
});

// Function to replace template placeholders with actual data
const replaceTemplatePlaceholders = (template, data) => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, "g"), value);
  }
  return result;
};

// Main function to send emails
export const sendEmail = async ({ email, subject, template, data }) => {
  try {
    // Validate input
    if (!email || !subject || !template) {
      throw new Error("Missing required email parameters");
    }

    // Get the email template
    const emailTemplate = autoVerificationTemplate[template];
    if (!emailTemplate) {
      throw new Error(`Email template "${template}" not found`);
    }

    // Prepare email content
    const mailOptions = {
      from: `"IMDB Clone" <${
        process.env.SMTP_FROM_EMAIL || "no-reply@imdbclone.com"
      }>`,
      to: email,
      subject: subject || emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    // Replace placeholders with actual data if provided
    if (data) {
      mailOptions.subject = replaceTemplatePlaceholders(
        mailOptions.subject,
        data
      );
      mailOptions.text = replaceTemplatePlaceholders(mailOptions.text, data);
      mailOptions.html = replaceTemplatePlaceholders(mailOptions.html, data);
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error.message);
    throw error;
  }
};

// Function to verify SMTP connection
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("SMTP connection verification failed:", error.message);
    return false;
  }
};
