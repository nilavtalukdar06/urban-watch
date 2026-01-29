import { resend } from "./lib/resend";

export async function sendEmail(
  emailTo: string,
  subject: string,
  body: string,
) {
  const { data, error } = await resend.emails.send({
    from: "Urban Watch <nilavtalukdar06@imagify.space>",
    to: [emailTo],
    subject,
    html: `<p>${body}</p>`,
  });
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  } else {
    return data;
  }
}
