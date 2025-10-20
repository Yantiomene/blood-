const db = require('../db');
const logger = require('../logger');
const { CLIENT_URL, NODE_ENV } = require('../constants');
const { sendNotificationEmail } = require('../utils/email');

const DELAY_MINUTES = parseInt(process.env.MESSAGE_NOTIFICATION_DELAY_MINUTES || '10', 10);
const CHECK_INTERVAL_MS = parseInt(process.env.MESSAGE_NOTIFICATION_CHECK_INTERVAL_MS || '60000', 10);

async function findCandidates() {
  const sql = `
    SELECT m.id,
           m."recipientId",
           m."conversationId",
           m."senderId",
           m.content,
           m.created_at,
           m.metadata,
           ru.email AS recipient_email,
           ru.username AS recipient_username,
           su.username AS sender_username
    FROM messages m
    JOIN users ru ON ru.id = m."recipientId"
    JOIN users su ON su.id = m."senderId"
    WHERE m.is_read = FALSE
      AND m.created_at <= NOW() - INTERVAL '${DELAY_MINUTES} minutes'
      AND (m.metadata IS NULL OR (m.metadata::jsonb->>'notification_sent_at') IS NULL)
    ORDER BY m.created_at ASC
    LIMIT 25;
  `;
  return db.query(sql);
}

async function markSent(messageId) {
  await db.query(
    `UPDATE messages
     SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{notification_sent_at}', to_jsonb(NOW()))
     WHERE id = $1
       AND is_read = FALSE
       AND (metadata IS NULL OR (metadata::jsonb->>'notification_sent_at') IS NULL)`,
    [messageId]
  );
}

async function sendForMessage(row) {
  const { recipient_email, sender_username, conversationId, id } = row;
  const subject = 'You have a new message on Blood+';
  const link = `${CLIENT_URL}/dashboard/messages/${conversationId}`;
  const text = `You have a new message from ${sender_username}. View conversation: ${link}`;
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Message</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: #f7f7fb; margin:0; padding:24px; color:#333; }
        .card { max-width: 640px; margin:auto; background:#fff; border:1px solid #e9ecef; border-radius:12px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); padding:24px; }
        h1 { margin: 0 0 12px 0; font-size: 20px; color: #d9534f; }
        p { margin: 0 0 12px 0; }
        .btn { display:inline-block; background:#d9534f; color:#fff; text-decoration:none; padding:10px 16px; border-radius:8px; }
        .muted { color:#6c757d; font-size:12px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>New Message</h1>
        <p>You have a new message from <strong>${sender_username}</strong>.</p>
        <p><a class="btn" href="${link}" target="_blank" rel="noopener noreferrer">View Conversation</a></p>
        <p class="muted">This is a one-time notification for this message.</p>
        <p class="muted">Blood+ Team</p>
      </div>
    </body>
  </html>`;

  await sendNotificationEmail(recipient_email, subject, text, html);
  await markSent(id);
}

async function scanAndNotify() {
  try {
    const res = await findCandidates();
    const rows = res.rows || [];
    if (!rows.length) return;
    logger.info(`[MsgNotify] Found ${rows.length} delayed message(s) to notify`);

    for (const row of rows) {
      try {
        await sendForMessage(row);
      } catch (err) {
        logger.warn(`[MsgNotify] Failed to send notification for message ${row.id}: ${err.message}`);
      }
    }
  } catch (error) {
    logger.warn(`[MsgNotify] Scan failed: ${error.message}`);
  }
}

function startDelayedMessageNotifications() {
  if (NODE_ENV === 'test') return; // Skip during tests
  logger.info(`[MsgNotify] Starting delayed notifications: delay=${DELAY_MINUTES}m, interval=${CHECK_INTERVAL_MS}ms`);
  setInterval(scanAndNotify, CHECK_INTERVAL_MS);
}

module.exports = { startDelayedMessageNotifications };