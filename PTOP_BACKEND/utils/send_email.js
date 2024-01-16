import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({
	port: Number(process.env.EMAIL_PORT),
	host: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});
const send_email = async (email, subject, type, text) => {
	let html_body = "";
	if (type === "forgot_password") {
		html_body = `
	<div style="background-color: #f4f4f4; padding: 20px;">
	  <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);">
		<h2 style="color: #333;">Şifremi Unuttum 😱</h2>
		<p>Merhaba,</p>
		<p>Panik yapmanıza gerek yok.</p>
		<p>Aşağıdaki bağlantıyı kullanarak yeni şifrenizi girebilirsiniz. 😎</p>
		<p><a href="${text}">Şifremi Değiştir</a></p>
		<p>İyi günler dileriz!</p>
	  </div>
	</div>
  `;
	}
	if (type === "confirm_account") {
		html_body = `
	<div style="background-color: #f4f4f4; padding: 20px;">
	  <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);">
  
		<h2 style="color: #333;">Hesap Doğrulama</h2>
		<p>Lütfen Hesap Doğrulama Kodunu İlgili Sayfaya Giriniz. </p>
		<div style="display: flex;justify-content: center;">
		<div  style="width: 30px; height: 40px; border: 1px solid #ccc; border-radius: 10px; text-align: center; font-size: 24px; margin: 0 5px; line-height: 40px; box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">${text.charAt(0)}</div>
		<div  style="width: 30px; height: 40px; border: 1px solid #ccc; border-radius: 10px; text-align: center; font-size: 24px; margin: 0 5px; line-height: 40px; box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">${text.charAt(1)}</div>
		<div  style="width: 30px; height: 40px; border: 1px solid #ccc; border-radius: 10px; text-align: center; font-size: 24px; margin: 0 5px; line-height: 40px; box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">${text.charAt(2)}</div>
		<div  style="width: 30px; height: 40px; border: 1px solid #ccc; border-radius: 10px; text-align: center; font-size: 24px; margin: 0 5px; line-height: 40px; box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">${text.charAt(3)}</div>
		<div  style="width: 30px; height: 40px; border: 1px solid #ccc; border-radius: 10px; text-align: center; font-size: 24px; margin: 0 5px; line-height: 40px; box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">${text.charAt(4)}</div>
		<div  style="width: 30px; height: 40px; border: 1px solid #ccc; border-radius: 10px; text-align: center; font-size: 24px; margin: 0 5px; line-height: 40px; box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">${text.charAt(5)}</div>
	  </div>
		<p>Aramıza Hoşgeldiniz!</p>
	  </div>
	</div>
  `;
	}

	await transporter.sendMail({
		from: process.env.EMAIL_USER,
		to: email,

		subject,
		html: html_body,
	});
};

export default send_email;
