import crypto from "crypto";

function generateSecretKey(length = 32) {
	const buffer = crypto.randomBytes(length);
	return buffer.toString("base64");
}

function generateOTP(secretKey, timeStep = 60, digits = 6) {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    console.log(`1. Şu anki Unix zaman damgası: ${currentUnixTime}`);

    const timeStepNumber = Math.floor(currentUnixTime / timeStep);
    console.log(`2. Zaman dilimi numarası: ${timeStepNumber}`);

    const timeBuffer = Buffer.alloc(8); // 8 byte'a çıkarıldı
    timeBuffer.writeUIntBE(timeStepNumber, 0, 4);
    console.log(`3. Zaman dilimi numarası 4 byte'lık tam sayıya dönüştürüldü: ${timeBuffer.slice(0, 4).toString("hex")}`);

    const decodedKey = Buffer.from(secretKey, "base64");
    console.log(`4. Gizli anahtar base64'ten çevrildi: ${decodedKey.toString("hex")}`);

    const hmacDigest = crypto.createHmac("sha512", decodedKey).update(timeBuffer).digest();
    console.log(`5. HMAC-SHA512 ile OTP oluşturuldu: ${hmacDigest.toString("hex")}`);

    const dynamicNumber = hmacDigest.readUIntBE(hmacDigest.length - 4, 4) & 0x7fffffff;
    console.log(`6. HMAC çıktısı dinamik sayıya dönüştürüldü: ${dynamicNumber}`);

    const generatedOTP = (dynamicNumber % Math.pow(10, digits)).toString().padStart(digits, "0");
    console.log(`7. Altı haneli OTP oluşturuldu: ${generatedOTP}`);

    // Geçerlilik süresini saniye olarak hesapla ve konsola yazdır
    const remainingSeconds = timeStep - (currentUnixTime % timeStep);
    // console.log(`\nGerçek Zamanlı Geçerlilik Süresi: ${remainingSeconds} saniye`);

    return generatedOTP ;
}


function verifyOTP(secretKey, userEnteredOTP, timeStep = 60, digits = 6) {
	const currentUnixTime = Math.floor(Date.now() / 1000);
	console.log(`1. Şu anki Unix zaman damgası: ${currentUnixTime}`);

	const timeStepNumber = Math.floor(currentUnixTime / timeStep);
	console.log(`2. Zaman dilimi numarası: ${timeStepNumber}`);

	const timeBuffer = Buffer.alloc(4);
	timeBuffer.writeUIntBE(timeStepNumber, 0, 4);
	console.log(`3. Zaman dilimi numarası 4 byte'lık tam sayıya dönüştürüldü: ${timeBuffer.toString("hex")}`);

	const decodedKey = Buffer.from(secretKey, "base64");
	const hmacDigest = crypto.createHmac("sha512", decodedKey).update(timeBuffer).digest();
	const dynamicNumber = hmacDigest.readUIntBE(hmacDigest.length - 4, 4) & 0x7fffffff;
	const generatedOTP = (dynamicNumber % Math.pow(10, digits)).toString().padStart(digits, "0");
	return userEnteredOTP === generatedOTP;
}

export { generateSecretKey, generateOTP, verifyOTP };