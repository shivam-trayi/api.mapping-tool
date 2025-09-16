import axios from 'axios';

const BRAVO_API_KEY = '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';
const BRAVO_BASEURL = 'https://api.brevo.com/v3/';

const sendMail = async (
  to: string | string[],
  cc: string | string[] | undefined,
  subject: string,
  body: string
): Promise<{ success: boolean }> => {
  try {
    const payload = {
      sender: {
        name: 'Global web Survey',
        email: 'support@ipranker.com'  // You must use a verified sender domain in Brevo
      },
      to: Array.isArray(to)
        ? to.map(email => ({ email }))
        : [{ email: to }],
      cc: cc
        ? Array.isArray(cc)
          ? cc.map(email => ({ email }))
          : [{ email: cc }]
        : undefined,
      subject,
      htmlContent: body,
    };

    const response = await axios.post(
      `${BRAVO_BASEURL}smtp/email`,
      payload,
      {
        headers: {
          'api-key': BRAVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error: any) {
    return { success: false };
  }
};

export default sendMail;
